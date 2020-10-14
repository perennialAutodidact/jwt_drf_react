import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

import AlertContext from './alertContext';
import alertReducer from './alertReducer';

import { SET_ALERT, CLEAR_ALERTS } from '../types';

const AlertState = props => {
  const initialState = []; // blank list of alert messages

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  const setAlert = (msg, type, timeout = 3000) => {
    // create a unique identifier for each alert
    const id = uuidv4();

    dispatch({ type: SET_ALERT, payload: { msg, type, id } });

    // remove alerts after a few seconds
    setTimeout(() => dispatch({ type: CLEAR_ALERTS, payload: id }), timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        // provide alerts to app
        alerts: state,
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
