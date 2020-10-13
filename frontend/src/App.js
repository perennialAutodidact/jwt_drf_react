import React, { useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import AuthContext from './context/auth/authContext';
import AlertContext from './context/alerts/alertContext';

import Register from './components/Register';
import Alerts from './components/Alerts';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import UserDetail from './components/UserDetail';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { requestAccessToken, user, messages } = authContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    // if refresh token exists, request new access token
    requestAccessToken();
  }, []); // empty [] ensures this only runs once when App.js is mounted

  // useEffect(() => {
  //   if (messages) {
  //     // console.log('messages:', messages);
  //     const errorMsg = messages.map(msg => msg).join('\n\n');

  //     // this could be set up to diplay as
  //     // as a styled alert too.
  //     setAlert(errorMsg, 'danger');
  //   }
  // }, [messages]); // update messages if messages change in state

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
