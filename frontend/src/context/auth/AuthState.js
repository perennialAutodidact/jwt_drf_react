import React, { useReducer } from 'react';
import axios from 'axios';

import AuthContext from './authContext';
import authReducer from './authReducer';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT,
  SET_ERROR,
  CLEAR_ERROR,
} from '../types'; // action types to dispatch to reducer

const AuthState = props => {
  const initialState = {
    token: null, // access token
    isAuthenticated: false, // boolean indicating if a user is logged in
    msg: null, // response messages
    user: null, // object with auth user data
  };

  // initialize the auth reducer
  const [state, dispatch] = useReducer(authReducer, initialState);

  // register new user. async because of axios call
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      // POST to api register view
      const response = await axios.post(
        'http://localhost:8000/users/',
        formData,
        config
      );

      // dispatch register success to user and pass the user's token as payload
      dispatch({
        type: REGISTER_SUCCESS,
        payload: { token: response.data, msg: response.data.msg },
      });
    } catch (error) {
      // dispatch register fail to reducer and display alert
      dispatch({ type: REGISTER_FAIL, payload: error.response.data.msg });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        msg: state.msg,
        register,
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
