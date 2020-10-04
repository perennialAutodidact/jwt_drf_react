import React, { useReducer } from 'react';
import axios from 'axios';
import setAccessToken from '../../utils/setAccessToken';

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
    accessToken: null, // logged in user's current access token
    isAuthenticated: false, // boolean indicating if a user is logged in
    messages: null, // response messages
    user: null, // object with auth user data
  };

  // initialize the auth reducer
  const [state, dispatch] = useReducer(authReducer, initialState);

  // destructure state
  const { accessToken } = state;

  // set 'Authorization' header in Axios
  setAccessToken(accessToken);

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
        payload: {
          token: response.data.accessToken,
          messages: response.data.msg,
        },
      });
    } catch (error) {
      // dispatch register fail to reducer and display alert
      dispatch({ type: REGISTER_FAIL, payload: error.response.data.msg });
    }
  };

  // login user. async because of axios call
  const login = async formData => {
    const config = {
      'Content-Type': 'application/json',
    };

    try {
      // POST to users/login/
      const response = await axios.post(
        'http://localhost:8000/users/login/',
        formData,
        config
      );

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: response.data.accessToken,
          messages: response.data.msg,
        },
      });

      loadUser();
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: { messages: error.response.data.msg },
      });
    }
  };

  // get user object from accessToken
  const loadUser = async () => {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.get('http://localhost:8000/users/auth/');

      dispatch({ type: LOAD_USER_SUCCESS, payload: response.data.user });
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        messages: state.messages,
        register,
        login,
        loadUser,
        //logout,
        //clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
