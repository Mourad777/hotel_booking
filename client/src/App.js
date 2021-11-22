import { Router } from 'react-router-dom';
import './App.css';
import Layout from './hoc/Layout';
import history from './utility/history';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { DatePicker, Space } from 'antd'
import moment from 'moment';
const { RangePicker } = DatePicker;
function App() {

  const [fromMomentDate, setFromMomentDate] = useState('')
  const [toMomentDate, setToMomentDate] = useState('')
  const [adults, setAdults] = useState('')
  const [children, setChildren] = useState('')
  const [bookings, setBookings] = useState([])

  const setBooking = async () => {


    const response = await axios.post('http://localhost:3001/api/bookings', {
      bookingStart: fromMomentDate.format('YYYY-MM-DD HH:mm z'),
      bookingEnd: toMomentDate.format('YYYY-MM-DD HH:mm z'),
      roomId: 2,
      userId: 1
    });

    console.log('response', response)
  }

  const onDateSelect = (value) => {
    if (!value) return;
    setFromMomentDate(moment(value[0]));
    setToMomentDate(moment(value[1]));
    const fromDate = moment(value[0]).format('YYYY-MM-DD')
    const toDate = moment(value[1]).format('YYYY-MM-DD')
    console.log('from date', fromDate)
    console.log('to date', toDate)
    // const duration = moment.duration(toMomentDate.diff(fromMomentDate)).asDays();
    // console.log('duration', duration)
  }
  
  const getBookings = async () => {
    const room = 2;
    const res = await axios.get(`http://localhost:3001/api/bookings/${room}`)
    setBookings(res.data)
    console.log('res',res)
  }

  useEffect(()=>{
    getBookings()
  },[])

  return (
    <Layout>
      <Router history={history}>

        <div className="App">

          Home

        </div>
        <Space direction="vertical" size={12}>
          <RangePicker
            onChange={onDateSelect} disabledDate={new Date().getTime()}
            disabledDate={current => {
              console.log('bookings',bookings)
              const oneDay = 86400000
              const momentBookingsStart = bookings.map(booking=>moment(booking.bookingStart))
              const momentBookingsEnd = bookings.map(booking=>moment(booking.bookingEnd))
              console.log('momentBookingsStart',momentBookingsStart)
              const dateToCompare = moment(new Date().getTime() + oneDay);
              // const today = moment(new Date());
              console.log('comparison: ', current.startOf('day').isSame(dateToCompare.startOf('day')))
              return  [...momentBookingsStart,...momentBookingsEnd].findIndex(bookingDate=>current.startOf('day').isSame(bookingDate.startOf('day'))) > -1;


              console.log('current', current)
              return current && moment(current, 'day') === moment(new Date(), 'day');
              return current && current < moment().add(1, "month");
            }}

          />
          <button onClick={setBooking} >Book now!</button>
        </Space>



      </Router>
    </Layout>
  );
}

export default App;
