import { authConstants } from '../constants';

export const checkUserLogin = () => ({
  type: authConstants.CHECK_EXISTING_USER,
});

export const userLogin = () => ({
  type: authConstants.USER_LOGIN,
});

export const setKeyData = ({ mukObj, srpObj }) => ({
  type: authConstants.SET_KEY_DATA,
  mukObj,
  srpObj,
});

export const setNewUser = (isNewUser) => ({
  type: authConstants.SET_NEW_USER,
  isNewUser,
});

export const setUserLocalData = ({ localData }) => ({
  type: authConstants.SET_USER_LOCAL_DATA,
  localData,
});

export const successfulAuth = () => ({
  type: authConstants.SUCCESSFUL_AUTH,
});

export const unlockAccount = ({ masterPass }) => ({
  type: authConstants.UNLOCK_ACCOUNT,
  masterPass,
});

export const unsuccessfulAuth = () => ({
  type: authConstants.UNSUCCESSFUL_AUTH,
});
