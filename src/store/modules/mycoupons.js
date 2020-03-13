import { PROCESSING, PROCESSED } from '@store/types/loading';
import { ADD_LIST } from '@store/types/mycoupons';
import { processing, processed } from '@store/modules/processing';

export const addCouponList = (data, onSuccess, onFailed) => dispatch => {
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