import { authConstants } from '../constants';

const baseState = {
  isLoading: false,
  newUser: true,
  localUserData: {},
  mukData: {},
  srpData: {},
  isAuthed: false,
};

const login = (state = baseState, action) => {
  switch (action.type) {
    case authConstants.SET_KEY_DATA:
      return Object.assign({}, state, {
        mukData: action.mukObj,
        srpData: action.srpObj,
      });
    case authConstants.SET_NEW_USER:
      return Object.assign({}, state, {
        newUser: action.isNewUser,
      });
    case authConstants.SET_USER_LOCAL_DATA:
      return Object.assign({}, state, {
        localUserData: action.localData,
      });
    case authConstants.SUCCESSFUL_AUTH:
      return Object.assign({}, state, {
        isAuthed: true,
      });
    case authConstants.USER_LOGIN:
      return {
        isLoading: true,
      };
    default:
      return state;
  }
};

export default login;
