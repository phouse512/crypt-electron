const url = require('url');
import { urlConstants } from '../constants';
import { queryParams } from './util';

export const listAlbums = ({ jwt }) => {
  const url = `${urlConstants.BASE_URL}/album`;
  const request = new Request(url, {
    method: 'GET',
    headers: new Headers({
      'crypt-api-key': `Bearer ${jwt}`,
    }),
  });

  return fetch(request).then(resp => {
    return resp.json();
  });
};

export const listItems = ({ albumId, jwt }) => {
  const params = { albumId };
  const queryString = queryParams(params);
  const url = `${urlConstants.BASE_URL}/item${queryString}`
  const request = new Request(url, {
    method: 'GET',
    headers: new Headers({
      'crypt-api-key': `Bearer ${jwt}`,
    }),
  });

  return fetch(request).then(resp => {
    return resp.json();
  }).catch(err => {
    throw new Error('Unable to fetch items with error: ' + err);
  });
};

export const postItem = ({ 
  albumId,
  itemData,
  itemDataHash,
  itemMetadata,
  itemMetadataHash,
  jwt,
}) => {
  const body = {
    album_id: albumId,
    item_data: itemData,
    item_data_hash: itemDataHash,
    item_metadata: itemMetadata,
    item_metadata_hash: itemMetadataHash,
  };
  const url = `${urlConstants.BASE_URL}/item`
  const request = new Request(url, {
    body: JSON.stringify(body),
    headers: new Headers({
      'crypt-api-key': `Bearer ${jwt}`,
    }),
    method: 'POST',
  });

  return fetch(request).then(resp => {
    return resp.json();
  }).catch(err => {
    throw new Error('Unable to fetch items with error: ' + err);
  });
};
