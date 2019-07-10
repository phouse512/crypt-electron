const assert = require('assert').strict;
const crypto = require('crypto');
const hkdf = require('futoin-hkdf');
const xor = require('buffer-xor');
const bigint = require('bigint-buffer');
const bigInt = require('big-integer');

import params, { hexToBigInt } from './srpParams';

const VERSION = 'crypt-0.01';

/*
 * Encrypt with AES-256-GCM.
 * @param key: Buffer
 * @param data: Buffer
 * returns: Buffer
 */
const aes256gcmEncrypt = (key, data) => {
  const iv = Buffer.alloc(16);
  crypto.randomFillSync(iv, 0);
  console.log('IV ENCRYPT')
  console.log(iv.toString('base64'))
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const cipherText = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();
  console.log('AUTH TAG');
  console.log(authTag.toString('base64'));
  
  // create byte that indicates IV length
  let bufferLength = Buffer.alloc(1);
  bufferLength.writeUInt8(iv.length, 0);

  // concat IV length, IV, authTag, cipherText
  return Buffer.concat([bufferLength, iv, authTag, cipherText]);
};

/*
 * Generic encryption method that takes an algorithm. If unknown algorithm specified, returns an 
      error. Returns a ciphertext as Buffer object
 * @param alg: string
 * @param key: Buffer
 * @param data: Buffer
 * returns: Buffer
 */
export const encrypt = (alg, key, data) => {
  assert.strictEqual(true, Buffer.isBuffer(data));
  assert.strictEqual(true, Buffer.isBuffer(key));

  switch (alg) {
    case 'A256GCM':
      return aes256gcmEncrypt(key, data);
    default:
      throw new Error('Unknown algorithm type.');
  }
};

/*
 * Decrypt with AES-256-GCM.
 * @param key: Buffer
 * @param cipherText: Buffer
 * returns: Buffer
 */
const aes256gcmDecrypt = (key, cipherText) => {
  // read first byte to get IV size
  const ivSize = cipherText.readUInt8(0);
  const iv = cipherText.slice(1, ivSize + 1);
  
  // aes256 gcm auth tags are 16 bytes
  const authTag = cipherText.slice(ivSize + 1, ivSize + 17);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(cipherText.slice(ivSize + 17)), decipher.final()]);
}

/*
 * Generic decryption method that takes an algorithm. If unknown algorithm specified, returns an 
      error. Returns a decrypted Buffer
 * @param alg: string
 * @param key: Buffer
 * @param ciphertext: Buffer
 * returns: Buffer
 */
export const decrypt = (alg, key, cipherText) => {
  assert.strictEqual(true, Buffer.isBuffer(cipherText));
  assert.strictEqual(true, Buffer.isBuffer(key));

  switch (alg) {
    case 'A256GCM':
      return aes256gcmDecrypt(key, cipherText);
    default:
      throw new Error('Unknown algorithm type.');
  }
};

export const getSrpX = (params, salt, I, P) => {
  // ASSERT salt, I, P are all buffers
  assert.strictEqual(true, Buffer.isBuffer(salt));
  assert.strictEqual(true, Buffer.isBuffer(I));
  assert.strictEqual(true, Buffer.isBuffer(P));

  // = H(I | ":" | P))
  var hashIP = crypto.createHash(params.hash)
    .update(Buffer.concat([I, Buffer.from(':'), P]))
    .digest();
  
  // = H(s | H(I | ":" | P))
  var hashX = crypto.createHash(params.hash)
    .update(salt)
    .update(hashIP)
    .digest();
  
  return bigint.toBigIntLE(hashX).toString('16');
};

export const computeVerifier = (params, salt, I, P) => {
  // ASSERT salt, I, P are all buffers
  assert.strictEqual(true, Buffer.isBuffer(salt));
  assert.strictEqual(true, Buffer.isBuffer(I));
  assert.strictEqual(true, Buffer.isBuffer(P));

  // v = g % N
  const x = hexToBigInt(getSrpX(params, salt, I, P));
  const v = bigInt(params.g).modPow(x, params.N);

  // returns hex representation of bigint
  return v.toString('16');
}

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

  // console.log('xoredMuk: ', xoredMuk.toString('base64'));
  // console.log('xoredSrp: ', xoredSrp.toString('base64'));
  // console.log('bigint: ', bigint.toBigIntBE(xoredSrp));
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
      salt: srpSalt,
      srpv: computeVerifier(
        params['2048'],
        salt,
        Buffer.from(email, 'utf8'),
        xoredSrp,
      ),
      srpx: getSrpX(
        params['2048'],
        salt,
        Buffer.from(email, 'utf8'),
        xoredSrp,
      ),
    },
  };
};

export const generateSecretKey = () => {
  const intSet = [...Array(8).keys()].map(obj => obj + 1);
  const charSet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const charSet2 = ['J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T'];
  const charSet3 = ['V', 'W', 'X', 'Y', 'Z'];

  const allSet = intSet.concat(charSet, charSet2, charSet3);
  let key = '';
  for (var i = 0; i < 32; i++) {
    const randElem = allSet[Math.floor(Math.random() * allSet.length)];
    key = key.concat(randElem);
  }

  return key;
}

export const generateSalt = () => {
  const buf = Buffer.alloc(16);
  crypto.randomFillSync(buf, 0, 16);
  return buf;
}

// derivePrivateKeys({
//   accountId: 40, 
//   email: '7@gmail.com',
//   masterPass: 'hello_deer_pizzeria_valid',
//   salt: 'ZHZCWIPMOZZVLNKY',
//   secretKey: 'GGZYQ5RWJBXZMDC7NYNQYSQZWGRXJ3V3',
// });