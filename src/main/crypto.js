const crypto = require('crypto');
const hkdf = require('futoin-hkdf');
const xor = require('buffer-xor');
const bigint = require('bigint-buffer');

const VERSION = 'crypt-0.01';

export const derivePrivateKeys = ({
  accountId,
  email,
  masterPass,
  salt,
  secretKey,
}) => {
  // trim master pass
  const trimmedMasterPass = masterPass.trim();

  // normalize master passcode with NFKD
  const normMasterPass = trimmedMasterPass.normalize('NFKD');

  // build salt, HKDF(s, version, e, 32)
  const masterPassSalt = hkdf(salt, 32, {
    salt: email,
    info: VERSION,
    hash: 'SHA-256',
  });

  const srpSalt = hkdf(salt, 32, {
    salt: accountId.toString(),
    info: VERSION,
    hash: 'SHA-256',
  });

  // console.log(masterPassSalt.toString('base64'));
  // console.log(srpSalt.toString('base64'));

  // slow hash master pass PBKDF2(p, s, 100000)
  const hashedMasterPass = crypto.pbkdf2Sync(
    normMasterPass,
    masterPassSalt,
    100000,
    32,
    'sha256',
  );

  // slow hash master password for srp
  const hashedSrp = crypto.pbkdf2Sync(
    normMasterPass,
    srpSalt,
    100000,
    32,
    'sha256',
  );

  // console.log(hashedMasterPass.toString('base64'));
  // console.log(hashedSrp.toString('base64'));

  // hkdf secret key, HKDF(ka, version, I, len(km))
  const ka = hkdf(
    secretKey, hashedSrp.length, {
      salt: accountId.toString(),
      info: VERSION,
      hash: 'SHA-256',
    });

  const srpKa = hkdf(
    secretKey, hashedSrp.length, {
      salt: accountId.toString(),
      info: VERSION,
      hash: 'SHA-256',
    });
  
  // console.log(ka.toString('base64'));
  // console.log(srpKa.toString('base64'));

  // ka xor km
  const xoredMuk = xor(ka, hashedMasterPass);

  // srp: kap xor srp km
  const xoredSrp = xor(srpKa, hashedSrp);

  console.log('xoredMuk: ', xoredMuk.toString('base64'));
  console.log('xoredSrp: ', xoredSrp.toString('base64'));
  console.log('bigint: ', bigint.toBigIntBE(xoredSrp));
  return {
    mukObj: {
      alg: 'A256GCM',
      ext: false,
      k: xoredMuk,
      keyOps: ['decrypt', 'encrypt'],
      kty: 'oct',
      kid: 'mp',
    },
    srpObj: {
      srpx: xoredSrp,
      salt: srpSalt,
    },
  };
}

// derivePrivateKeys({
//   accountId: 40, 
//   email: '7@gmail.com',
//   masterPass: 'hello_deer_pizzeria_valid',
//   salt: 'ZHZCWIPMOZZVLNKY',
//   secretKey: 'GGZYQ5RWJBXZMDC7NYNQYSQZWGRXJ3V3',
// });