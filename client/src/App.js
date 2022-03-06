import { Router, Route } from 'react-router-dom';
import './App.css';
import history from './utility/history';
import Home from './pages/Home';
import Accommodation from './pages/Accommodation';
import Tour from './pages/Tour';
import Booking from './pages/Booking';
import { useState } from 'react';

function App() {

  const [accommodationDates, setAccommodationDates] = useState({})

  const handleAccommodationDates = (value) => {
    console.log('handling dates')
    setAccommodationDates(value)
  }

  return (
    <Router history={history}>
      <Route path="/" exact render={(props) => <Home {...props} handleAccommodationDates={handleAccommodationDates} accommodationDates={accommodationDates} />}/>
      <Route path="/accommodation/:accommodationId" exact render={(props) => <Accommodation {...props} handleAccommodationDates={handleAccommodationDates} accommodationDates={accommodationDates} />}/>
      <Route path="/tour/:tour" exact component={Tour} />
      <Route path="/booking/accommodation/:accommodationId/:checkin/:checkout" exact component={Booking} />
      <Route path="/booking/tour/:tourId/:date/:timeslot" exact render={(props) => <Booking {...props} accommodationDates={accommodationDates} />} />
    </Router>
  );
}

export default App;
