import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthContext from '../../context/auth/authContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);

  const { isAuthenticated, loading } = authContext;

  return (
    <Route
      // pass the rest of the props
      {...rest}
      render={props =>
        // if not authenticated when loaded, redirect to login page
        !isAuthenticated && !loading ? (
          <Redirect to='/login' />
        ) : (
          // if authenticated, load the protected component
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
