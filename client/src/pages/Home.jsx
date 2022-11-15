import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios'
import { DatePicker, Space } from 'antd'
import {
    CardImage,
    Column,
    Grid,
    Row,
    StyledLink,
    StyledRangePickerContainer,
    StyledRoomDescriptionContainer,
    StyledRoomThumbnail,
    StyledRoomListItem,
    StyledDatePickerContainer,
    StyledHeaderBackground,
    StyledHeaderWrapper,
    StyledAccommodationDetails,
    StyledButtonsWrapper,
} from './styles/home'

const { REACT_APP_AWS_URL, REACT_APP_API_URL } = process.env;

const validateDates = (checkin, checkout) => {
    let error = '';
    if (checkin.isSame(checkout)) {
        error = 'Check in and Check out dates cannot be the same'
    }
    return error
}

const Home = (props) => {
    const { handleAccommodationDates, accommodationDates, handleAccommodation } = props;
    const [accommodations, setAccommodations] = useState([])
    const [dateError, setDateError] = useState('')

    const getAccommodations = async (value) => {
        const fromDate = moment(value[0]);
        const toDate = moment(value[1]);
        const checkinDateFormatted = moment(fromDate).format('YYYY-MM-DD HH:mm z');
        const checkoutDateFormatted = moment(toDate).format('YYYY-MM-DD HH:mm z');
        if (!value || (value[0] === value[1])) {
            const res = await axios.get(`${REACT_APP_API_URL}/accommodations`);
            setAccommodations(res.data)
        } else {
            const res = await axios.get(`${REACT_APP_API_URL}/accommodations/${checkinDateFormatted}/${checkoutDateFormatted}`);
            console.log('res accommodations', res)
            setAccommodations(res.data)
        }
        handleAccommodationDates(value);
    }

    useEffect(() => {
        getAccommodations(accommodationDates)
    }, [])

    return (
        <Fragment>
            <StyledHeaderWrapper>
                <StyledHeaderBackground />
                <StyledDatePickerContainer>
                    <Space direction="vertical" size={12}>
                        <DatePicker.RangePicker
                            value={accommodationDates}
                            placeholder={["Check-in", "Check-out"]}
                            onChange={getAccommodations}
                            disabledDate={current => {
                                const currentWithoutTime = current.format('YYYY-MM-DD');
                                return moment(currentWithoutTime).isBefore(moment().subtract(1, 'days'), 'day'); //disable all dates before today
                            }}
                            panelRender={(panelNode) => (
                                <StyledRangePickerContainer>{panelNode}</StyledRangePickerContainer>
                            )}
                            {...props}
                        />
                        <p> {dateError}</p>
                    </Space>
                </StyledDatePickerContainer>
            </StyledHeaderWrapper>

            {accommodations.length > 0 && <Grid>
                <Row>
                    {accommodations.map((accommodation) => { <Column size={1}><CardImage src={REACT_APP_AWS_URL + accommodation.images[0].url} /></Column> })}
                </Row>
            </Grid>}
            {accommodations.map(accommodation => {
                return (
                    <StyledRoomListItem key={`accommodation[${accommodation.id}]`}>
                        <StyledRoomThumbnail src={REACT_APP_AWS_URL + accommodation.images[0].url} />
                        <StyledRoomDescriptionContainer>
                            <div>
                                <h1>{accommodation.title}</h1>
                                <StyledAccommodationDetails>{accommodation.type}</StyledAccommodationDetails>
                                <StyledAccommodationDetails>{accommodation.price}$ per night</StyledAccommodationDetails>
                            </div>
                            <StyledButtonsWrapper>
                                <StyledLink to={`/accommodation/${accommodation.id}`}>
                                    Details
                                </StyledLink>
                                {!accommodation.roomId && <StyledLink onClick={() => handleAccommodation(accommodation)} to={`/booking`}>
                                    Book
                                </StyledLink>}
                            </StyledButtonsWrapper>
                        </StyledRoomDescriptionContainer>
                    </StyledRoomListItem>
                )
            })}
        </Fragment>
    )
}

export default Home;