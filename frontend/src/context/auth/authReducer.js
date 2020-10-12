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
        loading: false,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOAD_USER_FAIL:
    case EXTEND_TOKEN_FAIL:
    case LOGOUT:
      return {
        ...state,
        accessToken: null,
        isAuthenticated: false,
        user: null,
        messages: action.payload.messages,
        loading: false,
      };
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case EXTEND_TOKEN_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        loading: false,
      };
  }
};
