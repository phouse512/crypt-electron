import { setupConstants } from '../constants';

export const changeNewUser = (registerNew) => ({
  type: setupConstants.CHANGE_NEW_USER,
  registerNew,
});

export const invitationRequest = ({ email, firstName, lastName, username }) => ({
  type: setupConstants.CREATE_INVITATION_REQUEST,
  email,
  firstName,
  lastName,
  username,
});

export const generateCredentials = ({ masterPass }) => ({
  type: setupConstants.CREATE_CREDENTIALS,
  masterPass,
});

export const setInvitation = ({ 
  accountId,
  email,
  firstName,
  lastName,
  username,
  uuid, 
}) => ({
  type: setupConstants.SET_INVITATION,
  accountId,
  email,
  firstName,
  lastName,
  username,
  uuid,
});

export const setLoadingFlag = (isLoading) => ({
  type: setupConstants.SET_LOADING_FLAG,
  isLoading,
});
