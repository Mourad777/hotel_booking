import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Switch,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import {
    StyledAccommodationPrice,
    StyledMainContainer,
    StyledMainImage,
    StyledMainTitle,
    StyledFormWrapper,
    StyledBookingMessageContainer,
    StyledBookingMessage,
} from './styles/booking'
import Loader from '../components/Loader/Loader';
import { isAccommodationAvailable } from '../utility/utils';
const { REACT_APP_AWS_URL } = process.env;
const { RangePicker } = DatePicker;
const { REACT_APP_API_URL } = process.env;

export default function Booking({ match, handleAccommodationDates, selectedAccommodationDates }) {

    const [formValues, setFormValues] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [accommodation, setAccommodation] = useState({ images: [], amenities: [] })
    const [bookingMessage, setBookingMessage] = useState(null);

    const accommodationId = match.params.accommodationId

    const handleForm = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormValues({ ...formValues, [name]: value });
    }

    const getAccommodationDetails = async () => {
        setIsLoading(true)
        const res = await axios.get(`${REACT_APP_API_URL}/accommodations/${accommodationId}`);
        console.log('res', res)
        setAccommodation(res.data);
        setIsLoading(false)
    }

    useEffect(() => {
        getAccommodationDetails()
    }, [])

    const submitReservation = async (values) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${REACT_APP_API_URL}/bookings`, {
                ...formValues,
                bookingStart: moment.utc(selectedAccommodationDates[0]).format('YYYY-MM-DD HH:mm z'),
                bookingEnd: moment.utc(selectedAccommodationDates[1]).format('YYYY-MM-DD HH:mm z'),
                accommodationId: accommodation.id,
            });
            console.log('response', response)
            const bookingMessage = `Successfully booked ${accommodation.title} from ${selectedAccommodationDates[0]} to ${selectedAccommodationDates[1]}`
            setBookingMessage(bookingMessage)
            setIsLoading(false)
        } catch (e) {
            console.log('e',e.response.data)
            setBookingMessage(e.response.data) 
            setIsLoading(false)
        }
    }

    const onDateSelect = (value) => {
        if (!value) return;
        handleAccommodationDates(value)
    }
    if (bookingMessage) {
        return <StyledBookingMessageContainer>
            <StyledBookingMessage>{bookingMessage}</StyledBookingMessage>
        </StyledBookingMessageContainer>
    }
    if (isLoading) {
        return <Loader />
    } else {
        return (
            <StyledMainContainer>
                <StyledMainTitle>Booking</StyledMainTitle>
                {accommodation.images.length > 0 && <StyledMainImage src={REACT_APP_AWS_URL + accommodation.images[0].url} />}
                <StyledFormWrapper>
                    <Form layout="vertical" size="large">
                        <Form.Item label=" ">
                            <RangePicker
                                value={selectedAccommodationDates}
                                placeholder={["Check-in", "Check-out"]}
                                onChange={onDateSelect}
                                disabledDate={current => {
                                    const formattedDate = current.format('YYYY-MM-DD');

                                    return isAccommodationAvailable(accommodation.accommodation_bookings, formattedDate)
                                        ||
                                        moment(formattedDate).isBefore(moment().subtract(1, 'days'), 'day')//disable dates before today

                                }}
                            />
                        </Form.Item>
                        <Form.Item label="First name">
                            <Input value={formValues.firstName} name="firstName" onChange={handleForm} />
                        </Form.Item>
                        <Form.Item label="Last name">
                            <Input value={formValues.lastName} name="lastName" onChange={handleForm} />
                        </Form.Item>
                        <Form.Item label="E-mail">
                            <Input value={formValues.email} name="email" onChange={handleForm} />
                        </Form.Item>
                        <Form.Item label="Credit card">
                            <Input disabled value={formValues.creditCard} name="creditCard" onChange={handleForm} />
                        </Form.Item>
                        <Form.Item labelAlign='horizontal' label="I agree to the terms and conditions" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <StyledAccommodationPrice>{`${accommodation.price}$ per night`}</StyledAccommodationPrice>
                        <Form.Item>
                            <Button onClick={submitReservation}>Reserve</Button>
                        </Form.Item>
                    </Form>
                </StyledFormWrapper>
            </StyledMainContainer>
        )
    }
}
