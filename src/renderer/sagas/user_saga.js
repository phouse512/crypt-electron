import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';

import {
  authConstants,
} from '../constants';
import { userLogin } from '../actions/auth.actions';

export function* sayHello() {
  console.log('HELLO');
}

export function* watchLogin() {
  yield takeEvery(authConstants.USER_LOGIN, sayHello);
}
