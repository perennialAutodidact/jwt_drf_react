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
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        msg: action.payload.msg,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        msg: action.payload,
      };
  }
};
