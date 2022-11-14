import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Router, Switch, Redirect } from "react-router-dom";
import _ from "lodash";
import Loader from "./components/Loader/Loader";
import 'semantic-ui-css/semantic.min.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import history from './utility/history';

const AdminLayout = React.lazy(() => import("./components/Layout/AdminLayout"));
const CreateBooking = React.lazy(() => import('./pages/accommodationBookings/CreateBooking'));
const CreateAccommodation = React.lazy(() => import('./pages/accommodations/CreateAccommodation'));
const Accommodations = React.lazy(() => import("./pages/accommodations/Accommodations"));
const Bookings = React.lazy(() => import("./pages/accommodationBookings/AccommodationBookings"));

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  const handleLogin = (isLoggedIn) => {
    setIsLoggedIn(isLoggedIn)
  }

  return (
    <Router history={history}>
      <React.Suspense fallback={<div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}>
        <Switch>
          <AdminLayout onLogin={handleLogin} isLoggedIn={isLoggedIn}>
            <PrivateRoute isLoggedIn={isLoggedIn} path="/accommodations" component={Accommodations} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/bookings" component={Bookings} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/create-accommodation/:id?" component={CreateAccommodation} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/create-reservation"  component={CreateBooking} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/create-reservation/:id"  component={CreateBooking} />
            {!isLoggedIn && (<Redirect to="/login" />)}
          </AdminLayout>
        </Switch>
      </React.Suspense>
    </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
