import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';

import { itemConstants } from '../constants';
import { listItems } from '../api/items';

function* fetchItems(action) {
  console.log('fetching items with action: ', action);
}

export function* watchFetchItems() {
  yield takeLatest(itemConstants.FETCH_ITEMS_REQUEST, fetchItems);
}
