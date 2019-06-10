import { authConstants } from '../constants';

export const checkUserLogin = () => ({
  type: authConstants.CHECK_EXISTING_USER,
});

export const userLogin = () => ({
  type: authConstants.USER_LOGIN,
});

export const setNewUser = (isNewUser) => ({
  type: authConstants.SET_NEW_USER,
  isNewUser,
});

export const setUserLocalData = ({ localData }) => ({
  type: authConstants.SET_USER_LOCAL_DATA,
  localData,
});

export const unlockAccount = ({ masterPass }) => ({
  type: authConstants.UNLOCK_ACCOUNT,
  masterPass,
});
