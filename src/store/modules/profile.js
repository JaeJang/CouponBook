import _ from 'lodash';

export const SET_TO_ALERTS = 'SET_TO_ALERTS';
export const SET_FROM_ALERTS = 'SET_FROM_ALERTS';
export const REMOVE_TO_ALERTS = 'REMOVE_TO_ALERTS';
export const REMOVE_FROM_ALERTS = 'REMOVE_FROM_ALERTS';

export const updateToAlerts = alerts => dispatch => {
  const list = [];
  for (let key in alerts) {
    list.push({ alertKey: key, ...alerts[key] });
  }
  list.reverse();
  dispatch({ type: SET_TO_ALERTS, payload: list });
};

export const updateFromAlerts = alerts => dispatch => {
  const list = [];
  for (let key in alerts) {
    list.push({ alertKey: key, ...alerts[key] });
  }
  dispatch({ type: SET_FROM_ALERTS, payload: list });
};

export const deleteToAlert = key => (dispatch, getState) => {
  const list = getState().profile.toAlerts;
  const index = _.findIndex(list, { alertKey: key });
  dispatch({ type: REMOVE_TO_ALERTS, payload: index });
};

export const deleteFromAlert = key => (dispatch, getState) => {
  const list = getState().profile.fromAlerts;
  const index = _.findIndex(list, { alertKey: key });
  dispatch({ type: REMOVE_FROM_ALERTS, payload: index });
};

const initialState = {
  toAlerts: [],
  fromAlerts: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TO_ALERTS:
      return {
        ...state,
        toAlerts: action.payload
      };
    case SET_FROM_ALERTS:
      return {
        ...state,
        fromAlerts: action.payload
      };
    case REMOVE_TO_ALERTS:
      return {
        ...state,
        toAlerts: state.toAlerts.filter((item, index) => index !== action.payload)
      };
    case REMOVE_FROM_ALERTS:
      return {
        ...state,
        fromAlerts: state.fromAlerts.filter((item, index) => index !== action.payload)
      };
    default:
      return state;
  }
}
