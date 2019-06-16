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
