import React, { useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import AuthContext from './context/auth/authContext';
import AlertContext from './context/alerts/alertContext';

import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';

import Alerts from './components/layout/Alerts';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import UserDetail from './components/pages/UserDetail';

const App = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { requestAccessToken, user, messages } = authContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    // if refresh token exists, request new access token
    requestAccessToken();
  }, []); // empty [] ensures this only runs once when App.js is mounted

  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Alerts />
        <Route exact path='/' component={Home} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <PrivateRoute path='/account' component={UserDetail} user={user} />
      </Router>
    </div>
  );
};

export default App;
