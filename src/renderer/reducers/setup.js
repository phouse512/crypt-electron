import { setupConstants } from '../constants';

const baseState = {
  registerNew: true,
};

const setup = (state = baseState, action) => {
  switch (action.type) {
    case setupConstants.CHANGE_NEW_USER:
      return Object.assign({}, state, {
        registerNew: action.registerNew,
      });
    default:
      return state;
  }
};

export default setup;
