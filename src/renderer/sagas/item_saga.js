import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
const ipc = require('electron-better-ipc');

import {
  fetchAlbums,
  fetchItems,
  postAlbumFailure,
  postAlbumSuccess,
  postItemFailure,
  postItemSuccess,
  setAlbums,
  setAlbumDetails,
  setItems,
  setItemsData,
} from '../actions/items.actions';
import { changeAlbumModalState, changePhotoModalState } from '../actions/views.actions';
import { itemConstants } from '../constants';
import {
  listAlbums,
  listItems,
  postAlbum,
  postItem,
} from '../api/items';
import ipcConstants from '../../constants/ipc';
import { getM } from '../../main/srp';

export const getAlbumById = (state, albumId) => state.items.albums[albumId];
export const getJWToken = (state) => state.login.jwtData.encoded_token;
export const getMukObj = (state) => state.login.mukData;

function* fetchAlbumSaga(action) {
  try {
    console.log('fetching albums with action: ', action);
    const jwtoken = yield select(getJWToken);

    const result = yield listAlbums({
      jwt: jwtoken,
    });
    yield put(setAlbums({
      albums: result.data.albums,
    }));

    if (action.fetchItems) {
      console.log('am i inside');
      for (var i=0; i<result.data.albums.length; i++) {
        yield put(fetchItems({ albumId: result.data.albums[i].id }));
      }
    }
    const mukObj = yield select(getMukObj);
    const albumResp = yield ipc.callMain(ipcConstants.DECRYPT_ALBUM_DETAILS, {
      albums: result.data.albums,
      muk: mukObj,
    });
    yield put(setAlbumDetails({ albumMap: albumResp.data.albumMap }));
  } catch (error) {
    console.error('Unable to fetch items.');
    console.error(error);
  }
}

function* fetchItemsSaga(action) {
  const jwtoken = yield select(getJWToken);
  const mukObj = yield select(getMukObj);

  const result = yield listItems({
    albumId: action.albumId,
    jwt: jwtoken,
  });

  yield put(setItems({ items: result.data.items }));
  const resp = yield ipc.callMain(ipcConstants.LOAD_ENCRYPTED_PHOTOS, {
    items: result.data.items,
    muk: mukObj,
  });

  yield put(setItemsData({ itemMap: resp.data.items }));

  // decrypt item metadata
  const album = yield select(getAlbumById, action.albumId);
  const metadataResp = yield ipc.callMain(ipcConstants.DECRYPT_ITEM_METADATA, {
    albums: [album],
    items: result.data.items,
    muk: mukObj,
  })

  yield put(setItemsData({ itemMap: metadataResp.data.itemMap }));
}

function* postAlbumSaga(action) {
  try {
    // get encrypted name, desc
    const mukObj = yield select(getMukObj);

    const resp = yield ipc.callMain(ipcConstants.CREATE_ALBUM, {
      description: action.description,
      muk: mukObj,
      name: action.name,
    });

    if (resp.error) {
      console.error('unable to generate album');
      return;
    }
    // make api call
    const jwtoken = yield select(getJWToken);
    const result = yield postAlbum({
      description: resp.data.encryptedDescription,
      encryptedVaultKey: resp.data.encryptedVaultKey,
      jwt: jwtoken,
      name: resp.data.encryptedName,
    });

    console.log('post album result: ', result);

    yield put(postAlbumSuccess({}));
    yield put(changeAlbumModalState({ newState: false }));
    yield put(fetchAlbums());
  } catch (error) {
    console.error('There is an error: ', error);
    // handle later
  }
}

function* postItemSaga(action) {
  try {
    // get muk obj
    const mukObj = yield select(getMukObj);
    const album = yield select(getAlbumById, action.albumId);

    // convert metadata from {key1: '', value1: '',....} -> object
    const objValuesLength = Object.keys(action.itemMetadata).length;
    const newObj = {};
    for (var i=1; i <= objValuesLength / 2; i++) {
      const keyName = `key${i}`;
      const valueName = `value${i}`;
      newObj[action.itemMetadata[keyName]] = action.itemMetadata[valueName];
    }

    const resp = yield ipc.callMain(ipcConstants.GET_ENCRYPTED_METADATA, {
      album,
      metadata: {
        metadata: newObj,
        version: '11-21-2019', 
      },
      muk: mukObj,
    });

    if (resp.error) {
      console.error('Unable to encrypt metadata.')
      throw Error("Unable to encrypt!!");
    }

    const jwtoken = yield select(getJWToken);

    const result = yield postItem({
      albumId: action.albumId,
      itemData: action.itemData,
      itemDataHash: action.itemDataHash,
      itemMetadata: resp.data.metadata,
      itemMetadataHash: resp.data.metadataHash,
      jwt: jwtoken,
    });

    console.log('post item result: ', result)

    // fire action that notifies

    // clear form / close modal 
    yield put(postItemSuccess({}));
    yield put(changePhotoModalState({ newState: false }));
  } catch (error) {
    console.error('Unable to post new item: ', error);
    yield put(postItemFailure({}));
  }
}

export function* watchPostAlbum() {
  yield takeLatest(itemConstants.POST_ALBUM_REQUEST, postAlbumSaga);
}

export function* watchPostItem() {
  yield takeLatest(itemConstants.POST_ITEM_REQUEST, postItemSaga);
}

export function* watchFetchAlbums() {
  yield takeLatest(itemConstants.FETCH_ALBUMS_REQUEST, fetchAlbumSaga);
}

export function* watchFetchItems() {
  yield takeEvery(itemConstants.FETCH_ITEMS_REQUEST, fetchItemsSaga);
}
