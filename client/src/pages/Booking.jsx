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

const { RangePicker } = DatePicker;

export default function Booking({ match }) {
    let bookingType;
    const accommodationId = match.params.accommodationId
    const tourId = match.params.tourId
    if (accommodationId) bookingType = 'accommodation';
    if (tourId) bookingType = 'tour';

    const submitReservation = (values) => {
        console.log('values: ', values)
    }

    return (
        <div style={{maxWidth:500 }}>
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
                    <Input />
                </Form.Item>
                <Form.Item label="Last name">
                    <Input />
                </Form.Item>
                <Form.Item label="E-mail">
                    <Input />
                </Form.Item>
                <Form.Item label="Select">
                    <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="DatePicker">
                    <RangePicker />
                </Form.Item>
                <Form.Item label="Beds">
                    <InputNumber />
                </Form.Item>
                <Form.Item label="I am bringing a pet" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item label="Credit card information">
                    <Input />
                </Form.Item>
                <Form.Item label="I agree to the terms and conditions" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item>
                    <Button>Reserve</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
