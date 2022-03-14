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
  const [selectedBeds, setSelectedBeds] = useState(null) 

  const handleAccommodationDates = (value) => {
    console.log('handling dates')
    setAccommodationDates(value)
  }

  return (
    <Router history={history}>
      <Route path="/" exact render={(props) => <Home {...props} handleAccommodationDates={handleAccommodationDates} accommodationDates={accommodationDates} />} />
      <Route path="/accommodation/:accommodationId" exact render={(props) => {
        return (<Accommodation {...props} selectedBeds={selectedBeds} handleAccommodationDates={handleAccommodationDates} accommodationDates={accommodationDates} />)
      }
      } />
      <Route path="/tour/:tour" exact component={Tour} />
      <Route path="/booking/accommodation/:checkin/:checkout/:accommodationId/:bedCount?" exact selectedBeds={selectedBeds} component={Booking} />
      <Route path="/booking/tour/:tourId/:date/:timeslot" exact render={(props) => <Booking {...props} accommodationDates={accommodationDates} />} />
    </Router>
  );
}

export default App;
