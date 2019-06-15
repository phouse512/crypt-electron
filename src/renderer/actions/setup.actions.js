import { setupConstants } from '../constants';

export const changeNewUser = (registerNew) => ({
  type: setupConstants.CHANGE_NEW_USER,
  registerNew,
});