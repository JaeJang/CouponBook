import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

export const SET_TO_ALERTS = 'SET_TO_ALERTS';
export const SET_FROM_ALERTS = 'SET_FROM_ALERTS';
export const REMOVE_TO_ALERTS = 'REMOVE_TO_ALERTS';
export const REMOVE_FROM_ALERTS = 'REMOVE_FROM_ALERTS';
export const SET_SETTINGS = 'SET_SETTINGS';

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
  list.reverse();
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

export const switchDownloadOption = value => async dispatch => {
  await AsyncStorage.setItem('imageDownloadDisabled', value.toString());
  dispatch({ type: SET_SETTINGS, payload: { imageDownloadDisabled: value } });
};

export const getSettings = () => async dispatch => {
  const imageDownloadDisabled = await AsyncStorage.getItem('imageDownloadDisabled');
  dispatch({ type: SET_SETTINGS, payload: { imageDownloadDisabled: imageDownloadDisabled === 'true' } });
};

const initialState = {
  toAlerts: [],
  fromAlerts: [],
  imageDownloadDisabled: false
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
    case SET_SETTINGS:
      return {
        ...state,
        imageDownloadDisabled: action.payload.imageDownloadDisabled
      };
    default:
      return state;
  }
}
