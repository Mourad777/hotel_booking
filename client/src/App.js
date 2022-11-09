import { Router, Route } from 'react-router-dom';
import './App.css';
import history from './utility/history';
import Home from './pages/Home';
import Accommodation from './pages/Accommodation';
import Tour from './pages/Tour';
import Booking from './pages/Booking';
import { useState } from 'react';

function App() {

  const [selectedAccommodationDates, setSelectedAccommodationDates] = useState({})
  const [selectedAccommodation, setSelectedAccommodation] = useState({images:[]})

  const handleAccommodationDates = (value) => {
    setSelectedAccommodationDates(value)
  }

  const handleAccommodation = (value) => {
    setSelectedAccommodation(value)
  }

  return (
    <Router history={history}>
      <Route path="/"
        exact
        render={(props) => <Home
          {...props}
          handleAccommodation={handleAccommodation}
          handleAccommodationDates={handleAccommodationDates}
          accommodationDates={selectedAccommodationDates} />} />
      <Route path="/accommodation/:accommodationId" exact render={(props) => {
        return (<Accommodation
          {...props}
          handleAccommodation={handleAccommodation}
          accommodation={selectedAccommodation}
          handleAccommodationDates={handleAccommodationDates}
          accommodationDates={selectedAccommodationDates} />)
      }
      } />
      <Route path="/tour/:tour" exact component={Tour} />
      <Route path="/booking" exact render={(props) => {
        return (<Booking
          {...props}
          selectedAccommodation={selectedAccommodation}
          selectedAccommodationDates={selectedAccommodationDates}
          handleAccommodationDates={handleAccommodationDates}
           />)
      }
      } />
    </Router>
  );
}

export default App;
