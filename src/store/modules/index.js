import { combineReducers } from 'redux';
import authentication from './authentication';

const appReducer = combineReducers({
  authentication
});

export default (rootReducer = (state, action) => {
  return appReducer(state, action);
});
