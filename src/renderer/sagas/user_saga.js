import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
const { ipcRenderer: ipc } = require('electron-better-ipc');
import {
  authConstants,
} from '../constants';
import { setNewUser, userLogin } from '../actions/auth.actions';

export function* sayHello() {
  console.log('HELLO');
}

function* checkExistingUser() {
  console.log('checking existing user.');
  const resp = yield ipc.callMain('check-existing-user', 'TESTUSER');
  if (resp.error) {
    console.error('Received error from ipc main');
    return;
  }

  if (resp.data.exists) {
    console.log('here is an existing user')
  } else {
    yield put(setNewUser(true));
  }
}

export function* watchCheckExisting() {
  yield takeLatest(authConstants.CHECK_EXISTING_USER, checkExistingUser);
}

export function* watchLogin() {
  yield takeEvery(authConstants.USER_LOGIN, sayHello);
}
