import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import { getUsers } from '../../utility/api/users';
import { getAccommodations } from '../../utility/api/accommodations';
import { getBooking } from '../../utility/api/accommodation-bookings';
import Loader from '../../components/Loader/Loader';
import TextField from '@mui/material/TextField';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import moment from 'moment';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { Button } from 'semantic-ui-react';
import { isAccommodationAvailable } from '../../utility/utility';
import axios from 'axios';
import { useWindowSize } from '../../utility/windowSize';
import {
    StyledContentWrapper,
    StyledMainWrapper,
    StyledSelect,
    StyledSelectContainer,
    StyledSelectsWrapper,
    StyledSubmitButtonContainer,
    StyledTitle
} from '../styles/create-booking'
const { REACT_APP_API_URL } = process.env;

const Accommodation = () => {

    const { id: reservationId } = useParams();
    const [booking, setBooking] = useState({
        user: {},
        accommodation: {}
    });

    const [accommodations, setAccommodations] = useState([])
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dates, setDates] = useState([null, null]);
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const getInitialData = async () => {
        if (reservationId) {
            const booking = await getBooking(reservationId, setIsLoading);
            setBooking(booking)
            setSelectedAccommodation(booking.accommodation.id)
            setSelectedUser(booking.user.id)
        }
        await getUsers(setUsers, setIsLoading);
        await getAccommodations(setAccommodations, setIsLoading);
    }

    const submitReservation = async (values) => {

        if (reservationId) {
            const response = await axios.put(`${REACT_APP_API_URL}/bookings/${reservationId}`, {
                bookingStart: moment.utc(dates[0]).format('YYYY-MM-DD HH:mm z'),
                bookingEnd: moment.utc(dates[1]).format('YYYY-MM-DD HH:mm z'),
                accommodationId: selectedAccommodation,
                userId: selectedUser,
            });
            console.log('booking response',response)


        } else {
            const response = await axios.post(`${REACT_APP_API_URL}/bookings`, {
                bookingStart: moment.utc(dates[0]).format('YYYY-MM-DD HH:mm z'),
                bookingEnd: moment.utc(dates[1]).format('YYYY-MM-DD HH:mm z'),
                accommodationId: selectedAccommodation,
                userId: selectedUser,
            });
            console.log('booking response',response)
        }
    }

    useEffect(() => {
        getInitialData()
    }, []);

    const handleSelectedAccommodation = (e, data) => {
        setSelectedAccommodation(data.value)
    }

    const handleSelectedUser = (e, data) => {
        setSelectedUser(data.value)
    }

    const windowSize = useWindowSize()

    if (isLoading) return <Loader />;

    return (
        <StyledMainWrapper>
            {isLoading && <Loader />}
            <StyledTitle>{reservationId ? 'Modify the booking' : 'Create a booking'}</StyledTitle>
            <StyledSelectsWrapper windowSize={windowSize}>
                <StyledSelectContainer>
                    <StyledSelect onChange={handleSelectedUser} value={selectedUser} placeholder='Select a user' options={
                        users.map((user, i) => {
                            return { key: i, value: user.id, text: user.firstName + ' ' + user.lastName + ' ' + user.email }
                        })} />
                </StyledSelectContainer>
                <StyledSelectContainer>
                    <StyledSelect onChange={handleSelectedAccommodation} value={selectedAccommodation} placeholder='Select an accommodation' options={
                        accommodations.map((accommodation, i) => {
                            return { key: i, value: accommodation.id, text: accommodation.title }
                        })} />
                </StyledSelectContainer>
            </StyledSelectsWrapper>
            <StyledContentWrapper>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDateRangePicker
                        displayStaticWrapperAs={windowSize[0] > 900 ? 'desktop' : 'mobile'}
                        value={[booking.bookingStart, booking.bookingEnd]}
                        disablePast
                        shouldDisableDate={date => {
                            const formattedDate = moment(date).format('YYYY-MM-DD');
                            return isAccommodationAvailable(booking.accommodation.accommodation_bookings, formattedDate)
                                ||
                                moment(formattedDate).isBefore(moment().subtract(1, 'days'), 'day')//disable dates before today
                        }}
                        onChange={(newValue) => setDates(newValue)}
                        renderInput={(startProps, endProps) => (
                            <React.Fragment>
                                <TextField {...startProps} />
                                <Box sx={{ mx: 2 }}> to </Box>
                                <TextField {...endProps} />
                            </React.Fragment>
                        )}
                    />
                </LocalizationProvider>
            </StyledContentWrapper>
            <StyledSubmitButtonContainer>
                <Button onClick={submitReservation}>Submit Reservation</Button>
            </StyledSubmitButtonContainer>
        </StyledMainWrapper >
    )
}

export default Accommodation
