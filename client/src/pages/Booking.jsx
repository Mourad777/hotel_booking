import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
const { RangePicker } = DatePicker;

export default function Booking({ selectedBeds, handleAccommodationDates, handleSelectedBeds, selectedAccommodation, selectedAccommodationDates }) {
    
    const [formValues,setFormValues] = useState({})

    const handleForm = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormValues({ ...formValues, [name]: value });
    }

    const submitReservation = async (values) => {
        console.log('values: ', values);

        const response = await axios.post('http://localhost:3001/api/bookings', {...formValues,
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
            <img style={{ height: 400, width: 500 }} src={selectedAccommodation.image} />
            <Form
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                size="large"
            >
                <Form.Item label="First name"> 
                    <Input value={formValues.firstName} name="firstName" onChange={handleForm} />
                </Form.Item>
                <Form.Item label="Last name">
                    <Input value={formValues.lastName} name="lastName" onChange={handleForm} />
                </Form.Item>
                <Form.Item label="E-mail">
                    <Input value={formValues.email} name="email" onChange={handleForm} />
                </Form.Item>
                {selectedAccommodation.id && <Form.Item label="Select">
                    <Select disabled={selectedAccommodation.type !== 'Dorm'} value={selectedBeds} onChange={handleSelectedBeds}>
                        {selectedAccommodation.beds.map((bed, i) => <Select.Option key={bed.id} value="demo">Bed {i + 1}</Select.Option>)}
                    </Select>
                </Form.Item>}
                <Form.Item label="DatePicker">
                    <RangePicker
                        value={selectedAccommodationDates}
                        style={{ width: '100%' }}
                        placeholder={["Check-in", "Check-out"]}
                        onChange={onDateSelect}
                    />
                </Form.Item>
                {/* <Form.Item label="Beds">
                    <InputNumber  disabled={selectedAccommodation.type !== 'Dorm'} />
                </Form.Item> */}
                <Form.Item label="I am bringing a pet" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item label="Credit card information">
                    <Input value={formValues.creditCard} name="creditCard" onChange={handleForm} />
                </Form.Item>
                <Form.Item label="I agree to the terms and conditions" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <p style={{ fontSize: '1.5em' }}>{`${selectedAccommodation.type === 'Dorm' ? selectedAccommodation.price * selectedBeds : selectedAccommodation.price}$`}</p>
                <Form.Item>
                    <Button onClick={submitReservation}>Reserve</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
