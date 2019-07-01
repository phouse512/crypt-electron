import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
const { ipcRenderer: ipc } = require('electron-better-ipc');
import {
  authConstants,
  setupConstants,
} from '../constants';
import {
  setNewUser,
  setUserLocalData,
  userLogin,
} from '../actions/auth.actions';
import { setInvitation, setLoadingFlag } from '../actions/setup.actions';
import { invitationRequest } from '../api/invitation';
import ipcConstants from '../../constants/ipc';

const getLocalData = (state) => state.login.localUserData;

export function* sayHello() {
  console.log('HELLO');
}

function* checkExistingUser() {
  console.log('checking existing user.');
  const resp = yield ipc.callMain(ipcConstants.CHECK_EXISTING_USER, 'TESTUSER');
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
 
  // compute promotional
  try {
    const resp = yield ipc.callMain(ipcConstants.UNLOCK_USER_CREDENTIALS, credData);
    console.log(resp);
  // store data
  } catch (error) {
    console.log(error);
  }
}

function* createInvitationRequest(action) {
  try {
    yield put(setLoadingFlag(true));
    const result = yield invitationRequest({
      email: action.email,
      username: action.username,
    })
    yield put(setInvitation({
      accountId: result.data.account_id,
      firstName: action.firstName,
      lastName: action.lastName,
      uuid: result.data.uuid,
    }));
    yield put(setLoadingFlag(false));
  } catch (error) {
    console.log(error);
  }
}

function* setMasterPass(action) {
  try {
    yield put(setLoadingFlag(true));

    console.log(action);
    // get new salt
    // get new secret key
    // derive private keys

    // generate public/private keypair

    // generate symmetric 

    // generate srpx 

    // upload keyset to server

    // generate file 
  } catch (error) {
    console.error(error);
  }
}

export function* watchCheckExisting() {
  yield takeLatest(authConstants.CHECK_EXISTING_USER, checkExistingUser);
}

export function* watchCreateInvitation() {
  yield takeLatest(setupConstants.CREATE_INVITATION_REQUEST, createInvitationRequest);
}

export function* watchCreateCredentials() {
  yield takeLatest(setupConstants.CREATE_CREDENTIALS, setMasterPass);
}

export function* watchLogin() {
  yield takeEvery(authConstants.USER_LOGIN, sayHello);
}

export function* watchUnlockAccount() {
  yield takeEvery(authConstants.UNLOCK_ACCOUNT, unlockUserCredentials);
}
