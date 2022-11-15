import React, { useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router';
import { getBookings } from '../../utility/api/accommodation-bookings';
import Loader from '../../components/Loader/Loader';
import { Button, Divider } from 'semantic-ui-react'
import moment from 'moment';
import { getUsers } from '../../utility/api/users';
import { getAccommodations } from '../../utility/api/accommodations';
import { deleteBooking } from '../../utility/api/accommodation-bookings';
import { useWindowSize } from '../../utility/windowSize';
import {
    StyledDeleteButton,
    StyledFilterButton,
    StyledFilterButtonContainer,
    StyledMainContainer,
    StyledMainContentWrapper,
    StyledMobileDetail,
    StyledMobileImage,
    StyledSelect,
    StyledSelectContainer,
    StyledSelectsWrapper,
    StyledTable,
    StyledTableData,
    StyledTableHead,
    StyledTableImage,
    StyledTableImageWrapper,
    StyledTableRow,
    StyledTitle
} from '../styles/accommodation-bookings';
const { REACT_APP_AWS_URL } = process.env;

const Posts = () => {

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
        return <Loader />
    } else {
        return (
            <StyledMainContainer>
                <StyledTitle>Bookings</StyledTitle>
                <StyledSelectsWrapper windowSize={windowSize}>
                    <StyledSelectContainer>
                        <h4>Select an accommodation</h4>
                        <StyledSelect
                            value={selectedAccommodation}
                            onChange={(event, data) => setSelectedAccommodation(data.value)}
                            placeholder='Select an accommodation'
                            options={accommodations.map(accommodation => ({ key: `accommodation[${accommodation.id}]`, value: accommodation.id, text: accommodation.title }))}
                        />
                    </StyledSelectContainer>
                    <StyledSelectContainer>
                        <h4>Select a person</h4>
                        <StyledSelect
                            value={selectedUser}
                            onChange={(event, data) => setSelectedUser(data.value)}
                            placeholder='Select a person'
                            options={
                                users.map(user => ({ key: `accommodation[${user.id}]`, value: user.id, text: user.firstName + ' ' + user.lastName + ' ' + user.email }))
                            } />
                    </StyledSelectContainer>
                </StyledSelectsWrapper>
                <StyledFilterButtonContainer>
                    <StyledFilterButton onClick={handleClearFilters}>Clear Filters</StyledFilterButton>
                </StyledFilterButtonContainer>
                <StyledMainContentWrapper>
                    {windowSize[0] > 700 ? <StyledTable>
                        <tbody>
                            <tr>
                                <StyledTableHead></StyledTableHead>
                                <StyledTableHead></StyledTableHead>
                                <StyledTableHead>Check-in date</StyledTableHead>
                                <StyledTableHead>Check-out date</StyledTableHead>
                                <StyledTableHead>Guest</StyledTableHead>
                                <StyledTableHead>Guest E-mail</StyledTableHead>
                            </tr>
                            {bookings
                                .filter(booking => (!!selectedUser && booking.userId === selectedUser) || !selectedUser)
                                .filter(booking => (!!selectedAccommodation && booking.accommodationId === selectedAccommodation) || !selectedAccommodation)
                                .map((booking, i) => {
                                    return (
                                        <Fragment key={booking.id}>
                                            <StyledTableRow>
                                                <StyledTableData><span>{i + 1}</span></StyledTableData>
                                                <StyledTableData onClick={() => history.push(`/create-reservation/${booking.id}`)}>
                                                    <StyledTableImageWrapper>
                                                        <StyledTableImage src={REACT_APP_AWS_URL + (booking.accommodation.images[0] || {}).url} />
                                                        <span>{booking.accommodation.title}</span>
                                                    </StyledTableImageWrapper>
                                                </StyledTableData>
                                                <StyledTableData>{moment.utc(booking.bookingStart).format('YYYY-MM-DD')}</StyledTableData>
                                                <StyledTableData>{moment.utc(booking.bookingEnd).format('YYYY-MM-DD')}</StyledTableData>
                                                <StyledTableData>{booking.user.firstName + ' ' + booking.user.lastName}</StyledTableData>
                                                <StyledTableData>{booking.user.email}</StyledTableData>
                                                <StyledTableData><Button onClick={() => handleDeleteBooking(booking.id)}>Delete</Button></StyledTableData>
                                            </StyledTableRow>
                                        </Fragment>
                                    )
                                })
                            }
                        </tbody>
                    </StyledTable> : <Fragment>
                        {bookings
                            .filter(booking => (!!selectedUser && booking.userId === selectedUser) || !selectedUser)
                            .filter(booking => (!!selectedAccommodation && booking.accommodationId === selectedAccommodation) || !selectedAccommodation)
                            .map((booking, i) => {
                                return (
                                    <div key={booking.id}>
                                        <h3>{booking.accommodation.title}</h3>
                                        <StyledMobileImage
                                            onClick={() => history.push(`/create-reservation/${booking.id}`)}
                                            src={REACT_APP_AWS_URL + (booking.accommodation.images[0] || {}).url}
                                        />
                                        <StyledMobileDetail>From {moment.utc(booking.bookingStart).format('YYYY-MM-DD')}</StyledMobileDetail>
                                        <StyledMobileDetail>To {moment.utc(booking.bookingEnd).format('YYYY-MM-DD')}</StyledMobileDetail>
                                        <StyledMobileDetail>{booking.user.firstName + ' ' + booking.user.lastName}</StyledMobileDetail>
                                        <StyledMobileDetail>{booking.user.email}</StyledMobileDetail>
                                        <StyledDeleteButton onClick={() => handleDeleteBooking(booking.id)}>Delete</StyledDeleteButton>
                                        <Divider />
                                    </div>
                                )
                            })
                        }
                    </Fragment>}
                </StyledMainContentWrapper>
            </StyledMainContainer >
        )
    }
}

export default Posts
