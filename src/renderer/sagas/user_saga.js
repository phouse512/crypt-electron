import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
const { ipcRenderer: ipc } = require('electron-better-ipc');
import {
  authConstants,
} from '../constants';
import { userLogin } from '../actions/auth.actions';

export function* sayHello() {
  console.log('HELLO');
}

function* checkExistingUser() {
  console.log('checking existing user.');
  const existingUser = yield ipc.callMain('check-existing-user', 'TESTUSER');
  console.log(existingUser)
}

export function* watchCheckExisting() {
  yield takeLatest(authConstants.CHECK_EXISTING_USER, checkExistingUser);
}

export function* watchLogin() {
  yield takeEvery(authConstants.USER_LOGIN, sayHello);
}
