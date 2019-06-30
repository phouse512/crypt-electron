const crypto = require('crypto');

import { 
  derivePrivateKeys,
  generateSalt, 
  generateSecretKey,
} from './crypto';

/*
 * IPC handler for generating credentials.
 * @param: data
 */
export const generateCredentials = (data) => {
  try {
    // assert object

    // generate muk
    const mukObj = derivePrivateKeys({
      accountId: data.accountId,
      email: data.email,
      masterPass: data.masterPass,
      salt: generateSalt(),
      secretKey: generateSecretKey(),
    });

    console.log(mukObj);

    // const ecdh = crypto.createECDH('secp521r1');
    // ecdh.generateKeys();

    // // generate private / public
    // const publicKey = ecdh.getPublicKey();
    // const privateKey = ecdh.getPrivateKey();
    // console.log(publicKey);
    // console.log(privateKey);
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
    console.log(vaultKey);

    // encrypt symmetric with private
    const encryptedVaultKey = crypto.publicEncrypt({
      key: publicKey,
      passphrase: '',
    }, vaultKey);
    console.log(encryptedVaultKey);
    console.log(privateKey);

    // const decryptedVaultKey = crypto.privateDecrypt(privateKey, encryptedVaultKey);
    // console.log(decryptedVaultKey);

    // encrypt private with muk
    const iv = Buffer.alloc(16);
    crypto.randomFillSync(iv, 0);
    const cipher = crypto.createCipheriv('aes-256-gcm', mukObj.mukObj.k, iv);
    let encryptedPrivateKey = cipher.update(privateKey, 'binary', 'base64');
    encryptedPrivateKey += cipher.final('base64');
    console.log(encryptedPrivateKey);

    const decipher = crypto.createDecipheriv('aes-256-gcm', mukObj.mukObj.k, iv);
    let decrypted = decipher.update(encryptedPrivateKey, 'base64', 'hex');
    decrypted += decipher.final('hex')
    console.log(decrypted);

    // generate srp salt, verifier

    // return server obj

    return {
      error: false,
      data: {},
    };
  } catch (err) {
    console.log(err);
    return {
      error: true,
      data: {},
    }
  }
};