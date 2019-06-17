import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import login from './login';
import setup from './setup';

const appReducer = combineReducers({
  form: formReducer,
  login,
  setup,
});

const cryptApp = (state, action) => {
  return appReducer(state, action);
};

export default cryptApp;
