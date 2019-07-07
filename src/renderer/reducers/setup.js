import { setupConstants } from '../constants';

const baseState = {
  invitation: {},
  loading: false,
  registerNew: true,
};

const setup = (state = baseState, action) => {
  switch (action.type) {
    case setupConstants.CHANGE_NEW_USER:
      return Object.assign({}, state, {
        registerNew: action.registerNew,
      });
    case setupConstants.SET_INVITATION:
      return Object.assign({}, state, {
        invitation: {
          ...state.invitation,
          accountId: action.accountId,
          email: action.email,
          firstName: action.firstName,
          lastName: action.lastName,
          username: action.username,
          uuid: action.uuid,
        },
      });
    case setupConstants.SET_LOADING_FLAG:
      return Object.assign({}, state, {
        loading: action.isLoading,
      });
    default:
      return state;
  }
};

export default setup;
