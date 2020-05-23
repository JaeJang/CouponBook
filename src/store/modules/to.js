import _ from 'lodash';

import * as ToService from '../../services/ToService';
import * as FromToService from '../../services/FromToService';
import { addToObject } from '../../utils/utils';

import { processing, processed } from '../../store/modules/processing';

export const SET_TO_KEYS = 'SET_TO_KEYS';
export const SET_LAST_KEY = 'SET_LAST_KEY';
export const SET_TO_USERS = 'SET_TO_USERS';
export const ADD_TO = 'ADD_TO';
export const SET_TO_LIST = 'SET_TO_LIST';
export const UPDATE_TO_LIST = 'UPDATE_TO_LIST';
export const ADD_TO_FRONT = 'ADD_TO_FRONT';

const TYPE = 'to';

export const addToFront = value => async (dispatch, getState) => {
  const { toUsers } = getState().to;
  const user = await getUserByUserKey(toUsers, value.userKey, dispatch);
  const list = getState().to.toList;
  list.unshift({ email: user.email, userName: user.name, key: value.key });
  dispatch({ type: SET_TO_LIST, payload: list });
  FromToService.onDistributedChange(value.key, result => dispatch(updateDist(value.key, result)));
};

export const listenToNewList = () => (dispatch, getState) => {
  FromToService.childAddedListener(TYPE, value => {
    const { toKeys } = getState().to;
    const index = _.findIndex(toKeys, { key: value.key });
    if (index === -1) {
      if (!toKeys.length) {
        dispatch({ type: SET_LAST_KEY, payload: value.key });
      }
      toKeys.unshift(value);
      dispatch({ type: SET_TO_KEYS, payload: toKeys });
      dispatch(addToFront(value));
    }
  });
};

export const getToList = () => dispatch => {
  FromToService.getList(TYPE)
    .then(values => {
      if (values.length) {
        dispatch({ type: SET_TO_KEYS, payload: values });
        dispatch(getToListAfter());
      }
    })
    .finally(() => {
      dispatch(listenToNewList());
    });
};

export const getToListAfter = () => async (dispatch, getState) => {
  const { toLastKey, toKeys, toUsers } = getState().to;
  let i = toLastKey !== '' ? _.findIndex(toKeys, {key: toLastKey}) + 1 : 0;
  const index = i;

  dispatch(processing());

  for (; i < index + 10 && i < toKeys.length; ++i) {
    const { key, userKey } = toKeys[i];
    let user = await getUserByUserKey(toUsers, userKey, dispatch);

    const list = getState().to.toList;
    list.push({ email: user.email, userName: user.name, key });
    dispatch({ type: SET_TO_LIST, payload: list });
    FromToService.onDistributedChange(key, result => dispatch(updateDist(key, result)));
  }
  dispatch(processed());
  dispatch({ type: SET_LAST_KEY, payload: toKeys[i - 1].key });
};

export const updateDist = (key, updatedDist) => (dispatch, getState) => {
  const list = getState().to.toList;
  const index = _.findIndex(list, { key: key });
  const newDist = Object.assign(list[index], updatedDist);

  dispatch({ type: UPDATE_TO_LIST, payload: { key, newDist } });
};

export const deleteTo = (key, index) => (dispatch, getState) => {
  const { toKeys, toList, toLastKey } = getState().to;

  if (key === toLastKey) {
    if (index === 0) {
      dispatch({ type: SET_LAST_KEY, payload: '' });
    } else {
      dispatch({ type: SET_LAST_KEY, payload: toKeys[index - 1].key });
    }
  }

  dispatch({ type: SET_TO_LIST, payload: toList.filter((item, i) => i !== index) });
  dispatch({ type: SET_TO_KEYS, payload: toKeys.filter((item, i) => i !== index) });
}

const getUserByUserKey = async (toUsers, userKey, dispatch) => {
  let user = toUsers[userKey];
  if (!user) {
    user = await FromToService.getUserByUid(userKey);
    const object = { [userKey]: { email: user.email, name: user.name } };
    dispatch({ type: SET_TO_USERS, payload: object });
  }
  return user;
};

const initialState = {
  toKeys: [],
  toLastKey: '',
  toList: [],
  toUsers: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TO_KEYS:
      return {
        ...state,
        toKeys: action.payload
      };
    case SET_LAST_KEY:
      return {
        ...state,
        toLastKey: action.payload
      };
    case SET_TO_USERS:
      return {
        ...state,
        toUsers: addToObject(state.toUsers, action.payload)
      };
    case ADD_TO:
      return {
        ...state,
        toList: state.toList.concat(action.payload)
      };
    case SET_TO_LIST:
      return {
        ...state,
        toList: action.payload
      };
    case UPDATE_TO_LIST:
      const key = action.payload.key;
      const newDist = action.payload.newDist;
      return {
        ...state,
        toList: state.toList.map(item => (item.key === key ? { ...item, ...newDist } : item))
      };
    case 'LOGOUT':
      return {
        toKeys: [],
        toLastKey: '',
        toList: [],
        toUsers: {}
      };
    default:
      return state;
  }
}
