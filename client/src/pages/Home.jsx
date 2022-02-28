import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { DatePicker, Space } from 'antd'
import { StyledRoomListItem } from '../components/room-list-item/RoomListItem';
const { RangePicker } = DatePicker;

const validateDates = (checkin, checkout) => {
    let error = '';
    if (checkin.isSame(checkout)) {
        error = 'Check in and Check out dates cannot be the same'
    }
    return error
}

const Header = ({ children }) => (
    <div style={{ height: 700, background: 'blue', width: '100%', position: 'relative' }}>
        {/* <img  /> */}
        {children}
    </div>
)

const Rooms = ({ rooms }) => (
    <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }}>
            <div style={{
                gridRowStart: 1,
                gridColumnStart: 1,
                gridRowEnd: 'span 2',
                gridColumnEnd: 'span 2',
                background: 'red',
                height: 400,
            }}><h1>a</h1>
            </div>

            <div style={{
                gridRowStart: 1,
                gridColumnStart: 3,
                gridRowEnd: 'span 2',
                gridColumnEnd: 'span 2',
                background: 'green',
                height: 400,
            }}><h1>b</h1>
            </div>

            <div style={{
                gridRowStart: 2,
                gridColumnStart: 1,
                gridRowEnd: 'span 2',
                gridColumnEnd: 'span 1',
                background: 'purple',
                height: 400,
            }}><h1>c</h1>
            </div>

            <div style={{
                gridRowStart: 2,
                gridColumnStart: 2,
                gridRowEnd: 'span 2',
                gridColumnEnd: 'span 3',
                background: 'blue',
                height: 400,
            }}><h1>d</h1>
            </div>
        </div>

        <ul>
            {rooms.map(room => <li>
                <Link to={`/room/${room.id}`}>{room.id}</Link>
                <p>Capacity: {room.capacity}</p>
                {room.isWifi && <p>Wifi</p>}
            </li>)}
        </ul>
    </div>
)

const Home = () => {

    // const [fromMomentDate, setFromMomentDate] = useState('')
    // const [toMomentDate, setToMomentDate] = useState('')
    const [adults, setAdults] = useState('')
    const [children, setChildren] = useState('')
    const [rooms, setRooms] = useState([])
    const [dateError, setDateError] = useState('')

    const onDateSelect = (value) => {
        if (!value) return;
        const checkinDate = moment(value[0])
        const checkoutDate = moment(value[1])
        // const error = validateDates(checkinDate, checkoutDate)
        // if (error) {
        //     setDateError(error)
        //     return
        // } else setDateError('')
        getRooms(checkinDate, checkoutDate)
        // setFromMomentDate(checkinDate);
        // setToMomentDate(checkoutDate);
    }
    const getRooms = async (fromDate, toDate) => {
        const checkinDate = moment(fromDate).format('YYYY-MM-DD HH:mm z');
        const checkoutDate = moment(toDate).format('YYYY-MM-DD HH:mm z');
        const res = await axios.get(`http://localhost:3001/api/rooms/${checkinDate}/${checkoutDate}`);
        setRooms(res.data)
        console.log('res rooms', res)
    }

    return (
        <Fragment>
            <Header >
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                    <Space direction="vertical" size={12}>
                        <RangePicker
                            placeholder={["Check-in", "Check-out"]}
                            onChange={onDateSelect}
                            disabledDate={current => {
                                const currentWithoutTime = current.format('YYYY-MM-DD');
                                return moment(currentWithoutTime).isBefore(moment().subtract(1, 'days')); //disable all dates before today
                            }}
                        />
                        <p> {dateError}</p>
                    </Space>
                </div>
            </Header>
            {/* <Rooms rooms={rooms} /> */}
            {rooms.map(room =>(
                <StyledRoomListItem>

                </StyledRoomListItem>
            ))}
        </Fragment>
    )
}

export default Home;