import { urlConstants } from '../constants';

export const invitationRequest = ({
  email,
  username,
}) => {
  const request = new Request(`${urlConstants.BASE_URL}/register`, {
    method: 'POST',
    headers: new Headers({}),
    body: JSON.stringify({
      email,
      username,
    }),    
  });

  return fetch(request).then(resp => {
    return resp.json();
  }).catch(err => {
    throw new Error('Unable to create new invitation with error: ' + err)
  });
}