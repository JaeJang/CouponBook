import { combineReducers } from 'redux';
import authentication from './authentication';
import processing from './processing';
import mycoupons from './mycoupons';
import from from './from';
import profile from './profile';

const appReducer = combineReducers({
  authentication,
  processing,
  mycoupons,
  from,
  profile
});

export default (rootReducer = (state, action) => {
  return appReducer(state, action);
});
