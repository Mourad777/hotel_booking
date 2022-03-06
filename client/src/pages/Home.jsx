import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { DatePicker, Space, Menu, Dropdown, Select  } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import { StyledRoomListItem } from '../components/room-list-item/RoomListItem';
import { StyledRoomThumbnail, StyledRoomThumbnailContainer } from '../components/room-thumbnail/RoomThumbnail';
import { StyledRoomDescription, StyledRoomDescriptionContainer } from '../components/room-description/RoomDescription';
const { Option } = Select;

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

const Home = (props) => {
    console.log('props');
    const {handleAccommodationDates,accommodationDates} = props;
    // const [fromMomentDate, setFromMomentDate] = useState('')
    // const [toMomentDate, setToMomentDate] = useState('')
    const [adults, setAdults] = useState('')
    const [children, setChildren] = useState('')
    const [accommodations, setAccommodations] = useState([])
    const [dateError, setDateError] = useState('')

    function onChange(value) {
        console.log(`selected ${value}`);
      }

    const getAccommodations = async (value) => {
        if (!value || (value[0] === value[1])) return;
       
        const fromDate = moment(value[0]);
        const toDate = moment(value[1]);
        handleAccommodationDates(value);
        const checkinDateFormatted = moment(fromDate).format('YYYY-MM-DD HH:mm z');
        const checkoutDateFormatted = moment(toDate).format('YYYY-MM-DD HH:mm z');
        console.log('checkinDateFormatted',checkinDateFormatted,'checkoutDateFormatted',checkoutDateFormatted)
        const res = await axios.get(`http://localhost:3001/api/accommodations/${checkinDateFormatted}/${checkoutDateFormatted}`);
        console.log('res accommodations', res)
        setAccommodations(res.data)
        
    }


    const handleDetails = () => {

    }

    useEffect(() => {
        if (accommodationDates) {
            getAccommodations(accommodationDates)
            // const checkinDateFormatted = moment(fromDate).format('YYYY-MM-DD HH:mm z');
            // const checkoutDateFormatted = moment(toDate).format('YYYY-MM-DD HH:mm z');
            // const res = await axios.get(`http://localhost:3001/api/accommodations/${checkinDateFormatted}/${checkoutDateFormatted}`);
            // setAccommodations(res.data)
            // console.log('res accommodations', res)
        }

    }, [])

    return (
        <Fragment>
            <Header >
                <div style={{
                    height: 700,
                    background: `url('/images/pexels-cottonbro-5599611.jpg') bottom center no-repeat`,
                    backgroundSize: 'cover'
                }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>

                    <Space direction="vertical" size={12}>
                        <RangePicker
                            value={accommodationDates}
                            placeholder={["Check-in", "Check-out"]}
                            onChange={getAccommodations}
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
            {accommodations.map(accommodation => {

                return (
                    <StyledRoomListItem key={`accommodation[${accommodation.id}]`}>
                        <StyledRoomThumbnailContainer>
                            <StyledRoomThumbnail src={accommodation.image} />
                        </StyledRoomThumbnailContainer>
                        <StyledRoomDescriptionContainer>
                            <div>
                                <h1 onClick={handleDetails}>{accommodation.title}</h1>
                                <h3 onClick={handleDetails}>{accommodation.type}</h3>
                                <p>Wifi: {accommodation.isWifi ? 'yes' : 'no'}</p>
                                <p>Pets allowed: {accommodation.isPetsAllowed ? 'yes' : 'no'}</p>
                            </div>

                            <div>
                                {accommodation.roomId && (
                                    <Dropdown overlay={
                                        <Menu>
                                            {accommodation.beds.map(bed => (
                                                <Menu.Item key={`bed[${bed.bedNumber}]`}>
                                                    Bed {bed.bedNumber}
                                                </Menu.Item>
                                            ))}
                                        </Menu>
                                    }>
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            Select a bed <DownOutlined />
                                        </a>
                                    </Dropdown>
                                )}
                                <Link to={`/accommodation/${accommodation.id}`}>
                                    Details
                                </Link>
                                {!accommodation.roomId && <Link to={`/book/${accommodation.id}`}>
                                    Book
                                </Link>}
                            </div>
                        </StyledRoomDescriptionContainer>


                    </StyledRoomListItem>
                )
            })}
        </Fragment>
    )
}

export default Home;