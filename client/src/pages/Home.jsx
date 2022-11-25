import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import { DatePicker, Space } from 'antd'
import {
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
import Loader from '../components/Loader/Loader';
import { fetchAccommodations } from '../utility/api';

const { REACT_APP_AWS_URL } = process.env;

const validateDates = (checkin, checkout) => {
    let error = '';
    if (checkin.isSame(checkout)) {
        error = 'Check in and Check out dates cannot be the same'
    }
    return error
}

const Home = (props) => {
    const { handleAccommodationDates, accommodationDates } = props;
    const [accommodations, setAccommodations] = useState([])
    const [dateError, setDateError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const getAccommodations = async (value) => {
        await fetchAccommodations(value, setAccommodations, setIsLoading)
        handleAccommodationDates(value);
    }

    useEffect(() => {
        getAccommodations(accommodationDates)
    }, [])
    if (isLoading) {
        return <Loader />
    }

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
            {accommodations.map(accommodation => {
                return (
                    <StyledRoomListItem key={`accommodation[${accommodation.id}]`}>
                        {accommodation.images[0] && <StyledRoomThumbnail src={REACT_APP_AWS_URL + accommodation.images[0].url} />}
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
                                {!accommodation.roomId && <StyledLink to={`/booking/${accommodation.id}`}>
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