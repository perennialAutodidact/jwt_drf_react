import { SET_ALERT, CLEAR_ALERTS } from '../types';

export default (state, action) => {
  switch (action.type) {
    default:
      return state;
    case SET_ALERT:
      // add alert in payload to list of alert to display
      return [...state, action.payload];
    case CLEAR_ALERTS:
      // remove alerts that aren't in the current list
      return state.filter(alert => alert.id !== action.payload);
  }
};
