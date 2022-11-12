import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import { getUsers } from '../../utility/api/users';
import { getAccommodation } from '../../utility/api/accommodations';
import { createBooking } from '../../utility/api/accommodation-bookings';
import Loader from '../../components/Loader/Loader';
import TextField from '@mui/material/TextField';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import moment from 'moment';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { Button, Form, Select } from 'semantic-ui-react';
import { isAccommodationAvailable } from '../../utility/utility';


const { REACT_APP_AWS_URL } = process.env;

const Accommodation = () => {

    const { id: accommodationId } = useParams();
    const [accommodation, setAccommodation] = useState({ images: [] });
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const [dates, setDates] = useState([null, null]);
    const [selectedUser, setSelectedUser] = useState(null);

    const getInitialData = async () => {
        const accommodation = await getAccommodation(accommodationId, setIsLoading);
        setAccommodation(accommodation)
        await getUsers(setUsers, setIsLoading)
    }

    const submitBooking = async (event) => {
        event.preventDefault();
        const { target } = event;

        const formValues = Object.fromEntries(new FormData(target));

        const values = {
            ...formValues,
            userId: selectedUser,
            bookingStart: moment.utc(dates[0]).format('YYYY-MM-DD HH:mm z'),
            bookingEnd: moment.utc(dates[1]).format('YYYY-MM-DD HH:mm z'),
            accommodationId,
        }
        await createBooking(values, setIsLoading)


    }
    useEffect(() => {
        getInitialData()
    }, []);

    if (isLoading) return <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>;

    return (
        <div style={{ margin: 'auto', maxWidth: 800 }}>

            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <h1 style={{ textAlign: 'center' }}>{accommodation.title}</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {(accommodation.images.length > 0) && <img src={REACT_APP_AWS_URL + accommodation.images[0].url} />}
            </div>
            <h3 style={{ textAlign: 'center' }}>Create a booking</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDateRangePicker
                        displayStaticWrapperAs="desktop"
                        value={dates}
                        disablePast
                        shouldDisableDate={date => {
                            const formattedDate = moment(date).format('YYYY-MM-DD');
                            return isAccommodationAvailable(accommodation.accommodation_bookings, formattedDate)
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
            </div>
            <Select placeholder='Select a user' value={selectedUser} onChange={(event, data) => setSelectedUser(data.value)} options={users} />
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
            </Form>


        </div >
    )
}

export default Accommodation
