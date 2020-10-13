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
            <div className='col col-12'>
              <h1>{user.username}'s account</h1>
              <h1>{user.email}</h1>
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default UserDetail;
