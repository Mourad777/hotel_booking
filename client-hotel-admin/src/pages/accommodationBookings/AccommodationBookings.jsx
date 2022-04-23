import React, { useState, useEffect, Fragment } from 'react'
import { StyledThumbnailPreview } from '../../StyledComponents';
import { useHistory } from 'react-router';
import { getBookings } from '../../utility/api/bookings';
import Loader from '../../components/Loader/Loader';
import { Select } from 'semantic-ui-react'
import moment from 'moment';


const Posts = ({ winSize }) => {

    const history = useHistory();
    const [bookings, setBookings] = useState(null);
    const [selectedBed, setSelectedBed] = useState(null);
    const [isLoading, setIsLoading] = useState([]);

    const getInitialData = async () => {
        await getBookings(setBookings, setIsLoading)
    }

    useEffect(() => {
        getInitialData()
    }, []);

    if (isLoading) {
        return <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>
    } else {
        return (
            <div style={{ margin: 'auto', maxWidth: 800 }}>
                <h1>Bookings</h1>
                <h4>Select an accommodation</h4>
                <Select placeholder='Select your country' options={[
                    { key: 'af', value: 'af', text: 'Afghanistan' }]} />
                <table style={{ margin: 'auto', width: '100%' }}>
                    <tbody>
                        <tr>
                            <th style={{ fontSize: '1.2em' }}></th>
                            <th style={{ fontSize: '1.2em', textAlign: 'left' }}>Accommodation</th>
                            <th style={{ fontSize: '1.2em' }}>Check-in date</th>
                            <th style={{ fontSize: '1.2em' }}>Check-out date</th>
                            <th style={{ fontSize: '1.2em' }}>Guest</th>
                            <th style={{ fontSize: '1.2em' }}>Guest E-mail</th>
                        </tr>
                        {bookings.map(booking => (
                            <Fragment key={booking.id}>
                                <tr style={{ height: 100 }}>
                                <td style={{ fontSize: '1.2em' }}></td>
                                    <td style={{ fontSize: '1.2em', textAlign: 'left' }}>
                                        <img onClick={()=>history.push(`/accommodation/${booking.accommodation.id}`)} style={{ width: 200, cursor:'pointer' }} src={booking.accommodation.image} /></td>
                                    <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{moment.utc(booking.bookingStart).format('YYYY-MM-DD')}</td>
                                    <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{moment.utc(booking.bookingEnd).format('YYYY-MM-DD')}</td>
                                    <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{booking.user.firstName + ' ' + booking.user.lastName}</td>
                                    <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{booking.user.email}</td>
                                </tr>
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div >
        )
    }
}

export default Posts
