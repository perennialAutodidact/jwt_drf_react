import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alerts/AlertState';

ReactDOM.render(
  <React.StrictMode>
    <AuthState>
      <AlertState>
        <App />
      </AlertState>
    </AuthState>
  </React.StrictMode>,
  document.getElementById('root')
);
