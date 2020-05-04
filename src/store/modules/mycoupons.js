import firebase from '../../configs/firebase';
import _ from 'lodash';

import * as MyCouponService from '@service/MyCouponService';
import { PROCESSING, PROCESSED } from '@store/types/loading';
import { processing, processed } from '@store/modules/processing';

export const ADD_LIST = 'ADD_LIST';
export const GET_LISTS = 'GET_LISTS';
export const GET_MY_LISTS = 'GET_MY_LISTS';
export const ADD_MY_LIST = 'ADD_MY_LIST';
export const REMOVE_LIST = 'REMOVE_LIST';
export const GET_MY_COUPON_KEYS = 'GET_MY_COUPON_KEYS'; 
export const EDIT_LAST_KEY = 'EDIT_LAST_KEY';
export const ADD_COUPON = 'ADD_COUPON';
export const RESET_COUPONS = 'RESET_COUPONS';
export const SET_COUPONS = 'SET_COUPONS';

export const addCouponList = list => dispatch => {
  dispatch(processing());
  dispatch({ type: ADD_LIST, payload: list });
  dispatch(processed());
};

export const getMyCouponLists = () => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch(processing());
    firebase
      .getCUsersRef()
      .child('myCouponLists')
      .once('value')
      .then(async snapshot => {
        //dispatch({ type: GET_MY_LISTS, payload: Object.keys(snapshot.val()) });
        dispatch(processing());
        const values = snapshot.val();
        if (!values) {
          resolve();
        }
        const keys = Object.keys(values);
        for (let key of keys) {
          const value = (await firebase.getCouponListRef().child(key).once('value')).val();
          value.key = key;
          dispatch({ type: ADD_LIST, payload: value });
        }
        dispatch(processed());
        resolve();
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => dispatch(processed()));
  });
};

export const removeListFromList = index => (dispatch, getState) => {
  let lists = getState().mycoupons.lists;
  lists.splice(index, 1);
  dispatch({ type: REMOVE_LIST, payload: lists });
};

export const getMyCoupons = () => dispatch => {
  MyCouponService.getMyCouponKeys().then(keys => {
    dispatch({ type: GET_MY_COUPON_KEYS, payload: keys });
    dispatch(getMyCouponsKeyAfter());
  });
};

export const getMyCouponsKeyAfter = () => async (dispatch, getState) => {
  const lastKey = getState().mycoupons.couponLastKey;
  const keys = getState().mycoupons.couponKeys;
  const list = [];
  let i = keys.indexOf(lastKey) !== -1 ? keys.indexOf(lastKey) + 1 : 0;
  const index = i;
  dispatch(processing());
  for (; i < index + 10 && i < keys.length; i++) {
    const coupon = await MyCouponService.getCouponByKey(keys[i]);
    coupon.key = keys[i];
    list.push(coupon);
  }
  dispatch(processed());
  dispatch({ type: EDIT_LAST_KEY, payload: keys[i - 1] });
  dispatch({ type: ADD_COUPON, payload: list });
};

export const refreshMyCoupons = () => dispatch => {
  dispatch({ type: EDIT_LAST_KEY, payload: '' });
  dispatch({ type: GET_MY_COUPON_KEYS, payload: [] });
  dispatch({ type: RESET_COUPONS, payload: [] });
  dispatch(getMyCoupons());
};

export const removeCouponFromList = (parentKey, key) => (dispatch, getState) => {
  const lists = getState().mycoupons.lists;
  const parentIndex = _.findIndex(lists, { key: parentKey });
  const index = _.findIndex(lists[parentIndex].list, { key: key });
  lists[parentIndex].list.splice(index, 1);
  dispatch({ type: GET_MY_LISTS, payload: lists });
};

export const removeCoupon = (key, index) => (dispatch, getState) => {
  const coupons = getState().mycoupons.coupons;
  const keys = getState().mycoupons.couponKeys;
  const lastKey = getState().mycoupons.couponLastKey;
  if (key === lastKey) {
    if (keys.length - 1 === index) dispatch({ type: EDIT_LAST_KEY, payload: '' });
  } else {
    dispatch({ type: EDIT_LAST_KEY, payload: keys[index - 1] });
  }
  coupons.splice(index, 1);
  keys.splice(index, 1);
  dispatch({ type: SET_COUPONS, payload: coupons });
  dispatch({ type: GET_MY_COUPON_KEYS, payload: keys });
};

const initialState = {
  lists: [],
  couponKeys: [],
  coupons: [],
  couponLastKey: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_LIST:
      return {
        ...state,
        lists: state.lists.concat(action.payload)
      };
    case GET_MY_LISTS:
      return {
        ...state,
        lists: action.payload
      };
    case REMOVE_LIST:
      return {
        ...state,
        lists: action.payload
      };
    case EDIT_LAST_KEY:
      return {
        ...state,
        couponLastKey: action.payload
      };
    case ADD_COUPON:
      return {
        ...state,
        coupons: state.coupons.concat(action.payload)
      };
    case RESET_COUPONS:
      return {
        ...state,
        coupons: []
      };
    case GET_MY_COUPON_KEYS:
      return {
        ...state,
        couponKeys: action.payload
      };
    case SET_COUPONS:
      return {
        ...state,
        coupons: action.payload
      };
    default:
      return state;
  }
}
