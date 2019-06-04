import { authConstants } from '../constants';

const baseState = {
  isLoading: false,
  newUser: true,
  userData: {},
};

const login = (state = baseState, action) => {
  switch (action.type) {
    case authConstants.USER_LOGIN:
      return {
        isLoading: true,
      };
    default:
      return state;
  }
};

export default login;
