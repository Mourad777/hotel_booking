import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios'
import { DatePicker, Select } from 'antd'
import moment from 'moment';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Option } from 'antd/lib/mentions';
import { isAccommodationAvailable } from '../utility/utils';
const { REACT_APP_AWS_URL } = process.env;

const { RangePicker } = DatePicker;

const { REACT_APP_API_URL } = process.env;

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

const Accommodation = ({ match, accommodationDates, handleAccommodationDates, handleAccommodation, handleSelectedBeds, selectedBeds }) => {
    const accommodationId = match.params.accommodationId

    const [accommodation, setAccommodation] = useState({images:[]})
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
        <Fragment>

            <div style={{ display: 'flex', margin: 'auto', justifyContent: 'center', flexDirection: 'column', maxWidth: 500 }}>
                <h1 style={{ textAlign: 'center' }}>{accommodation.title}</h1>
                <p style={{ fontFamily: 'sans-serif', fontSize: '1.2em', color: 'rgb(200,200,200)' }}>{accommodation.type}</p>
                <div style={{ height: 400 }}>
                    {(accommodation.images.length > 0) && <img style={{ width: 500 }} src={REACT_APP_AWS_URL + accommodation.images[0].url} />}
                </div>
                <div style={{ margin: '10px 0' }}>
                    <p style={{ fontSize: '1.1em', color: 'rgb(150,150,150)' }}>{accommodation.description}</p>
                </div>

                <div style={{ width: '100%' }}>

                    <RangePicker
                        value={accommodationDates}
                        style={{ width: '100%' }}
                        placeholder={["Check-in", "Check-out"]}
                        onChange={onDateSelect}
                        disabled={!selectedBeds && accommodation.type === 'Dorm'}
                        disabledDate={current => {
                            // return false;
                            const formattedDate = current.format('YYYY-MM-DD');
                            if (accommodation.type === 'Dorm') {
                                const availableBeds = [];

                                accommodation.beds.forEach(bed => {
                                    const isAvailable =
                                        isAccommodationAvailable(bed.accommodation_bookings, formattedDate)
                                        ||
                                        moment(formattedDate).isBefore(moment().subtract(1, 'days'), 'day')//disable dates before today

                                    if (isAvailable) { availableBeds.push(bed) }

                                })
                                return availableBeds.length > accommodation.beds.length - selectedBeds
                            } else {
                                return isAccommodationAvailable(accommodation.accommodation_bookings, formattedDate)
                                    ||
                                    moment(formattedDate).isBefore(moment().subtract(1, 'days'), 'day')//disable dates before today
                            }
                        }}
                    />
                    <p> {dateError}</p>

                    {(!!accommodation.id && accommodation.type === 'Dorm') && <Select
                        placeholder="Select number of beds"
                        onChange={handleSelectedBeds}
                        value={selectedBeds}
                        style={{ minWidth: 300 }}

                    >
                        {accommodation.beds.map((bed, i) => <Option key={bed.id} value={i + 1}>{`${i + 1} bed${i + 1 > 1 ? 's' : ''} ${accommodation.price * (i + 1)}$`}</Option>)}
                    </Select>}
                    {/* <button style={{ padding: 10, width: '100%', border: 'none', background: '#e2e2e2', cursor: 'pointer' }} onClick={bookAccommodation} >Book</button> */}
                    <StyledBookLinkContainer>
                        <StyledLink onClick={() => handleAccommodation(accommodation)} to={`/booking`}>
                            Book
                        </StyledLink>
                    </StyledBookLinkContainer>
                </div>

            </div>
        </Fragment>
    )
}

export default Accommodation;