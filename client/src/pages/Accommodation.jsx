import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { DatePicker } from 'antd'
import moment from 'moment';
import { isAccommodationAvailable } from '../utility/utils';
import {
    StyledBookLinkContainer,
    StyledRangePickerContainer,
    StyledAccommodationType,
    StyledAmenitiesList,
    StyledAmenitiesListItem,
    StyledDateError,
    StyledDatePickerWrapper,
    StyledDescription,
    StyledDescriptionWrapper,
    StyledMainContainer,
    StyledMainImage,
    StyledMainTitle,
    StyledAmenitiesHeader,
} from './styles/accommodation'
import Loader from '../components/Loader/Loader';
import history from '../utility/history';
import { Button } from 'antd';

const { REACT_APP_AWS_URL, REACT_APP_API_URL } = process.env;

const validateDates = (checkin, checkout) => {
    let error;
    if (checkin.isSame(checkout)) {
        return 'Check in and Check out dates cannot be the same'
    }
}

const Accommodation = ({ match, accommodationDates, handleAccommodationDates }) => {
    const accommodationId = match.params.accommodationId

    const [accommodation, setAccommodation] = useState({ images: [], amenities: [] })
    const [dateError, setDateError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getAccommodationDetails()
    }, [])

    const getAccommodationDetails = async () => {
        setIsLoading(true)
        const res = await axios.get(`${REACT_APP_API_URL}/accommodations/${accommodationId}`);
        setAccommodation(res.data);
        setIsLoading(false)
    }

    const onDateSelect = (value) => {
        if (!value) return;
        handleAccommodationDates(value)
    }

    if (isLoading) {
        return <Loader />
    } else {
        return (
            <StyledMainContainer>
                <StyledMainTitle>{accommodation.title}</StyledMainTitle>
                {(accommodation.images.length > 0) && <StyledMainImage src={REACT_APP_AWS_URL + accommodation.images[0].url} />}
                <StyledAccommodationType>{accommodation.type}</StyledAccommodationType>
                {accommodation.description && <StyledDescriptionWrapper>
                    <StyledDescription>{accommodation.description}</StyledDescription>
                </StyledDescriptionWrapper>}
                {accommodation.amenities.length > 0 && <StyledAmenitiesHeader>Amenities</StyledAmenitiesHeader>}

                <StyledAmenitiesList>
                    {accommodation.amenities.map(amenity => {
                        return <StyledAmenitiesListItem>{amenity.name}</StyledAmenitiesListItem>
                    })}
                </StyledAmenitiesList>

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
                        <Button onClick={() => history.push(`/booking/${accommodation.id}`)}>
                            Book
                        </Button>
                    </StyledBookLinkContainer>
                </StyledDatePickerWrapper>
            </StyledMainContainer>
        )
    }
}

export default Accommodation;