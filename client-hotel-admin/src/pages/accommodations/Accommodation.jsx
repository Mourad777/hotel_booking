import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router';
import { getUsers } from '../../utility/api/users';
import { getAccommodation } from '../../utility/api/accommodations';
import { createBooking } from '../../utility/api/bookings';
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

const Accommodation = () => {

    const { id: accommodationId } = useParams();
    const history = useHistory();
    const [accommodation, setAccommodation] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    // const [dates, setDates] = useState([]);

    const [dates, setDates] = useState([null, null]);
    const [selectedBeds, setSelectedBeds] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    // const handleDatesChange = (event, data) => setDates(data.value);

    const getInitialData = async () => {
        const accommodation = await getAccommodation(accommodationId, setIsLoading);
        setAccommodation(accommodation)
        await getUsers(setUsers, setIsLoading)
    }

    const submitBooking = async (event) => {
        event.preventDefault();
        const { target } = event;
        console.log('FormData', Object.fromEntries(new FormData(target)));
        console.log('target.email.value', target.email.value);
        const formValues = Object.fromEntries(new FormData(target));

        const values = {
            ...formValues,
            userId: selectedUser,
            bookingStart: moment.utc(dates[0]).format('YYYY-MM-DD HH:mm z'),
            bookingEnd: moment.utc(dates[1]).format('YYYY-MM-DD HH:mm z'),
            accommodationId,
            bedCount: selectedBeds,
        }
        const newBooking = await createBooking(values, setIsLoading)


    }
    console.log('selectedUser', selectedUser)
    useEffect(() => {
        getInitialData()
    }, []);

    if (isLoading) return <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>;

    const bedOptions = (accommodation.beds||[]).map((bed, i) => ({ key: `bed[${bed.id}]`, text: i + 1, value: i + 1 }));
    console.log('bedOptions', bedOptions)

    return (
        <div style={{ margin: 'auto', maxWidth: 800 }}>

            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <h1 style={{ textAlign: 'center' }}>{accommodation.title}</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={accommodation.image} />
            </div>
            <h3 style={{ textAlign: 'center' }}>Create a booking</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDateRangePicker
                        displayStaticWrapperAs="desktop"
                        value={dates}
                        disablePast
                        shouldDisableDate={date => {
                            // console.log('date',date)
                            const formattedDate = moment(date).format('YYYY-MM-DD');

                            // console.log('formattedDate', formattedDate)
                            // return true
                            if (accommodation.type === 'Dorm') {
                                const availableBeds = [];

                                accommodation.beds.forEach(bed => {
                                    const isAvailable =
                                        isAccommodationAvailable(bed.accommodation_bookings, formattedDate)
                                        ||
                                        moment(formattedDate).isBefore(moment().subtract(1, 'days'), 'day')//disable dates before today

                                    if (isAvailable) { availableBeds.push(bed) }

                                })
                                return availableBeds.length > accommodation.beds.length - selectedBeds
                            } else {
                                return isAccommodationAvailable(accommodation.accommodation_bookings, formattedDate)
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
            <Select placeholder='Select a user' value={selectedUser} onChange={(event, data) => setSelectedUser(data.value)} options={users} />
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
            </Form>


        </div >
    )
}

export default Accommodation
