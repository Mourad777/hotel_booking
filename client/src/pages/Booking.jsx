import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Switch,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
const { REACT_APP_AWS_URL } = process.env;

const { RangePicker } = DatePicker;
const { REACT_APP_API_URL } = process.env;
export default function Booking({ selectedBeds, handleAccommodationDates, handleSelectedBeds, selectedAccommodation, selectedAccommodationDates }) {

    const [formValues, setFormValues] = useState({})

    const handleForm = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormValues({ ...formValues, [name]: value });
    }

    const submitReservation = async (values) => {

        const response = await axios.post(`${REACT_APP_API_URL}/bookings`, {
            ...formValues,
            bookingStart: moment.utc(selectedAccommodationDates[0]).format('YYYY-MM-DD HH:mm z'),
            bookingEnd: moment.utc(selectedAccommodationDates[1]).format('YYYY-MM-DD HH:mm z'),
            accommodationId: selectedAccommodation.id,
            bedCount: selectedBeds,
        });

        console.log('response', response)
    }

    const onDateSelect = (value) => {
        if (!value) return;
        handleAccommodationDates(value)
    }

    return (
        <div style={{ maxWidth: 700, margin: 'auto', padding: 30 }}>
            <h1 style={{ textAlign: 'center' }}>Booking</h1>
            {selectedAccommodation.images.length > 0 && <img style={{ height: 400, width: 500 }} src={REACT_APP_AWS_URL + selectedAccommodation.images[0].url} />}
            <Form
                labelCol={{
                    span: 14,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="vertical"
                size="large"
            >
                <Form.Item label=" ">
                    <RangePicker
                        value={selectedAccommodationDates}
                        placeholder={["Check-in", "Check-out"]}
                        onChange={onDateSelect}
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
                    <Input value={formValues.creditCard} name="creditCard" onChange={handleForm} />
                </Form.Item>
                <Form.Item labelAlign='horizontal' label="I agree to the terms and conditions" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <p style={{ fontSize: '1.5em' }}>{`${selectedAccommodation.type === 'Dorm' ? selectedAccommodation.price * selectedBeds : selectedAccommodation.price}$ for `}</p>
                <Form.Item>
                    <Button onClick={submitReservation}>Reserve</Button>
                </Form.Item>
            </Form>

        </div>
    )
}
