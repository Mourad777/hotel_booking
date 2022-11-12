import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Router, Switch, Route, Redirect } from "react-router-dom";
import _ from "lodash";
import Loader from "./components/Loader/Loader";
import 'semantic-ui-css/semantic.min.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import history from './utility/history';
import { useWindowSize } from './utility/windowSize';

const AdminLayout = React.lazy(() => import("./components/Layout/AdminLayout"));
const RegisterUser = React.lazy(() => import("./pages/register/Register"));
const Login = React.lazy(() => import("./pages/login/Login"));
const CreateBooking = React.lazy(() => import('./pages/accommodationBookings/CreateBooking'));
const CreateAccommodation = React.lazy(() => import('./pages/accommodations/CreateAccommodation'));
const Accommodation = React.lazy(() => import("./pages/accommodations/Accommodation"));
const Accommodations = React.lazy(() => import("./pages/accommodations/Accommodations"));
const Bookings = React.lazy(() => import("./pages/accommodationBookings/AccommodationBookings"));

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  const handleLogin = (isLoggedIn) => {
    setIsLoggedIn(isLoggedIn)
  }

  useEffect(() => {
    if (!!localStorage.getItem('token')) {
      handleLogin(true)
    }
  }, []);


  return (
    <Router history={history}>
      <React.Suspense fallback={<div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}>
        <Switch>
          <AdminLayout onLogin={handleLogin} isLoggedIn={isLoggedIn}>
            <Route exact path="/register">
              <RegisterUser onLogin={handleLogin} />
            </Route>
            <Route exact path="/login">
              <Login onLogin={handleLogin} />
            </Route>
            <PrivateRoute isLoggedIn={isLoggedIn} path="/accommodations" component={Accommodations} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/accommodation/:id" component={Accommodation} />
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
