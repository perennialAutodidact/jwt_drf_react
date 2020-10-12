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
  EXTEND_TOKEN_SUCCESS,
  EXTEND_TOKEN_FAIL,
  SET_ERROR,
  CLEAR_ERROR,
} from '../types'; // action types to dispatch to reducer

const BASE_URL = 'http://localhost:8000/users';

const AuthState = props => {
  const initialState = {
    accessToken: null, // logged in user's current access token
    isAuthenticated: false, // boolean indicating if a user is logged in
    messages: null, // response messages
    user: null, // object with auth user data
    loading: true, // no response yet from api
  };

  // initialize the auth reducer
  const [state, dispatch] = useReducer(authReducer, initialState);

  // destructure state
  const { accessToken } = state;

  // set 'Authorization' header in Axios
  setAccessToken(accessToken);

  // request a new access token
  const requestAccessToken = async () => {
    try {
      const config = {
        'Content-Type': 'application/json',
        withCredentials: true,
      };
      const response = await axios.get(BASE_URL + '/token/', config);

      // Dispatch accessToken to state
      dispatch({
        type: EXTEND_TOKEN_SUCCESS,
        payload: response.data,
      });

      loadUser();
    } catch (error) {
      dispatch({
        type: EXTEND_TOKEN_FAIL,
        payload: { messages: error.response.data.msg },
      });
      // set alert "Not Authorized"
      // console.log('requestAccessToken ERROR', error.response.data);
    }
  };

  // register new user. async because of axios call
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        withCredentials: true, // required to set the refreshtoken cookie in the browser!!!
      },
    };

    try {
      // POST to api register view
      const response = await axios.post(BASE_URL + '/', formData, config);

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
      withCredentials: true, // required to set the refreshtoken cookie in the browser!!!
    };

    try {
      // POST to users/login/
      const response = await axios.post(BASE_URL + '/login/', formData, config);

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
      withCredentials: true,
    };

    try {
      const response = await axios.get(BASE_URL + '/auth/');

      dispatch({
        type: LOAD_USER_SUCCESS,
        payload: response.data.user,
      });
    } catch (error) {
      if (error.response.data.msg === 'Access token expired') {
        requestAccessToken();
      }
      dispatch({
        type: LOAD_USER_FAIL,
        payload: { messages: error.response.data.msg },
      });
    }
  };

  const logout = async () => {
    const headers = {
      'Content-Type': 'application/json',
      withCredentials: true,
    };

    try {
      const response = await axios.get(BASE_URL + '/logout');

      dispatch({
        type: LOGOUT,
        payload: { messages: response.data.msg },
      });
    } catch (error) {
      dispatch({
        type: LOGOUT,
        payload: { messages: error.response.data.msg },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        messages: state.messages,
        register,
        login,
        loadUser,
        requestAccessToken,
        logout,
        //clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
