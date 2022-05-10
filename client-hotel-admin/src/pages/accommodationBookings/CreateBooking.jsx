import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router';
import { getUsers } from '../../utility/api/users';
import { getAccommodations } from '../../utility/api/accommodations';
import { getBooking } from '../../utility/api/accommodation-bookings';
import Loader from '../../components/Loader/Loader';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import TextField from '@mui/material/TextField';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import moment from 'moment';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { Button, Checkbox, Form, Select } from 'semantic-ui-react';
import { isAccommodationAvailable } from '../../utility/utility';
import axios from 'axios';

const Accommodation = () => {

    const { id: reservationId } = useParams();
    const history = useHistory();
    const [booking, setBooking] = useState({
        user: {},
        accommodation: { beds: [] }
    });

    const [accommodations, setAccommodations] = useState([])

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [dates, setDates] = useState([]);

    const [dates, setDates] = useState([null, null]);
    const [selectedBeds, setSelectedBeds] = useState(1);
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    console.log('dates: ', dates)
    // const handleDatesChange = (event, data) => setDates(data.value);

    const getInitialData = async () => {
        if (reservationId) {
            const booking = await getBooking(reservationId, setIsLoading);
            setBooking(booking)
            setSelectedAccommodation(booking.accommodation.id)
            setSelectedUser(booking.user.id)
        }
        await getUsers(setUsers, setIsLoading);
        await getAccommodations(setAccommodations, setIsLoading);

        // await getUsers(setUsers, setIsLoading)
    }

    // const submitBooking = async (event) => {
    //     event.preventDefault();
    //     const { target } = event;
    //     console.log('FormData', Object.fromEntries(new FormData(target)));
    //     console.log('target.email.value', target.email.value);
    //     const formValues = Object.fromEntries(new FormData(target));

    //     const values = {
    //         ...formValues,
    //         userId: selectedUser,
    //         bookingStart: moment.utc(dates[0]).format('YYYY-MM-DD HH:mm z'),
    //         bookingEnd: moment.utc(dates[1]).format('YYYY-MM-DD HH:mm z'),
    //         accommodationId,
    //         bedCount: selectedBeds,
    //     }
    //     const newBooking = await createBooking(values, setIsLoading)


    // }

    const submitReservation = async (values) => {
        console.log('values: ', values);

        if (reservationId) {
            const response = await axios.put(`http://localhost:3001/api/bookings/${reservationId}`, {
                bookingStart: moment.utc(dates[0]).format('YYYY-MM-DD HH:mm z'),
                bookingEnd: moment.utc(dates[1]).format('YYYY-MM-DD HH:mm z'),
                accommodationId: selectedAccommodation,
                bedCount: selectedBeds,
                userId: selectedUser,
            });

            console.log('response', response)
        } else {
            const response = await axios.post('http://localhost:3001/api/bookings', {
                bookingStart: moment.utc(dates[0]).format('YYYY-MM-DD HH:mm z'),
                bookingEnd: moment.utc(dates[1]).format('YYYY-MM-DD HH:mm z'),
                accommodationId: selectedAccommodation,
                bedCount: selectedBeds,
                userId: selectedUser,
            });

            console.log('response', response)
        }

        
    }

    useEffect(() => {
        getInitialData()
    }, []);

    const handleSelectedBeds = (e, data) => {
        setSelectedBeds(data.value)
    }

    const handleSelectedAccommodation = (e, data) => {
        setSelectedAccommodation(data.value)
    }

    const handleSelectedUser = (e, data) => {
        setSelectedUser(data.value)
    }

    if (isLoading) return <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>;

    // const bedOptions = (accommodation.beds || []).map((bed, i) => ({ key: `bed[${bed.id}]`, text: i + 1, value: i + 1 }));
    // console.log('bedOptions', bedOptions)
    console.log('users: ', users)
    return (
        <div style={{ margin: 'auto', maxWidth: 800 }}>

            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            {/* <h1 style={{ textAlign: 'center' }}>{accommodation.title}</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}> 
                {(accommodation.images.length > 0) && <img src={accommodation.images[0].url} />}
            </div> */}
            <h3 style={{ textAlign: 'center' }}>{reservationId ? 'Modify the booking' : 'Create a booking'}</h3>
            <Select onChange={handleSelectedUser} value={selectedUser} placeholder='Select a user' options={
                users.map((user, i) => {
                    return { key: i, value: user.id, text: user.firstName + ' ' + user.lastName + ' ' + user.email }
                })} />
            <Select onChange={handleSelectedAccommodation} value={selectedAccommodation} placeholder='Select an accommodation' options={
                accommodations.map((accommodation, i) => {
                    return { key: i, value: accommodation.id, text: accommodation.title }
                })} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDateRangePicker
                        displayStaticWrapperAs="desktop"
                        value={[booking.bookingStart, booking.bookingEnd]}
                        disablePast
                        shouldDisableDate={date => {
                            // console.log('date',date)
                            const formattedDate = moment(date).format('YYYY-MM-DD');

                            // console.log('formattedDate', formattedDate)
                            // return true
                            if (booking.accommodation.type === 'Dorm') {
                                const availableBeds = [];


                                booking.accommodation.beds.forEach(bed => {
                                    const isAvailable =
                                        isAccommodationAvailable(bed.accommodation_bookings, formattedDate)
                                        ||
                                        moment(formattedDate).isBefore(moment().subtract(1, 'days'), 'day')//disable dates before today

                                    if (isAvailable) { availableBeds.push(bed) }

                                })
                                return availableBeds.length > booking.accommodation.beds.length - selectedBeds
                            } else {
                                return isAccommodationAvailable(booking.accommodation.accommodation_bookings, formattedDate)
                                    ||
                                    moment(formattedDate).isBefore(moment().subtract(1, 'days'), 'day')//disable dates before today
                            }
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
            </div>
            <Select onChange={handleSelectedBeds} value={selectedBeds} placeholder='Select number of beds' options={
                reservationId ?
                    booking.accommodation.beds.map((bed, i) => {
                        return { key: i, value: i + 1, text: i + 1 + ' beds' }
                    }) : (((accommodations || []).find(accommodation => accommodation.id === selectedAccommodation) || {}).beds || []).map((bed, i) => {
                        return { key: i, value: i + 1, text: i + 1 + ' beds' }
                    })} />
            <button onClick={submitReservation}>Submit Reservation</button>
            {/* <Select placeholder='Select a user' value={selectedUser} onChange={(event, data) => setSelectedUser(data.value)} options={users} />
            <Select disabled={bedOptions.length === 0} placeholder='Select number of beds' options={bedOptions} value={selectedBeds} onChange={(event, data) => setSelectedBeds(data.value)} />
            <Form onSubmit={submitBooking}>
                <Form.Field>
                    <label>First Name</label>
                    <input name="firstName" placeholder='First Name' />
                </Form.Field>
                <Form.Field>
                    <label>Last Name</label>
                    <input name="lastName" placeholder='Last Name' />
                </Form.Field>
                <Form.Field>
                    <label>E-mail</label>
                    <input name="email" placeholder='E-mail' />
                </Form.Field>
                <Button type='submit'>Submit Booking</Button>
            </Form> */}


        </div >
    )
}

export default Accommodation
