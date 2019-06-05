import { authConstants } from '../constants';

const baseState = {
  isLoading: false,
  newUser: true,
  localUserData: {},
  mukData: {},
  srpData: {},
};

const login = (state = baseState, action) => {
  switch (action.type) {
    case authConstants.USER_LOGIN:
      return {
        isLoading: true,
      };
    case authConstants.SET_NEW_USER:
      return Object.assign({}, state, {
        newUser: action.isNewUser,
      });
    default:
      return state;
  }
};

export default login;
