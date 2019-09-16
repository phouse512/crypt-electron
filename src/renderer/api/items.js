const url = require('url');
import { urlConstants } from '../constants';
import { queryParams } from './util';

export const listAlbums = ({ jwt }) => {
  const url = `${urlConstants.BASE_URL}/albums`;
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
