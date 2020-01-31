const { app } = require('electron');
const crypto = require('crypto');
// const {ipcMain: ipc} = require('electron-better-ipc');
const ipc = require('electron-better-ipc');
import { SHA3 } from 'sha3';
import fs from 'fs';
import fetch from 'node-fetch';
const ExifImage = require('exif').ExifImage;
import moment from 'moment';

import ipcConstants from '../constants/ipc';
import userConfig from '../constants/storage';
import {
  decrypt,
  derivePrivateKeys,
  encrypt,
  generateAES256KeySet,
  generateSalt, 
  generateSecretKey,
} from './crypto';
import { genA, getHAMK, getk, getK, getM, getS, getu } from './srp';
import params from './srpParams'
import { generateCredentials } from './ipcHandler';

import {
  getImagePath,
  imageExists,
  storeEncImage,
  storeUnencImage,
} from './storage';

ipc.answerRenderer(ipcConstants.DEBUG_SRP, async data => {
  // get output path
  try {
    const currentTime = (new Date).getTime();
    const outputPath = `${app.getPath('userData')}/srp_log_${currentTime}.json`;

    const outputObj = Object.assign({}, data);
    fs.writeFileSync(outputPath, JSON.stringify(outputObj));
    return {
      error: false,
      data: {
        filepath: outputPath,
      },
    };
  } catch (error) {
    console.error("Received error: ", error)
    return {
      error: true,
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.CHECK_EXISTING_USER, async data => {
  // import credentials file
  const userConfigPath = `${app.getPath('userData')}/${userConfig.USER_CONFIG_FILE}`;
  try {
    if (fs.existsSync(userConfigPath)) {
      // TODO: validate that the data file is valid
      let rawData = fs.readFileSync(userConfigPath);
      let jsonData = JSON.parse(rawData);
      console.log(jsonData);
      return {
        error: false,
        data: {
          exists: true,
          userData: jsonData,
        },
      };
    } else {
      return {
        error: false,
        data: {
          exists: false,
          userData: {},
        },
      };
    }
  } catch(err) {
    console.error(err);
    return {
      error: true,
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.UNLOCK_USER_CREDENTIALS, async data => {
  try {
    // verify that all correct data is there
    console.log(data.credData);
    const params = Object.assign({}, data.credData, {
      salt: Buffer.from(data.credData.salt, 'base64'),
    });

    const privateKeys = derivePrivateKeys(params);
    const encodedPrivateKeys = Object.assign({}, privateKeys, {
      mukObj: {
        ...privateKeys.mukObj,
        k: privateKeys.mukObj.k.toString('base64'),
      },
      srpObj: {
        ...privateKeys.srpObj,
        salt: privateKeys.srpObj.salt.toString('base64'),
        srpx: privateKeys.srpObj.srpx.toString('base64'),
      },
    });

    // attempt to decrypt private keys
    try {
      const result = decrypt(
        data.serverData.encPriKey.enc,
        privateKeys.mukObj.k,
        Buffer.from(data.serverData.encPriKey.data, 'base64'),
      );
      return {
        error: false,
        data: encodedPrivateKeys,
      }
    } catch (error) {
      console.log(error);
      console.log('BAD MUK');
      return {
        error: true,
        message: 'bad muk',
        data: {},
      };
    }
  } catch (err) {
    console.error('Received error while unlocking: ', err);
    return {
      error: true,
      message: 'unable to unlock',
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.GENERATE_CREDENTIALS, async data => {
  return generateCredentials(data);
});

ipc.answerRenderer(ipcConstants.STORE_LOCAL_CONFIG, async data => {
  try {
    // write local to json
    const userConfigPath = `${app.getPath('userData')}/${userConfig.USER_CONFIG_FILE}`;
    fs.writeFileSync(userConfigPath, JSON.stringify(data.localConfigData));
    return {
      error: false,
      data: {},
    };
  } catch (err) {
    console.error('Unable to write config to disk.', err);
    return {
      error: true,
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.SRP_GET_A, async data => {
  try {
    const aBuf = Buffer.alloc(32);
    crypto.randomFillSync(aBuf, 0, 32);

    const aHex = genA(params['2048'], aBuf);
    // console.log('SRP GET A A Hex: ', aHex);
    return {
      error: false,
      data: {
        A: aHex,
        a: aBuf.toString('hex'),
      },
    };
  } catch (err) {
    console.error('Unable to get random A value.', err);
    return {
      error: true,
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.SRP_GET_M, async data => {
  try {
    // data has A, B, a, x
    const A_buf = Buffer.from(data.A, 'hex');
    // console.log('A_buf: ', A_buf.toString('base64'))
    const a_buf = Buffer.from(data.a, 'hex');
    // console.log('a_buf: ', a_buf.toString('base64'))
    const B_buf = Buffer.from(data.B, 'hex');
    // console.log('B_buf: ', B_buf.toString('base64'))
    const x_buf = Buffer.from(data.x, 'hex');
    const k_buf = Buffer.from(getk(params['2048']), 'hex');
    // console.log('k_buf: ', k_buf.toString('base64'));
    const u_buf = Buffer.from(getu(params['2048'], A_buf, B_buf), 'hex');
    // console.log('u_buf: ', u_buf.toString('base64'));
    const I_buf = Buffer.from(data.I);
    const s_buf = Buffer.from(data.s, 'base64');
    

    const S = getS(params['2048'], k_buf, x_buf, a_buf, B_buf, u_buf);
    // console.log('S: ', Buffer.from(S, 'hex').toString('base64'));
    const K_buf = getK(params['2048'], S);
    // console.log('K_buf: ', K_buf.toString('base64'))
    const M = getM(params['2048'], I_buf, s_buf, A_buf, B_buf, K_buf);
    // console.log('M: ', M.toString('base64'));
    return {
      error: false,
      data: {
        K: K_buf.toString('hex'),
        M: M.toString('hex'),
      },
    };
  } catch (err) {
    console.error('Unable to get K values: ', err);
    return {
      error: true,
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.SRP_VALIDATE_HAMK, async data => {
  try {
    const A_buf = Buffer.from(data.A, 'hex');
    const M_buf = Buffer.from(data.M, 'hex');
    const K_buf = Buffer.from(data.K, 'hex');
    const server_HAMK = Buffer.from(data.HAMK, 'hex');

    const H_AMK_buf = getHAMK(params['2048'], A_buf, M_buf, K_buf);
    if (H_AMK_buf.equals(server_HAMK)) {
      return {
        error: false,
        data: {},
        message: 'Valid server credentials.',
      };
    } else {
      return {
        error: true,
        data: {},
        message: 'Invalid server credentials.',
      };
    }
  } catch (err) {
    console.error('Unable to validate HAMK ', err);
    return {
      error: true,
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.GET_ENCRYPTED_METADATA, async data => {
  try {
    const mukBuffer = Buffer.from(data.muk.k, 'base64');
    // stringify metadata obj
    const metadataStr = JSON.stringify(data.metadata);
    const decVaultKey = decrypt(
      data.muk.alg,
      mukBuffer,
      Buffer.from(data.album.encrypted_vault_key, 'base64'),
    );

    const vaultKeyset = JSON.parse(decVaultKey.toString('utf-8'));
    const vaultKeyBuf = Buffer.from(vaultKeyset.k, 'base64');
  
    // encrypt metadata
    const metadataBuf = Buffer.from(metadataStr, 'utf-8');
    const encryptedMetadata = encrypt(vaultKeyset.alg, vaultKeyBuf, metadataBuf);

    // checksum encrypted metadata
    const hash = new SHA3(512);
    hash.update(encryptedMetadata);
    const metadataCheckSum = hash.digest('base64');

    return {
      error: false,
      data: {
        metadata: encryptedMetadata.toString('base64'),
        metadataHash: metadataCheckSum,
      }
    }

  } catch (error) {
    console.error('Unable to encrypt metadata: ', err);
    return {
      error: true,
      data: {},
    };
  }
});

const getExifData = (filePath) => {
  return new Promise((resolve, reject) => {
    ExifImage({ image: filePath }, (error, exifData) => {
      if (error) {
        reject(error);
      } else {
        resolve(exifData);
      }
    });
  });
};

ipc.answerRenderer(ipcConstants.GET_PHOTO_DATA, async data => {
  try {
    if (data.type === 'image/jpeg') {
      const exifData = await getExifData(data.path);
      const exifResp = {
        error: false,
        data: {
          imagePath: data.path,
          metadata: [
            {
              key: 'Device',
              value: `${exifData.image.Make} ${exifData.image.Model}`
            },
            {
              key: 'Width',
              value: exifData.exif.ExifImageWidth,
            },
            {
              key: 'Height',
              value: exifData.exif.ExifImageHeight,
            },
            {
              key: 'Timestamp',
              value: moment(
                exifData.exif.DateTimeOriginal,
                'YYYY:MM:DD HH:mm:ss',
              ).unix(),
            },
          ],
        },
      };

      return exifResp;
    } else {
      console.log('unknown image type');
      return {
        error: false,
        data: {
          imagePath: data.path,
          metadata: {}
        }
      }
    }
  } catch (error) {
    console.error('error: ', error);
    return {
      error: true,
      data: {},
    };
  }
})

ipc.answerRenderer(ipcConstants.GET_ENCRYPTED_PHOTO, async data => {
  try {
    const imageBuffer = fs.readFileSync(data.path);
    const mukBuffer = Buffer.from(data.muk.k, 'base64');

    const decVaultKey = decrypt(
      data.muk.alg,
      mukBuffer,
      Buffer.from(data.album.encrypted_vault_key, 'base64'),
    );

    const vaultKeyset = JSON.parse(decVaultKey.toString('utf-8'));
    const vaultKeyBuf = Buffer.from(vaultKeyset.k, 'base64');
  
    // checksum raw photo
    const hash = new SHA3(512);
    hash.update(imageBuffer);
    const rawImageChecksum = hash.digest('base64');

    // encrypt photo
    const encryptedPhoto = encrypt(vaultKeyset.alg, vaultKeyBuf, imageBuffer);

    // checksum encrypted photo
    const encryptedHash = new SHA3(512);
    encryptedHash.update(encryptedPhoto);
    const encImageChecksum = encryptedHash.digest('base64');

    // return base64 encoded encrypted buffer
    // return checksum
    return {
      error: false,
      data: {
        image: encryptedPhoto.toString('base64'),
        originalImageHash: rawImageChecksum,
        encImageHash: encImageChecksum,
      },
    };
  } catch (err) {
    console.error('Unable to encrypt photo: ', err);
    return {
      error: true,
      data: {},
    }
  }
});

ipc.answerRenderer(ipcConstants.LOAD_ENCRYPTED_PHOTOS, async data => {
  try {
    // get muk
    const mukBuffer = Buffer.from(data.muk.k, 'base64');

    // decrypt vault keys, build keymap album id -> key
    const albumKeyMap = {};
    for (var i=0; i < data.albums.length; i++) {
      const album = data.albums[i];
      const decVaultKey = decrypt(
        data.muk.alg,
        mukBuffer,
        Buffer.from(album.encrypted_vault_key, 'base64'),
      );

      const vaultKeyset = JSON.parse(decVaultKey.toString('utf-8'));
      const vaultKeyBuf = Buffer.from(vaultKeyset.k, 'base64');
      albumKeyMap[album.id] = Object.assign({}, vaultKeyset, {
        vaultKeyBuf,
      });
    }

    const imageMap = {};
    let cacheHits = 0;
    for (var i=0; i < data.items.length; i++) {
      const item = data.items[i];
      // check if image exists in unenc cache
      const exists = imageExists(item.id);
      let encImageBuffer;
      if (!exists) {
        // download image (and save)
        encImageBuffer = await fetch(item.signed_url)
          .then(res => res.buffer())
        storeEncImage(encImageBuffer, item.id);
      } else {
        // load encrypted image
        encImageBuffer = fs.readFileSync(getImagePath(item.id));
        cacheHits += 1;
      }

      // unencrypt buffer
      const albumKeyObj = albumKeyMap[item.album_id];
      const decImageBuffer = decrypt(
        albumKeyObj.alg,
        albumKeyObj.vaultKeyBuf,
        encImageBuffer,
      );
      const unencPath = storeUnencImage(decImageBuffer, item.id);
      imageMap[item.id] = {
        itemPath: unencPath,
      };
    }

    return {
      error: false,
      data: {
        items: imageMap,
        cacheHits,
      },
    };  
  } catch (error) {
    console.error('unable to load photos: ', err);
    return {
      error: true,
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.CREATE_ALBUM, async data => {
  try {
    const mukBuffer = Buffer.from(data.muk.k, 'base64');

    // generate aes vault key // CREATE KEYSET
    const newKeyset = generateAES256KeySet();
    const keysetJson = JSON.stringify(newKeyset)

    // encrypt with muk
    const encryptedVaultKey = encrypt(
      data.muk.alg, 
      mukBuffer,
      Buffer.from(keysetJson, 'utf-8'),
    );

    // return encrypted vault key, encrypted name/desc
    const vaultKeyBuf = Buffer.from(newKeyset.k, 'base64');
    const encName = encrypt(newKeyset.alg, vaultKeyBuf, Buffer.from(data.name, 'utf-8'));
    const encDesc = encrypt(newKeyset.alg, vaultKeyBuf, Buffer.from(data.description, 'utf-8'));

    return {
      error: false,
      data: {
        encryptedVaultKey: encryptedVaultKey.toString('base64'),
        encryptedName: encName.toString('base64'),
        encryptedDescription: encDesc.toString('base64'),
      },
    };
  } catch (error) {
    console.error('unable to create album: ', error);
    return {
      error: true,
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.DECRYPT_ALBUM_DETAILS, async data => {
  try {
    const mukBuffer = Buffer.from(data.muk.k, 'base64');
    const albumMap = {};
    // loop through albums
    for (var i=0; i < data.albums.length; i++) {
      // decrypt encrypted vault key
      const album = data.albums[i];
      const decVaultKey = decrypt(
        data.muk.alg, 
        mukBuffer, 
        Buffer.from(album.encrypted_vault_key, 'base64'),
      );
      
      const vaultKeyset = JSON.parse(decVaultKey.toString('utf-8'));
      const vaultKeyBuf = Buffer.from(vaultKeyset.k, 'base64');
      const decName = decrypt(
        vaultKeyset.alg,
        vaultKeyBuf,
        Buffer.from(album.name, 'base64'),
      ).toString('utf-8');
      const decDesc = decrypt(
        vaultKeyset.alg,
        vaultKeyBuf,
        Buffer.from(album.description, 'base64'),
      ).toString('utf-8');
      // decrypt name / desc with vault key

      albumMap[album.id] = {
        decryptedName: decName,
        decryptedDesc: decDesc,
      };
    }
    return {
      error: false,
      data: {
        albumMap,
      },
    };
  } catch (error) {
    console.error('unable to decrypt albums: ', error);
    return {
      error: true,
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.DECRYPT_ITEM_METADATA, async data => {
  try {
    // get muk from data
    const mukBuffer = Buffer.from(data.muk.k, 'base64');
    // get all album encrypted vault keys

    // decrypt vault keys, build keymap album id -> key
    const albumKeyMap = {};
    for (var i=0; i < data.albums.length; i++) {
      const album = data.albums[i];
      const decVaultKey = decrypt(
        data.muk.alg,
        mukBuffer,
        Buffer.from(album.encrypted_vault_key, 'base64'),
      );

      const vaultKeyset = JSON.parse(decVaultKey.toString('utf-8'));
      const vaultKeyBuf = Buffer.from(vaultKeyset.k, 'base64');
      albumKeyMap[album.id] = Object.assign({}, vaultKeyset, {
        vaultKeyBuf,
      });
    }

    // for each item, decrypt and add to map
    const itemMap = {};
    for (var i=0; i < data.items.length; i++) {
      const item = data.items[i];
      if (!item.metadata) {
        itemMap[item.id] = { decryptedMetadata: null };
        continue;
      }

      const albumKeyObj = albumKeyMap[item.album_id];
      const decryptedMetadata = decrypt(
        albumKeyObj.alg,
        albumKeyObj.vaultKeyBuf,
        Buffer.from(item.metadata, 'base64'),
      ).toString('utf-8');

      itemMap[item.id] = {
        decryptedMetadata: JSON.parse(decryptedMetadata),
      };
    }

    return {
      error: false,
      data: {
        itemMap,
      },
    };
  } catch (error) {
    console.error('unable to decrypt item metadata: ', error);
    return {
      error: true,
      data: {},
    };
  }
});
