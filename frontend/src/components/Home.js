import React, { useContext } from 'react';

import AuthContext from '../context/auth/authContext';

const Home = () => {
  const authContext = useContext(AuthContext);

  const { isAuthenticated, user } = authContext;

  console.log('you sir:', user);

  return (
    <div>
      <h1 className='text-center'>Welcome{user && ', ' + user.username}!</h1>
    </div>
  );
};

export default Home;
