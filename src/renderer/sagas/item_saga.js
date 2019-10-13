import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';

import { setAlbums, setItems } from '../actions/items.actions';
import { itemConstants } from '../constants';
import { listAlbums, listItems, postItem } from '../api/items';

export const getJWToken = (state) => state.login.jwtData.encoded_token;

function* fetchAlbumSaga(action) {
  console.log('fetching albums with action: ', action);
  const jwtoken = yield select(getJWToken);

  const result = yield listAlbums({
    jwt: jwtoken,
  });
  yield put(setAlbums({
    albums: result.data.albums,
  }));
}

function* fetchItems(action) {
  console.log('fetching items with action: ', action);
  const jwtoken = yield select(getJWToken);

  const result = yield listItems({
    albumId: action.albumId,
    jwt: jwtoken,
  });
  console.log(result);
}

function* postItemSaga(action) {
  console.log('posting item');
  const jwtoken = yield select(getJWToken);

  const result = yield postItem({
    albumId: action.albumId,
    itemData: action.itemData,
    itemDataHash: action.itemDataHash,
    itemMetadata: action.itemMetadata,
    itemMetadataHash: action.itemMetadataHash,
    jwt: jwtoken,
  });

  console.log(result);
}

export function* watchPostItem() {
  yield takeLatest(itemConstants.POST_ITEM_REQUEST, postItemSaga);
}

export function* watchFetchAlbums() {
  yield takeLatest(itemConstants.FETCH_ALBUMS_REQUEST, fetchAlbumSaga);
}

export function* watchFetchItems() {
  yield takeLatest(itemConstants.FETCH_ITEMS_REQUEST, fetchItems);
}
