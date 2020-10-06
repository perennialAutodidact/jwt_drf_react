import React, { useContext } from 'react';

import AuthContext from '../context/auth/authContext';

const UserDetail = () => {
  const authContext = useContext(AuthContext);

  const { user } = authContext;

  return (
    <div>
      <div className='container'>
        <div className='row'>
          <h1 className='text-center'>{user.email}</h1>
          <div className='col col-12'>Hello</div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
