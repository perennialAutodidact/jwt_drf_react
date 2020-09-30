import React, { useReducer } from 'react';
import axios from 'axios';

import AuthContext from './authContext';
import authReducer from './authReducer';

const AuthState = props => {
  const initialState = {
    token: null, // access token
    isAuthenticated: false, //
    error: null, // response error, if it exists
    user: null, // object with auth user data
  };

  // initialize the auth reducer
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        error: state.error,
        //register,
        //login,
        //loadUser,
        //logout,
        //clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
