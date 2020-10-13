import React, { useContext, useEffect } from 'react';

import AlertContext from '../context/alerts/alertContext';
import AuthContext from '../context/auth/authContext';

const Alerts = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { setAlert } = alertContext;
  const { messages, messageType } = authContext;

  useEffect(() => {
    if (messages) {
      const errorMsg = messages.map(msg => setAlert(msg, messageType));
    }
  }, [messages]);

  return (
    <div className='container text-center alerts'>
      <div className='row'>
        {alertContext.alerts.length > 0 &&
          alertContext.alerts.map(alert => (
            <div
              key={alert.id}
              className={`col col-10  offset-1  col-lg-6 offset-lg-3 text-center alert alert-${alert.type}`}
            >
              <i className='fas fa-info-circle'> {alert.msg}</i>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Alerts;
