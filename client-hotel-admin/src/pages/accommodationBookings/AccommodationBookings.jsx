import React, { useState, useEffect, Fragment } from 'react'
import { StyledThumbnailPreview } from '../../StyledComponents';
import { useHistory } from 'react-router';
import { getBookings } from '../../utility/api/accommodation-bookings';
import Loader from '../../components/Loader/Loader';
import { Button, Divider, Select } from 'semantic-ui-react'
import moment from 'moment';
import { getUsers } from '../../utility/api/users';
import { getAccommodations } from '../../utility/api/accommodations';
import { deleteBooking } from '../../utility/api/accommodation-bookings';
import { useWindowSize } from '../../utility/windowSize';
import styled from 'styled-components';

const StyledSelect = styled(Select)`width:100%;`

const { REACT_APP_AWS_URL } = process.env;

const Posts = ({ winSize }) => {

    const history = useHistory();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    const [accommodations, setAccommodations] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const getInitialData = async () => {
        await getBookings(setBookings, setIsLoading);
        await getUsers(setUsers, setIsLoading);
        await getAccommodations(setAccommodations, setIsLoading);
    }

    useEffect(() => {
        getInitialData();
    }, []);

    const handleDeleteBooking = async (bookingId) => {
        await deleteBooking(bookingId, setIsLoading)
    }

    const handleClearFilters = () => {
        setSelectedAccommodation(null);
        setSelectedUser(null);
    }

    const windowSize = useWindowSize()

    if (isLoading) {
        return <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>
    } else {
        return (
            <div style={{ margin: 'auto', maxWidth: 800 }}>
                <h1 style={{ textAlign: 'center' }}>Bookings</h1>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20, flexDirection: windowSize[0] > 700 ? 'row' : 'column', }}>
                    <div style={{ margin: '20px auto', width: 300 }}>
                        <h4>Select an accommodation</h4>
                        <StyledSelect
                            value={selectedAccommodation}
                            onChange={(event, data) => setSelectedAccommodation(data.value)}
                            placeholder='Select an accommodation'
                            options={accommodations.map(accommodation => ({ key: `accommodation[${accommodation.id}]`, value: accommodation.id, text: accommodation.title }))}
                        />
                    </div>
                    <div style={{ margin: '20px auto', width: 300 }}>
                        <h4>Select a person</h4>
                        <StyledSelect
                            value={selectedUser}
                            onChange={(event, data) => setSelectedUser(data.value)}
                            placeholder='Select a person'
                            options={
                                users.map(user => ({ key: `accommodation[${user.id}]`, value: user.id, text: user.firstName + ' ' + user.lastName + ' ' + user.email }))
                            } />
                    </div>
                </div>
                <div style={{ width: 300, margin: 'auto' }}>
                    <Button style={{ width: '100%' }} onClick={handleClearFilters}>Clear Filters</Button>
                </div>
                <div style={{ marginTop: 30 }}>
                    {windowSize[0] > 700 ? <table style={{ margin: 'auto', width: '100%' }}>
                        <tbody>
                            <tr>
                                <th style={{ fontSize: '1.2em' }}></th>
                                <th style={{ fontSize: '1.2em', textAlign: 'left' }}></th>
                                <th style={{ fontSize: '1.2em' }}>Check-in date</th>
                                <th style={{ fontSize: '1.2em' }}>Check-out date</th>
                                <th style={{ fontSize: '1.2em' }}>Guest</th>
                                <th style={{ fontSize: '1.2em' }}>Guest E-mail</th>
                            </tr>
                            {bookings
                                .filter(booking => (!!selectedUser && booking.userId === selectedUser) || !selectedUser)
                                .filter(booking => (!!selectedAccommodation && booking.accommodationId === selectedAccommodation) || !selectedAccommodation)
                                .map((booking, i) => {
                                    return (
                                        <Fragment key={booking.id}>
                                            <tr style={{ height: 100 }}>
                                                <td style={{ fontSize: '1.2em' }}><span>{i + 1}</span></td>
                                                <td onClick={() => history.push(`/create-reservation/${booking.id}`)} style={{ cursor: 'pointer', fontSize: '1.2em', textAlign: 'left' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}><img style={{ width: 200, cursor: 'pointer' }} src={REACT_APP_AWS_URL + (booking.accommodation.images[0] || {}).url} /><span>{booking.accommodation.title}</span></div></td>
                                                <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{moment.utc(booking.bookingStart).format('YYYY-MM-DD')}</td>
                                                <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{moment.utc(booking.bookingEnd).format('YYYY-MM-DD')}</td>
                                                <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{booking.user.firstName + ' ' + booking.user.lastName}</td>
                                                <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{booking.user.email}</td>
                                                <td style={{ fontSize: '1.2em', textAlign: 'center' }}><Button onClick={() => handleDeleteBooking(booking.id)}>Delete</Button></td>
                                            </tr>
                                        </Fragment>
                                    )
                                })
                            }
                        </tbody>
                    </table> : <Fragment>
                        {bookings
                            .filter(booking => (!!selectedUser && booking.userId === selectedUser) || !selectedUser)
                            .filter(booking => (!!selectedAccommodation && booking.accommodationId === selectedAccommodation) || !selectedAccommodation)
                            .map((booking, i) => {
                                return (
                                    <div key={booking.id}>
                                        <h3>{booking.accommodation.title}</h3>
                                        <img onClick={() => history.push(`/create-reservation/${booking.id}`)} style={{ cursor: 'pointer', width: '100%', cursor: 'pointer' }} src={REACT_APP_AWS_URL + (booking.accommodation.images[0] || {}).url} />
                                        <p style={{ fontSize: '1.2em' }}>From {moment.utc(booking.bookingStart).format('YYYY-MM-DD')}</p>
                                        <p style={{ fontSize: '1.2em' }}>To {moment.utc(booking.bookingEnd).format('YYYY-MM-DD')}</p>
                                        <p style={{ fontSize: '1.2em' }}>{booking.user.firstName + ' ' + booking.user.lastName}</p>
                                        <p style={{ fontSize: '1.2em' }}>{booking.user.email}</p>
                                        <Button style={{ width: '100%' }} onClick={() => handleDeleteBooking(booking.id)}>Delete</Button>
                                        <Divider />
                                    </div>
                                )
                            })
                        }
                    </Fragment>}
                </div>
            </div >
        )
    }
}

export default Posts
