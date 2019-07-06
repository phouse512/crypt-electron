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
};

export const registrationRequest = ({
  deviceAgent,
  deviceOs,
  deviceUuid,
  firstName,
  invitationUuid,
  lastName,
  publicKeyset,
  srpAuthSalt,
  srpVerifier,
  username,
}) => {
  const request = new Request(`${urlConstants.BASE_URL}/user`, {
    method: 'POST',
    headers: new Headers({}),
    body: JSON.stringify({
      device_agent: deviceAgent,
      device_os: deviceOs,
      device_uuid: deviceUuid,
      first_name: firstName,
      invitation_uuid: invitationUuid,
      last_name: lastName,
      keyset: publicKeyset,
      srp_auth_salt: srpAuthSalt,
      srp_verifier: srpVerifier,
      username: username,
    }),
  });

  return fetch(request).then(resp => {
    return resp.json();
  }).catch(err => {
    throw new Error('Unable to register user with error: ' + err);
  });
};
