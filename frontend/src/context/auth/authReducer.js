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
} from '../types'; // action types

export default (state, action) => {
  switch (action.type) {
    default:
      return {
        ...state,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.token,
        isAuthenticated: true,
        messages: action.payload.messages,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      return {
        ...state,
        accessToken: null,
        isAuthenticated: false,
        messages: action.payload.messages,
      };
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
      };
    case LOAD_USER_FAIL:
      return {
        ...state,
        message: action.payload.messages,
      };
  }
};
