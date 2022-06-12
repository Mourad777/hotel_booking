import React, { useState, useEffect, Fragment } from 'react'
import { StyledThumbnailPreview } from '../../StyledComponents';
import { useHistory } from 'react-router';
import { getBookings } from '../../utility/api/accommodation-bookings';
import Loader from '../../components/Loader/Loader';
import { Select } from 'semantic-ui-react'
import moment from 'moment';
import { getUsers } from '../../utility/api/users';
import { getAccommodations } from '../../utility/api/accommodations';
import { AWSURL } from '../../utility/utility';


const Posts = ({ winSize }) => {

    const history = useHistory();
    const [bookings, setBookings] = useState([]);
    const [selectedBed, setSelectedBed] = useState(null);
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

    const handleClearFilters = () => {
        setSelectedAccommodation(null);
        setSelectedUser(null);
    }

    console.log('selectedAccommodation', selectedAccommodation)
    console.log('bookings', bookings)
    if (isLoading) {
        return <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>
    } else {
        return (
            <div style={{ margin: 'auto', maxWidth: 800 }}>
                <h1>Bookings</h1>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
                    <div>
                        <h4>Select an accommodation</h4>
                        <Select
                            value={selectedAccommodation}
                            onChange={(event, data) => setSelectedAccommodation(data.value)}
                            placeholder='Select an accommodation'
                            options={accommodations.map(accommodation => ({ key: `accommodation[${accommodation.id}]`, value: accommodation.id, text: accommodation.title }))}
                        />
                    </div>
                    <div>
                        <h4>Select a person</h4>
                        <Select
                            value={selectedUser}
                            onChange={(event, data) => setSelectedUser(data.value)}
                            placeholder='Select a person'
                            options={
                                users.map(user => ({ key: `accommodation[${user.id}]`, value: user.id, text: user.firstName + ' ' + user.lastName + ' ' + user.email }))
                            } />
                    </div>
                    <div>
                        <button onClick={handleClearFilters}>Clear Filters</button>
                    </div>
                </div>
                <table style={{ margin: 'auto', width: '100%' }}>
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
                            .map((booking, i) => (
                                <Fragment key={booking.id}>
                                    <tr style={{ height: 100 }}>
                                        <td style={{ fontSize: '1.2em' }}><span>{i + 1}</span></td>
                                        <td onClick={() => history.push(`/create-reservation/${booking.id}`)} style={{ cursor: 'pointer', fontSize: '1.2em', textAlign: 'left' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}><img style={{ width: 200, cursor: 'pointer' }} src={AWSURL + booking.accommodation.images[0].url} /><span>{booking.accommodation.title}</span></div></td>
                                        <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{moment.utc(booking.bookingStart).format('YYYY-MM-DD')}</td>
                                        <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{moment.utc(booking.bookingEnd).format('YYYY-MM-DD')}</td>
                                        <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{booking.user.firstName + ' ' + booking.user.lastName}</td>
                                        <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{booking.user.email}</td>
                                    </tr>
                                </Fragment>
                            ))
                        }
                    </tbody>
                </table>
            </div >
        )
    }
}

export default Posts
