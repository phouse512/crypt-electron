import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';

import { itemConstants } from '../constants';
import { listItems } from '../api/items';

export const getJWToken = (state) => state.login.jwtData.encoded_token;

function* fetchItems(action) {
  console.log('fetching items with action: ', action);
  const jwtoken = yield select(getJWToken);

  const result = yield listItems({
    albumId: action.albumId,
    jwt: jwtoken,
  });
  console.log(result);
}

export function* watchFetchItems() {
  yield takeLatest(itemConstants.FETCH_ITEMS_REQUEST, fetchItems);
}
