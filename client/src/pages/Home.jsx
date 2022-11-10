import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { DatePicker, Space } from 'antd'
import { StyledRoomListItem } from '../components/room-list-item/RoomListItem';
import { StyledRoomThumbnail, StyledRoomThumbnailContainer } from '../components/room-thumbnail/RoomThumbnail';
import { StyledRoomDescriptionContainer } from '../components/room-description/RoomDescription';
import styled from 'styled-components';

const { REACT_APP_AWS_URL } = process.env;

const { REACT_APP_API_URL } = process.env;

const StyledRangePickerContainer = styled.div`
  @media (max-width: 576px) {
    .ant-picker-panels {
      flex-direction: column !important;
    }
  }
`;

const StyledLink = styled(Link)`
color: #626262;
text-decoration: none;
margin: 1rem;
position: relative;
border:1px solid #e2e2e2;
border-radius:10%;
padding: 10px;
`;

const Grid = styled.div`
position:absolute;
top:70%;
left:50%;
transform:translate(-50%,-50%);
`;

const Row = styled.div`
display:flex;
`;

const Column = styled.div`
flex:${props => props.size};
background:white;
width:300px;
height:450px;
padding:20px;
margin:10px;
`

const CardImage = styled.img`
width:255px;
src:${props => props.src};
`

const validateDates = (checkin, checkout) => {
    let error = '';
    if (checkin.isSame(checkout)) {
        error = 'Check in and Check out dates cannot be the same'
    }
    return error
}

const Header = ({ children }) => (
    <div style={{ height: '100vh', background: 'blue', width: '100%', position: 'relative' }}>
        {children}
    </div>
)

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
            <Header >
                <div style={{
                    height: '100vh',
                    background: `url('/images/pexels-cottonbro-5599611.jpg') bottom center no-repeat`,
                    backgroundSize: 'cover'
                }}
                />
                <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)' }}>

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
                        {/* <RangePicker
                            value={accommodationDates}
                            placeholder={["Check-in", "Check-out"]}
                            onChange={getAccommodations}
                            disabledDate={current => {
                                const currentWithoutTime = current.format('YYYY-MM-DD');
                                return moment(currentWithoutTime).isBefore(moment().subtract(1, 'days'), 'day'); //disable all dates before today
                            }} /> */}

                        <p> {dateError}</p>
                    </Space>
                </div>
            </Header>

            {accommodations.length > 0 && <Grid>
                <Row>
                    {accommodations.map((accommodation) => { <Column size={1}><CardImage src={REACT_APP_AWS_URL + accommodation.images[0].url} /></Column> })}
                </Row>
            </Grid>}

            {accommodations.map(accommodation => {

                return (
                    <StyledRoomListItem key={`accommodation[${accommodation.id}]`}>
                        <StyledRoomThumbnailContainer>
                            <StyledRoomThumbnail src={REACT_APP_AWS_URL + accommodation.images[0].url} />
                        </StyledRoomThumbnailContainer>
                        <StyledRoomDescriptionContainer>
                            <div>
                                <h1>{accommodation.title}</h1>
                                <h3>{accommodation.type}</h3>
                            </div>

                            <div>
                                <StyledLink to={`/accommodation/${accommodation.id}`}>
                                    Details
                                </StyledLink>
                                {!accommodation.roomId && <StyledLink onClick={() => handleAccommodation(accommodation)} to={`/booking`}>
                                    Book
                                </StyledLink>}
                            </div>
                        </StyledRoomDescriptionContainer>
                    </StyledRoomListItem>
                )
            })}
        </Fragment>
    )
}

export default Home;