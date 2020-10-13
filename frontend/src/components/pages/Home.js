import React, { useContext } from 'react';

import AuthContext from '../../context/auth/authContext';

import Spinner from '../layout/Spinner';

const Home = () => {
  const authContext = useContext(AuthContext);

  const { isAuthenticated, loading, user } = authContext;

  return (
    <div className='container text-center'>
      {isAuthenticated !== null && !loading ? (
        <h1 className='text-center'>Welcome{user && ', ' + user.username}!</h1>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Home;
