import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios'
import { DatePicker } from 'antd'
import moment from 'moment';
import { isAccommodationAvailable } from '../utility/utils';
import {
    StyledBookLinkContainer,
    StyledLink,
    StyledRangePickerContainer,
    StyledAccommodationType,
    StyledAmenitiesList,
    StyledAmenitiesListItem,
    StyledDateError,
    StyledDatePickerWrapper,
    StyledDescription,
    StyledDescriptionWrapper,
    StyledImageWrapper,
    StyledMainContainer,
    StyledMainImage,
    StyledMainTitle
} from '../styles/accommodation'

const { REACT_APP_AWS_URL,REACT_APP_API_URL } = process.env;

const validateDates = (checkin, checkout) => {
    let error;
    if (checkin.isSame(checkout)) {
        return 'Check in and Check out dates cannot be the same'
    }
}

const Accommodation = ({ match, accommodationDates, handleAccommodationDates, handleAccommodation }) => {
    const accommodationId = match.params.accommodationId

    const [accommodation, setAccommodation] = useState({ images: [] })
    const [dateError, setDateError] = useState('')

    useEffect(() => {
        getAccommodationDetails()
    }, [])

    const getAccommodationDetails = async () => {
        const res = await axios.get(`${REACT_APP_API_URL}/accommodations/${accommodationId}`);
        setAccommodation(res.data);
    }

    const onDateSelect = (value) => {
        if (!value) return;
        handleAccommodationDates(value)
    }

    return (
        <StyledMainContainer>
            <StyledMainTitle>{accommodation.title}</StyledMainTitle>
            <StyledAccommodationType style={{ fontFamily: 'sans-serif', fontSize: '1.2em', color: 'rgb(200,200,200)' }}>{accommodation.type}</StyledAccommodationType>
            <StyledImageWrapper>
                {(accommodation.images.length > 0) && <StyledMainImage src={REACT_APP_AWS_URL + accommodation.images[0].url} />}
            </StyledImageWrapper>
            <StyledDescriptionWrapper style={{ margin: '10px 0' }}>
                <StyledDescription>{accommodation.description}</StyledDescription>
            </StyledDescriptionWrapper>
            {accommodation.amenities && <div>
                <StyledAmenitiesList>
                    {accommodation.amenities.map(amenity => {
                        return <StyledAmenitiesListItem>{amenity.name}</StyledAmenitiesListItem>
                    })}
                </StyledAmenitiesList>
            </div>}
            <StyledDatePickerWrapper>
                <DatePicker.RangePicker
                    value={accommodationDates}
                    style={{ width: '100%' }}
                    placeholder={["Check-in", "Check-out"]}
                    onChange={onDateSelect}
                    disabledDate={current => {
                        const formattedDate = current.format('YYYY-MM-DD');

                        return isAccommodationAvailable(accommodation.accommodation_bookings, formattedDate)
                            ||
                            moment(formattedDate).isBefore(moment().subtract(1, 'days'), 'day')//disable dates before today

                    }}
                    panelRender={(panelNode) => (
                        <StyledRangePickerContainer>{panelNode}</StyledRangePickerContainer>
                    )}
                />
                <StyledDateError> {dateError}</StyledDateError>
                <StyledBookLinkContainer>
                    <StyledLink onClick={() => handleAccommodation(accommodation)} to={`/booking`}>
                        Book
                    </StyledLink>
                </StyledBookLinkContainer>
            </StyledDatePickerWrapper>
        </StyledMainContainer>
    )
}

export default Accommodation;