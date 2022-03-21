import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { getWindowSizeInteger } from "./utility/utility";
import _ from "lodash";
import Loader from "./components/Loader/Loader";
import 'semantic-ui-css/semantic.min.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import history from './utility/history';

const AdminLayout = React.lazy(() => import("./components/Layout/AdminLayout"));
const RegisterUser = React.lazy(() => import("./pages/register/Register"));
const Login = React.lazy(() => import("./pages/login/Login"));
// const Posts = React.lazy(() => import("./pages/posts/Posts"));
// const CreateRoom = React.lazy(() => import("./pages/create-room/CreateRoom"));
// const Messages = React.lazy(() => import("./pages/messages/Messages"));
// const Message = React.lazy(() => import("./pages/messages/Message"));
// const Settings = React.lazy(() => import("./pages/settings/Settings"));
// const Subscribers = React.lazy(() => import("./pages/guests/Guests"));
const Accommodation = React.lazy(() => import("./pages/accommodations/Accommodation"));
const Accommodations = React.lazy(() => import("./pages/accommodations/Accommodations"));
const Bookings = React.lazy(() => import("./pages/accommodationBookings/AccommodationBookings"));

const App = () => {

  const [winSize, setWinSize] = useState(getWindowSizeInteger(window.innerWidth));

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = (isLoggedIn) => {
    setIsLoggedIn(isLoggedIn)
  }

  useEffect(() => {
    if (!!localStorage.getItem('token')) {
      handleLogin(true)
    }

    window.addEventListener("resize", _.throttle(getWindowSize, 200), { passive: true });
  }, []);

  const getWindowSize = () => {
    const windowSizeWidthInt = getWindowSizeInteger(window.innerWidth);
    setWinSize(windowSizeWidthInt);
  };

  return (
    <Router history={history}>
      <React.Suspense fallback={<div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}>
        <Switch>
          <AdminLayout onLogin={handleLogin} isLoggedIn={isLoggedIn}>
            <Route exact path="/register">
              <RegisterUser onLogin={handleLogin} winSize={winSize} />
            </Route>
            <Route exact path="/login">
              <Login onLogin={handleLogin} winSize={winSize} />
            </Route>
            <PrivateRoute isLoggedIn={isLoggedIn} winSize={winSize} path="/" component={Accommodations} />
            <PrivateRoute isLoggedIn={isLoggedIn} winSize={winSize} path="/accommodation/:id" component={Accommodation} />
            <PrivateRoute isLoggedIn={isLoggedIn} winSize={winSize} path="/bookings" component={Bookings} />
            {/* <PrivateRoute isLoggedIn={isLoggedIn} path="/create-room" component={CreateRoom} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/edit-post/:id" isEditing component={CreateRoom} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/messages" component={Messages} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/message/:id" component={Message} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/settings" component={Settings} />
            <PrivateRoute isLoggedIn={isLoggedIn} path="/subscribers" component={Subscribers} /> */}
            {/* {isLoggedIn ? <Redirect to="/posts" /> : <Redirect to="/login" />} */}
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
