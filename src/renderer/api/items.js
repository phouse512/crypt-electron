import url from 'url';

import { urlConstants } from '../constants';

export const listItems = ({ albumId, jwt }) => {
  const params = { albumId };
  const queryString = url.format({ query: params });
  const url = `${urlConstants.BASE_URL}/item${queryString}`
  const request = new Request(url, {
    method: 'GET',
    headers: new Headers({
      'crypt-api-key': jwt,
    }),
    body: '',
  });
};
