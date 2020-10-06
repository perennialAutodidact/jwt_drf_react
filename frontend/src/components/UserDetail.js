import React, { useContext, useEffect } from 'react';

import AuthContext from '../context/auth/authContext';

const UserDetail = props => {
  const authContext = useContext(AuthContext);

  const { user, requestAccessToken, accessToken } = authContext;

  useEffect(() => {
    if(!accessToken){
      console.log('NO ACCESS TOKEN');
      props.history.push('/login')
    }
  },[])

  return (
    <div>
      <div className='container'>
        <div className='row'>
          <h1 className='text-center'>{user && user.email}</h1>
          <div className='col col-12'>Hello</div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
