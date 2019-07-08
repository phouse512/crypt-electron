import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
// const { ipcRenderer: ipc } = require('electron-better-ipc');
const ipc = require('electron-better-ipc');
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
import { invitationRequest, registrationRequest } from '../api/invitation';
import ipcConstants from '../../constants/ipc';

const getLocalData = (state) => state.login.localUserData;
const getInvitationData = (state) => state.setup.invitation;

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
    salt: localUserData.salt,
    secretKey: localUserData.secretKey,
  };

  const serverData = localUserData.cachedData.serverData;
 
  // compute promotional
  try {
    const keyResp = yield ipc.callMain(ipcConstants.UNLOCK_USER_CREDENTIALS, {
      credData,
      serverData,
    });
    
    console.log(keyResp);

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
      email: action.email,
      firstName: action.firstName,
      lastName: action.lastName,
      username: action.username,
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
    // get all existing invitation data
    const invitationData = yield select(getInvitationData);

    // get credentials from call
    const credentials = yield ipc.callMain(ipcConstants.GENERATE_CREDENTIALS, {
      accountId: invitationData.accountId,
      email: invitationData.email,
      masterPass: action.masterPass,
    });

    // write to local
    const writeResult = yield ipc.callMain(ipcConstants.STORE_LOCAL_CONFIG, {
      localConfigData: credentials.data.localConfigData,
    });

    // send to public server
    const result = yield registrationRequest({
      deviceAgent: credentials.data.deviceData.agent,
      deviceOs: credentials.data.deviceData.os,
      deviceUuid: credentials.data.deviceData.uuid,
      firstName: invitationData.firstName,
      invitationUuid: invitationData.uuid,
      lastName: invitationData.lastName,
      publicKeyset: JSON.stringify(credentials.data.serverData),
      srpAuthSalt: credentials.data.serverSrpData.salt.toString('base64'),
      srpVerifier: Buffer.from(credentials.data.serverSrpData.v, 'hex').toString('base64'),
      username: invitationData.username,
    });
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
