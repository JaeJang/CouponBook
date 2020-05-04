import _ from 'lodash';

import * as FromService from '@service/FromService';

import { PROCESSING, PROCESSED } from '@store/types/loading';
import { processing, processed } from '@store/modules/processing';

export const SET_KEYS = 'SET_KEYS';
export const SET_LAST_KEY = 'SET_LAST_KEY';
export const SET_FROM_USERS = 'SET_FROM_USERS';
export const ADD_FROM = 'ADD_FROM';
export const SET_FROM_LIST = 'SET_FROM_LIST';
export const UPDATE_FROM_LIST = 'UPDATE_FROM_LIST';

export const getFromList = () => dispatch => {
  FromService.getFromList().then(values => {
    dispatch({ type: SET_KEYS, payload: values });
    dispatch(getFromListAfter());
  });
};

export const getFromListAfter = () => async (dispatch, getState) => {
  const { lastFromKeys, fromKeys, fromUsers } = getState().from;
  //const list = [];
  let i = lastFromKeys !== '' ? _.findIndex(fromKeys, lastFromKeys) + 1 : 0;
  const index = i;
  dispatch(processing());
  for (; i < index + 10 && i < fromKeys.length; ++i) {
    const { key, userKey } = fromKeys[i];
    //const dist = await FromService.getDistributed(key);
    let user = fromUsers[userKey];

    if (!user) {
      user = await FromService.getUserByUid(userKey);
      const object = { [userKey]: { email: user.email, name: user.name } };
      dispatch({ type: SET_FROM_USERS, payload: object });
    }
    const list = getState().from.fromList;
    list.push({ email: user.email, userName: user.name, key });
    dispatch({ type: SET_FROM_LIST, payload: list });
    FromService.onDistributedChange(key);
  }
  //dispatch({ type: SET_FROM_LIST, payload: list });
  /* for(let coupon of list) {
    FromService.onDistributedChange(coupon.key);
  } */
  dispatch(processed());
  dispatch({ type: SET_LAST_KEY, payload: fromKeys[i - 1] });
};

export const updateDist = (key, updatedDist) => (dispatch, getState) => {
  const list = getState().from.fromList;
  const index = _.findIndex(list, { key: key });
  const newDist = Object.assign(list[index], updatedDist);
  dispatch({ type: UPDATE_FROM_LIST, payload: { key, newDist } });
};

const addToObject = (object, property) => {
  const key = Object.keys(property);
  object[key[0]] = property[key];
  return object;
};

const initialState = {
  fromKeys: [],
  lastFromKeys: '',
  fromList: [],
  fromUsers: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_KEYS:
      return {
        ...state,
        fromKeys: action.payload
      };
    case SET_LAST_KEY:
      return {
        ...state,
        lastFromKeys: action.payload
      };
    case SET_FROM_USERS:
      return {
        ...state,
        fromUsers: addToObject(state.fromUsers, action.payload)
      };
    case ADD_FROM:
      return {
        ...state,
        fromList: state.fromList.concat(action.payload)
      };
    case SET_FROM_LIST:
      return {
        ...state,
        fromList: action.payload
      };
    case UPDATE_FROM_LIST:
      const key = action.payload.key;
      const newDist = action.payload.newDist;
      return {
        ...state,
        fromList: state.fromList.map(item => (item.key === key ? { ...item, ...newDist } : item))
      };
    default:
      return state;
  }
}
