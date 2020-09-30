import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import AuthState from './context/auth/AuthState';

import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';

const App = () => {
  return (
    <div className='App'>
      <AuthState>
        <Router>
          <Navbar />
          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </Router>
      </AuthState>
    </div>
  );
};

export default App;
