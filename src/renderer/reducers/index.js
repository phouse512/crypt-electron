import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import items from './items';
import login from './login';
import setup from './setup';
import views from './views';

import { formsConstants } from '../constants';

const customFormReducer = {
  addPhoto: (state, action) => {
    switch (action.type) {
      case formsConstants.NEW_PHOTO_METADATA:
        return Object.assign({}, state, {
          values: {
            ...state.values,
            metadata: action.metadataFields,
          },
        });
      default:
        return state;
    }
  },
};

const appReducer = combineReducers({
  form: formReducer.plugin(customFormReducer),
  items,
  login,
  setup,
  views,
});

const cryptApp = (state, action) => {
  return appReducer(state, action);
};

export default cryptApp;
