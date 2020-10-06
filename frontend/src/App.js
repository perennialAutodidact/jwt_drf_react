import React, { useContext, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import AuthContext from './context/auth/authContext';

import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import UserDetail from './components/UserDetail';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const authContext = useContext(AuthContext);

  const { requestAccessToken, user } = authContext;

  useEffect(() => {
    // if refresh token exists, request new access token
    requestAccessToken();
  }, []);

  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Route exact path='/' component={Home} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <PrivateRoute path='/account' component={UserDetail} user={user}/>
      </Router>
    </div>
  );
};

export default App;
