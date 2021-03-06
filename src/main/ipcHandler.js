const crypto = require('crypto');
import os from 'os';
import uuidv4 from 'uuid/v4';

import {
  derivePrivateKeys,
  encrypt,
  generateSalt,
  generateSecretKey,
} from './crypto';

const PUBLIC_EXPONENT = 65537;

/*
 * IPC handler for generating credentials.
 * @param: data
 */
export const generateCredentials = (data) => {
  try {
    // assert object

    const userSalt = generateSalt();
    const secretKey = generateSecretKey();
    // generate muk
    const mukObj = derivePrivateKeys({
      accountId: data.accountId,
      email: data.email,
      masterPass: data.masterPass,
      salt: userSalt,
      secretKey: secretKey,
    });

    // console.log(mukObj);

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicExponent: PUBLIC_EXPONENT,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // generate symmetric
    const vaultKey = Buffer.alloc(32);
    crypto.randomFillSync(vaultKey, 0);
    // console.log(vaultKey);

    // encrypt symmetric with private
    const encryptedVaultKey = crypto.publicEncrypt({
      key: publicKey,
      passphrase: '',
    }, vaultKey);
    // console.log(encryptedVaultKey);
    // console.log(privateKey);

    // const decryptedVaultKey = crypto.privateDecrypt(privateKey, encryptedVaultKey);
    // console.log(decryptedVaultKey);

    // encrypt private with muk
    const encryptedPrivateKey = encrypt('A256GCM', mukObj.mukObj.k, Buffer.from(privateKey, 'utf8'));
    // const iv = Buffer.alloc(16);
    // crypto.randomFillSync(iv, 0);
    // const cipher = crypto.createCipheriv('aes-256-gcm', mukObj.mukObj.k, iv);
    // const cipherText = Buffer.concat([cipher.update(privateKey), cipher.final()]);
    // const authTag = cipher.getAuthTag();
    // let bufferLength = Buffer.alloc(1);
    // bufferLength.writeUInt8(iv.length, 0)
    // const encryptedPrivateKey = Buffer.concat([bufferLength, iv, authTag, cipherText])

    // SAMPLE DECRYPTION WITH MUK
    // const ivSize = encryptedPrivateKey.readUInt8(0)
    // const testIv = encryptedPrivateKey.slice(1, ivSize + 1);
    // const testAuthTag = encryptedPrivateKey.slice(ivSize + 1, ivSize + 17);
    // const decipher = crypto.createDecipheriv('aes-256-gcm', mukObj.mukObj.k, testIv);
    // decipher.setAuthTag(testAuthTag);
    // let decrypted = Buffer.concat([decipher.update(encryptedPrivateKey.slice(ivSize+17)), decipher.final()]);
    // console.log(decrypted.toString('utf8'));

    // generate srp salt, verifier
    const srpData = {
      srpx: mukObj.srpObj.srpx,
      salt: mukObj.srpObj.salt,
    };

    // return server obj
    const encPriKey = {
      kid: '',
      enc: 'A256GCM',
      cty: 'b5+jwk+json',
      data: encryptedPrivateKey.toString('base64'),
    };
    const encSymKey = {
      kid: 'mp',
      enc: 'A256GCM',
      cty: 'b5+jwk+json',
      data: encryptedVaultKey.toString('base64'),
    };
    const serverData = {
      encPriKey,
      encSymKey,
      encryptedBy: 'mp',
      pubKey: {
        n: publicKey.toString('base64'),
        kty: 'RSA',
        kid: '',
        e: Buffer.from(PUBLIC_EXPONENT.toString()).toString('base64'),
      },
      uuid: '',
    };

    // muk, srp data that doesn't need to be recomputed on signup
    const localEphemeralData = {
      mukObj: mukObj.mukObj,
      srpData,
    };

    const localConfigData = {
      accountId: data.accountId,
      email: data.email,
      salt: userSalt.toString('base64'),
      secretKey: secretKey.toString('base64'),
      cachedData: {
        serverData,
      },
    };

    const serverSrpData = {
      salt: srpData.salt,
      v: mukObj.srpObj.srpv,
    };

    const deviceData = {
      agent: process.versions.electron,
      os: os.type(),
      uuid: uuidv4(),
    };

    // console.log('local ephemeral: ', localEphemeralData);

    return {
      error: false,
      data: {
        deviceData,
        localConfigData,
        localEphemeralData,
        serverData,
        serverSrpData,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      error: true,
      data: {},
    }
  }
};
