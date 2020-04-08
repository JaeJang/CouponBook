import firebase from '../../configs/firebase';

import { PROCESSING, PROCESSED } from '@store/types/loading';
import { ADD_LIST, GET_MY_LISTS, ADD_MY_LIST, REMOVE_LIST } from '@store/types/mycoupons';
import { processing, processed } from '@store/modules/processing';

export const addCouponList = list => (dispatch) => {
  dispatch(processing());
  dispatch({type: ADD_LIST, payload: list});
  dispatch(processed());
};

export const getMyCouponLists = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(processing());
    firebase.getCUsersRef()
      .child('myCouponLists')
      .once('value')
      .then(async snapshot => {
        //dispatch({ type: GET_MY_LISTS, payload: Object.keys(snapshot.val()) });
        dispatch(processing());
        const keys = Object.keys(snapshot.val());
        for (let key of keys) {
          const value = (await firebase.getCouponListRef().child(key).once('value')).val();
          value.key = key;
          dispatch({type: ADD_LIST, payload: value})
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
  dispatch({type: REMOVE_LIST, payload: lists});
}

const initialState = {
  lists: []
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
      }
    default:
      return state;
  }
}
