import firebase from '../../configs/firebase';

import { PROCESSING, PROCESSED } from '@store/types/loading';
import { ADD_LIST, GET_LISTS } from '@store/types/mycoupons';
import { processing, processed } from '@store/modules/processing';

export const addCouponList = (data, onSuccess, onFailed) => dispatch => {
  dispatch(processing());
  dispatch(processed());
}

export const getCouponLists = (onSuccess, onFailed) => dispatch => {
  const uid = firebase.auth().currentUser.uid;
  dispatch(processing());
  
  dispatch(processed()); 
}

const initialState = {
  lists: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case ADD_LIST:
      return {
        ...state,
        lists: state.lists.push(action.payload)
      }
    default:
      return state;
  }

}