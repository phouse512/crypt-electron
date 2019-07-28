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

export const beginServerAuth = ({ email, srpSalt, srpx }) => ({
  type: authConstants.BEGIN_SERVER_AUTH,
  email,
  srpSalt,
  srpx,
});

export const serverAuthSuccess = ({ jwt }) => ({
  type: authConstants.SUCCESSFUL_SERVER_AUTH,
  jwt,
});

export const serverAuthFailure = ({}) => ({
  type: authConstants.UNSUCCESSFUL_SERVER_AUTH,
});
