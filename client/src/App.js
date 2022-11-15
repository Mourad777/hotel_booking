import { Router, Route } from 'react-router-dom';
import './App.css';
import history from './utility/history';
import Home from './pages/Home';
import Accommodation from './pages/Accommodation';
import Booking from './pages/Booking';
import { useState } from 'react';

function App() {

  const [selectedAccommodationDates, setSelectedAccommodationDates] = useState({})

  const handleAccommodationDates = (value) => {
    setSelectedAccommodationDates(value)
  }

  return (
    <Router history={history}>
      <Route path="/"
        exact
        render={(props) => <Home
          {...props}
          handleAccommodationDates={handleAccommodationDates}
          accommodationDates={selectedAccommodationDates} />} />
      <Route path="/accommodation/:accommodationId" exact render={(props) => {
        return (<Accommodation
          {...props}
          handleAccommodationDates={handleAccommodationDates}
          accommodationDates={selectedAccommodationDates} />)
      }
      } />
      <Route path="/booking/:accommodationId" exact render={(props) => {
        return (<Booking
          {...props}
          selectedAccommodationDates={selectedAccommodationDates}
          handleAccommodationDates={handleAccommodationDates}
           />)
      }
      } />
    </Router>
  );
}

export default App;
