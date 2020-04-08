import { combineReducers } from 'redux';
import authentication from './authentication';
import processing from './processing';
import mycoupons from './mycoupons';

const appReducer = combineReducers({
  authentication,
  processing,
  mycoupons
});

export default (rootReducer = (state, action) => {
  return appReducer(state, action);
});
