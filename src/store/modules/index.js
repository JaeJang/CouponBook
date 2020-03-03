import { combineReducers } from 'redux';
import authentication from './authentication';
import processing from './processing';

const appReducer = combineReducers({
  authentication,
  processing
});

export default (rootReducer = (state, action) => {
  return appReducer(state, action);
});
