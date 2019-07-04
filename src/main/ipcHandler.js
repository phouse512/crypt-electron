const crypto = require('crypto');
import fs from 'fs';

import { 
  derivePrivateKeys,
  generateSalt, 
  generateSecretKey,
} from './crypto';
import userConfig from '../constants/storage';
import { fstat } from 'fs';

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
      publicExponent: 65537,
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
    const iv = Buffer.alloc(16);
    crypto.randomFillSync(iv, 0);
    const cipher = crypto.createCipheriv('aes-256-gcm', mukObj.mukObj.k, iv);
    const cipherText = Buffer.concat([cipher.update(privateKey), cipher.final()]);
    const authTag = cipher.getAuthTag();
    let bufferLength = Buffer.alloc(1);
    bufferLength.writeUInt8(iv.length, 0)
    const encryptedPrivateKey = Buffer.concat([bufferLength, iv, authTag, cipherText])

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
      kid: 1,
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
      pubKey: publicKey.toString('base64'),
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

    return {
      error: false,
      data: {
        localConfigData,
        localEphemeralData,
        serverData,
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