import { setupConstants } from '../constants';

export const changeNewUser = (registerNew) => ({
  type: setupConstants.CHANGE_NEW_USER,
  registerNew,
});

export const invitationRequest = ({ email, username }) => ({
  type: setupConstants.CREATE_INVITATION_REQUEST,
  email,
  username,
});

export const setInvitation = ({ accountId, uuid }) => ({
  type: setupConstants.SET_INVITATION,
  accountId,
  uuid,
});

export const setLoadingFlag = (isLoading) => ({
  type: setupConstants.SET_LOADING_FLAG,
  isLoading,
});
