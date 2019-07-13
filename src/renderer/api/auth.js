import { urlConstants } from '../constants';

export const srpStepOne = ({
  A,
  I,
}) => {
  const request = new Request(`${urlConstants.BASE_URL}/auth/one`, {
    method: 'POST',
    headers: new Headers({}),
    body: JSON.stringify({
      A,
      I,
    }),
  });

  return fetch(request).then(resp => {
    return resp.json();
  }).catch(err => {
    throw new Error('Unable to perform step one auth: ' + err);
  });
}