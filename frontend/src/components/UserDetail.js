import React, { useContext, useEffect } from 'react';
import AuthContext from '../context/auth/authContext';

import Spinner from './Spinner';
const UserDetail = props => {
  const authContext = useContext(AuthContext);

  const { user, requestAccessToken, accessToken } = authContext;

  return (
    <div>
      <div className='container text-center'>
        {user !== null ? (
          <div className='row'>
            <h1>{user && user.email}</h1>
            <div className='col col-12'>Hello</div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default UserDetail;
