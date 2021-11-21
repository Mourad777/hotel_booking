import { Router } from 'react-router-dom';
import './App.css';
import Layout from './hoc/Layout';
import history from './utility/history';
import BasicDateRangePicker from './components/date-selector/DateSelector';
import { useEffect } from 'react';
import axios from 'axios'
import { DatePicker, Space } from 'antd'
import moment from 'moment';
const { RangePicker } = DatePicker;
function App() {
  const setBooking = async () => {
    return;
    const response = await axios.post('http://localhost:3001/api/bookings', {
      checkin: 'today',
      checkout: 'tommorow'
    });

    console.log('response', response)
  }

  const onDateSelect = (value) => {
    if (!value) return;
    const fromMomentDate = moment(value[0]);
    const toMomentDate = moment(value[1]);
    const fromDate = fromMomentDate.format('DD-MM-YYYY')
    const toDate = toMomentDate.format('DD-MM-YYYY')
    console.log('from date', fromDate)
    console.log('to date', toDate)
    const duration = moment.duration(toMomentDate.diff(fromMomentDate)).asDays();
    console.log('duration', duration)

  }

  useEffect(() => {
    setBooking()
  }, [])
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
              const oneDay = 86400000
              const dateToCompare = moment(new Date().getTime() + oneDay);
              // const today = moment(new Date());
              console.log('comparison: ',current.startOf('day').isSame(dateToCompare.startOf('day')))
            return  current.startOf('day').isSame(dateToCompare.startOf('day'));


              console.log('current', current)
              return current && moment(current, 'day') === moment(new Date(), 'day');
              return current && current < moment().add(1, "month");
            }}

          />
        </Space>



      </Router>
    </Layout>
  );
}

export default App;
