import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
const { ipcRenderer: ipc } = require('electron-better-ipc');
import {
  authConstants,
} from '../constants';
import {
  setNewUser,
  setUserLocalData,
  userLogin,
} from '../actions/auth.actions';

const getLocalData = (state) => state.login.localUserData;

export function* sayHello() {
  console.log('HELLO');
}

function* checkExistingUser() {
  console.log('checking existing user.');
  const resp = yield ipc.callMain('check-existing-user', 'TESTUSER');
  console.log(resp);
  if (resp.error) {
    console.error('Received error from ipc main');
    return;
  }

  if (resp.data.exists) {
    // TODO: check the validity of local contents
    console.log('here is an existing user')
    yield put(setNewUser(false));
    yield put(setUserLocalData({ localData: resp.data.userData }));
  } else {
    console.log('is a new user')
    yield put(setNewUser(true));
  }
}

function* unlockUserCredentials(action) {
  // access other data required
  let localUserData = yield select(getLocalData);

  const credData = {
    accountId: localUserData.accountId,
    email: localUserData.email,
    masterPass: action.masterPass,
    salt: localUserData.accountSalt,
    secretKey: localUserData.secretKey,
  };
  console.log('CRED DATA: ', credData);
 
  // compute promotional
  try {
    const resp = yield ipc.callMain('unlock-user-credentials', credData);
    console.log(resp);
  // store data
  } catch (error) {
    console.log(error);
  }
}

export function* watchCheckExisting() {
  yield takeLatest(authConstants.CHECK_EXISTING_USER, checkExistingUser);
}

export function* watchLogin() {
  yield takeEvery(authConstants.USER_LOGIN, sayHello);
}

export function* watchUnlockAccount() {
  yield takeEvery(authConstants.UNLOCK_ACCOUNT, unlockUserCredentials);
}
