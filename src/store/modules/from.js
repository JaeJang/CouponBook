import _ from 'lodash';

import * as FromService from '../../services/FromService';
import * as FromToService from '../../services/FromToService';
import { addToObject } from "../../utils/utils";

import { PROCESSING, PROCESSED } from '@store/types/loading';
import { processing, processed } from '@store/modules/processing';

export const SET_FROM_KEYS = 'SET_FROM_KEYS';
export const SET_FROM_LAST_KEY = 'SET_FROM_LAST_KEY';
export const SET_FROM_USERS = 'SET_FROM_USERS';
export const ADD_FROM = 'ADD_FROM';
export const SET_FROM_LIST = 'SET_FROM_LIST';
export const UPDATE_FROM_LIST = 'UPDATE_FROM_LIST';
export const ADD_TO_FRONT = 'ADD_TO_FRONT';
export const FROM_FIRST_TIME_LOADED = 'FROM_FIRST_TIME_LOADED';

const TYPE = "from";

export const addToFront = value => async (dispatch, getState) => {
  const { fromUsers } = getState().from;
  const user = await getUserByUserKey(fromUsers, value.userKey, dispatch);
  const list = getState().from.fromList;
  list.unshift({ email: user.email, userName: user.name, key: value.key });
  dispatch({ type: SET_FROM_LIST, payload: list });
  FromToService.onDistributedChange(value.key, result => dispatch(updateDist(value.key, result)));
};

export const listenToNewList = () => (dispatch, getState) => {
  FromToService.childAddedListener(TYPE, (value) => {
    const { fromKeys } = getState().from;
    const index = _.findIndex(fromKeys, { key: value.key });
    if (index === -1) {
      if (!fromKeys.length) {
        dispatch({ type: SET_FROM_LAST_KEY, payload: value.key });
      }
      fromKeys.unshift(value);
      dispatch({ type: SET_FROM_KEYS, payload: fromKeys });
      dispatch(addToFront(value));
    }
  });
};

export const getFromList = () => dispatch => {
  FromToService.getList(TYPE)
    .then(values => {
      if (values.length) {
        dispatch({ type: SET_FROM_KEYS, payload: values });
        dispatch(getFromListAfter());
      }
    })
    .catch(error => console.error(error))
    .finally(() => {
      dispatch(listenToNewList());
    });
};

export const getFromListAfter = () => async (dispatch, getState) => {
  const { fromLastKey, fromKeys, fromUsers } = getState().from;
  let i = fromLastKey !== '' ? _.findIndex(fromKeys, {key: fromLastKey}) + 1 : 0;
  const index = i;

  dispatch(processing());

  for (; i < index + 10 && i < fromKeys.length; ++i) {
    const { key, userKey } = fromKeys[i];
    let user = await getUserByUserKey(fromUsers, userKey, dispatch);

    const list = getState().from.fromList;
    list.push({ email: user.email, userName: user.name, key, userKey: userKey });
    dispatch({ type: SET_FROM_LIST, payload: list });
    FromToService.onDistributedChange(key, result => dispatch(updateDist(key, result)));
  }
  dispatch(processed());
  dispatch({ type: SET_FROM_LAST_KEY, payload: fromKeys[i - 1].key });
};

export const updateDist = (key, updatedDist) => (dispatch, getState) => {
  const list = getState().from.fromList;
  const index = _.findIndex(list, { key: key });
  const newDist = Object.assign(list[index], updatedDist);

  dispatch({ type: UPDATE_FROM_LIST, payload: { key, newDist } });
};

export const reset = () => dispatch => {
  dispatch({ type: 'LOGOUT' });
};

export const deleteFrom = (key, index) => (dispatch, getState) => {
  const { fromKeys, fromList, fromLastKey } = getState().from;

  if (key === fromLastKey) {
    if (index === 0) {
      dispatch({ type: SET_FROM_LAST_KEY, payload: '' });
    } else {
      dispatch({ type: SET_FROM_LAST_KEY, payload: fromKeys[index - 1].key });
    }
  }

  dispatch({ type: SET_FROM_LIST, payload: fromList.filter((item, i) => i !== index) });
  dispatch({ type: SET_FROM_KEYS, payload: fromKeys.filter((item, i) => i !== index) });
};

export const setFirstTimeLoaded = () => dispatch => {
  dispatch({ type: FROM_FIRST_TIME_LOADED });
}

const getUserByUserKey = async (fromUsers, userKey, dispatch) => {
  let user = fromUsers[userKey];
  if (!user) {
    user = await FromToService.getUserByUid(userKey);
    const object = { [userKey]: { email: user.email, name: user.name } };
    dispatch({ type: SET_FROM_USERS, payload: object });
  }
  return user;
};

const initialState = {
  fromKeys: [],
  fromLastKey: "",
  fromList: [],
  fromUsers: {},
  firstTimeLoaded: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_FROM_KEYS:
      return {
        ...state,
        fromKeys: action.payload
      };
    case SET_FROM_LAST_KEY:
      return {
        ...state,
        fromLastKey: action.payload
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
    case FROM_FIRST_TIME_LOADED:
        return {
          ...state,
          firstTimeLoaded: true
        }
    case 'LOGOUT':
      return {
        fromKeys: [],
        fromLastKey: '',
        fromList: [],
        fromUsers: {}
      };
    default:
      return state;
  }
}
