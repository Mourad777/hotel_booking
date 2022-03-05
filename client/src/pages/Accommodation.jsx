import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios'
import { DatePicker, Space } from 'antd'
import moment from 'moment';

const { RangePicker } = DatePicker;
const validateDates = (checkin, checkout) => {
    let error;
    if (checkin.isSame(checkout)) {
        return 'Check in and Check out dates cannot be the same'
    }
}

const Room = ({ match }) => {
    const room = match.params.roomId
    const [fromMomentDate, setFromDate] = useState('')
    const [toMomentDate, setToDate] = useState('')

    const [bookings, setBookings] = useState([])
    const [dateError, setDateError] = useState('')

    useEffect(() => {
        getBookings()
    }, [])


    const bookRoom = async () => {
        const response = await axios.post('http://localhost:3001/api/bookings', {
            bookingStart: moment(fromMomentDate).format('YYYY-MM-DD HH:mm z'),
            bookingEnd: moment(toMomentDate).format('YYYY-MM-DD HH:mm z'),
            roomId: room,
            userId: 1
        });

        console.log('response', response)
    }

    const onDateSelect = (value) => {
        if (!value) return;
        console.log('value', value)
        const checkinDate = moment.utc(value[0]).format('YYYY-MM-DD')
        const checkoutDate = moment.utc(value[1]).format('YYYY-MM-DD')
        //using utc will normalize the data for the server, without utc the timezones will not be taken into account
        //and the intended date may not be registered

        // const error = validateDates(checkinDate, checkoutDate)
        // if (error) {
        //     setDateError(error)
        //     return
        // } else setDateError('');
        setFromDate(checkinDate);
        setToDate(checkoutDate);
    }

    const getBookings = async () => {
        const res = await axios.get(`http://localhost:3001/api/bookings/${room}`)
        setBookings(res.data)
        console.log('res', res)
    }

    return (
        <Fragment>

            <h1 style={{ textAlign: 'center' }}>room {match.params.roomId}</h1>
            <div style={{ display: 'flex', margin: 'auto', justifyContent: 'center', flexDirection: 'column', maxWidth: 500 }}>
                <div style={{ background: '#e2e2e2', height: 400, width: '100%', }}>

                </div>
                <div style={{ padding: 30 }}>
                    <Space direction="vertical" size={12}>
                        <RangePicker
                            placeholder={["Check-in", "Check-out"]}
                            onChange={onDateSelect}
                            disabledDate={current => {
                                const formattedDate = current.format('YYYY-MM-DD');
                                return (bookings.findIndex(booking => moment(formattedDate).isBetween(booking.bookingStart, booking.bookingEnd)
                                    ||
                                    moment(formattedDate).isSame(booking.bookingStart)
                                ) > -1) //disable dates between the checkin checkout date but exclude checkout date to allow users to book on that date in the afternoon
                                    ||
                                    moment(formattedDate).isBefore(moment().subtract(1, 'days'))//disable dates before today
                            }}
                        />
                        <p> {dateError}</p>

                        <button style={{padding:10, border:'none',background:'#e2e2e2', cursor:'pointer'}} onClick={bookRoom} >Book now!</button>
                    </Space>
                </div>

            </div>
        </Fragment>
    )
}

export default Room;