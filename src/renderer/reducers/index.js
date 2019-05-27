import { combineReducers } from 'redux';

import login from './login';

const appReducer = combineReducers({
  login,
});

const cryptApp = (state, action) => {
  return appReducer(state, action);
};

export default cryptApp;
