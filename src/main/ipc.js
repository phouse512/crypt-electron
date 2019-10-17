const { app } = require('electron');
const crypto = require('crypto');
// const {ipcMain: ipc} = require('electron-better-ipc');
const ipc = require('electron-better-ipc');
import { SHA3 } from 'sha3';
import fs from 'fs';
import fetch from 'node-fetch';

import ipcConstants from '../constants/ipc';
import userConfig from '../constants/storage';
import {
  decrypt,
  derivePrivateKeys,
  encrypt,
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
    // stringify metadata obj
    const metadataStr = JSON.stringify(data.metadata);

    // encrypt metadata
    const metadataBuf = Buffer.from(metadataStr, 'utf-8');
    const mukBuffer = Buffer.from(data.muk.k, 'base64');
    const encryptedMetadata = encrypt(data.muk.alg, mukBuffer, metadataBuf);

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

ipc.answerRenderer(ipcConstants.GET_ENCRYPTED_PHOTO, async data => {
  try {
    // load file into buffer
    const imageBuffer = fs.readFileSync(data.path);

    // use muk data to use different algo
    let encryptedImage;
    const mukBuffer = Buffer.from(data.muk.k, 'base64');
    encryptedImage = encrypt(data.muk.alg, mukBuffer, imageBuffer);

    // checksum image buffer
    const hash = new SHA3(512);
    hash.update(imageBuffer);
    const imageCheckSum = hash.digest('base64');

    // checksum encrypted image
    const encryptedHash = new SHA3(512);
    encryptedHash.update(encryptedImage);
    const encImageCheckSum = encryptedHash.digest('base64');

    // return base64 encoded encrypted buffer
    // return checksum
    return {
      error: false,
      data: {
        image: encryptedImage.toString('base64'),
        originalImageHash: imageCheckSum,
        encImageHash: encImageCheckSum,
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
    // loop through images
    console.log(data);
    const mukBuffer = Buffer.from(data.muk.k, 'base64');
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
      const decImageBuffer = decrypt(data.muk.alg, mukBuffer, encImageBuffer);
      const unencPath = storeUnencImage(decImageBuffer, item.id);
      imageMap[item.id] = {
        imagePath: unencPath,
      };

      // write to unenc dir and 

      // if not download images, unenc, write to 
    }

    return {
      error: false,
      data: {
        image: imageMap,
        cacheHits,
      },
    };
    // download each image 

    // send event    
  } catch (error) {
    console.error('unable to load photos: ', err);
    return {
      error: true,
      data: {},
    };
  }
});
