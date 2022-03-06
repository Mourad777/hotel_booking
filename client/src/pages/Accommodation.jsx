import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios'
import { DatePicker } from 'antd'
import moment from 'moment';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const { RangePicker } = DatePicker;

const validateDates = (checkin, checkout) => {
    let error;
    if (checkin.isSame(checkout)) {
        return 'Check in and Check out dates cannot be the same'
    }
}

const StyledLink = styled(Link)`
  color:rgb(0,0,0);
  font-size:1.2em;
  &:hover {
    color:rgb(203,200,193);
  };
`;

const StyledRangePicker = styled(DatePicker)`

`;
//.ant-picker-input > input {
  //  text-align:center;
//}

const StyledBookLinkContainer = styled.div`
padding: 10px; width: 100%; border: none; background: #e2e2e2; display:flex; justify-content:center;
`

const Accommodation = ({ match,accommodationDates, handleAccommodationDates }) => {
    const accommodationId = match.params.accommodationId
    const [fromMomentDate, setFromDate] = useState('')
    const [toMomentDate, setToDate] = useState('')

    const [accommodation, setAccommodation] = useState({})
    const [bookings, setBookings] = useState([])
    const [dateError, setDateError] = useState('')

    useEffect(() => {
        getAccommodationDetails()
        getBookings()
    }, [])

    const bookAccommodation = async () => {
        const response = await axios.post('http://localhost:3001/api/bookings', {
            bookingStart: moment.utc(accommodationDates[0]).format('YYYY-MM-DD HH:mm z'),
            bookingEnd: moment.utc(accommodationDates[1]).format('YYYY-MM-DD HH:mm z'),
            accommodationId: accommodationId,
            userId: 1
        });

        console.log('response', response)

    }

    const getAccommodationDetails = async () => {
        const res = await axios.get(`http://localhost:3001/api/accommodations/${accommodationId}`);
        setAccommodation(res.data);
        console.log('res', res);
    }

    const onDateSelect = (value) => {
        if (!value) return;
        handleAccommodationDates(value)
        console.log('value', value)
        // const checkinDate = moment.utc(value[0]).format('YYYY-MM-DD')
        // const checkoutDate = moment.utc(value[1]).format('YYYY-MM-DD')


        //using utc will normalize the data for the server, without utc the timezones will not be taken into account
        //and the intended date may not be registered

        // const error = validateDates(checkinDate, checkoutDate)
        // if (error) {
        //     setDateError(error)
        //     return
        // } else setDateError('');
        
        // setFromDate(checkinDate);
        // setToDate(checkoutDate);
    }

    const getBookings = async () => {
        const res = await axios.get(`http://localhost:3001/api/bookings/${accommodationId}`)
        setBookings(res.data)
        console.log('res', res)
    }
    console.log('accommodationDates',accommodationDates)
    return (
        <Fragment>

            <div style={{ display: 'flex', margin: 'auto', justifyContent: 'center', flexDirection: 'column', maxWidth: 500 }}>
                <h1 style={{ textAlign: 'center' }}>{accommodation.title}</h1>
                <p style={{ fontFamily: 'sans-serif', fontSize: '1.2em', color: 'rgb(200,200,200)' }}>{accommodation.type}</p>
                <img style={{ height: 400, width: 500 }} src={accommodation.image} />
                <div style={{ margin: '10px 0' }}>
                    <p style={{ fontSize: '1.1em', color: 'rgb(150,150,150)' }}>{accommodation.description}</p>
                </div>

                <div style={{ width: '100%' }}>

                    <RangePicker
                        value={accommodationDates}
                        style={{ width: '100%' }}
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
                    {/* <button style={{ padding: 10, width: '100%', border: 'none', background: '#e2e2e2', cursor: 'pointer' }} onClick={bookAccommodation} >Book</button> */}
                    <StyledBookLinkContainer>
                        <StyledLink to={`/book/${accommodation.id}`}>
                            Book
                        </StyledLink>
                    </StyledBookLinkContainer>
                    <button onClick={bookAccommodation}>book</button>
                </div>

            </div>
        </Fragment>
    )
}

export default Accommodation;