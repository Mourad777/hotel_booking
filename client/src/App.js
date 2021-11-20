import { Router } from 'react-router-dom';
import './App.css';
import Layout from './hoc/Layout';
import history from './utility/history';
import BasicDateRangePicker from './components/date-selector/DateSelector';
import { useEffect } from 'react';
import axios from 'axios'

function App() {
  const setBooking = async () => {
   const response = await axios.post('http://localhost:3001/api/bookings',{
      checkin:'today',
      checkout:'tommorow'
    });

    console.log('response',response)
  }

  useEffect(()=>{
    setBooking()
  },[])
  return (
    <Layout>
      <Router history={history}>
        
        <div className="App">

        Home

        </div>
        <BasicDateRangePicker />
        
      </Router>
    </Layout>
  );
}

export default App;
