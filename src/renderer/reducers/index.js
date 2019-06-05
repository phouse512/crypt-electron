import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import login from './login';

const appReducer = combineReducers({
  form: formReducer,
  login,
});

const cryptApp = (state, action) => {
  return appReducer(state, action);
};

export default cryptApp;
