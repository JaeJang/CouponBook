import { combineReducers } from 'redux';
import authentication from './authentication';
import processing from './processing';
import mycoupons from './mycoupons';
import from from './from';
import profile from './profile';
import to from './to';

const appReducer = combineReducers({
  authentication,
  processing,
  mycoupons,
  from,
  profile,
  to
});

export default (rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
});
