const { app } = require('electron');
const crypto = require('crypto');
// const {ipcMain: ipc} = require('electron-better-ipc');
const ipc = require('electron-better-ipc');
import fs from 'fs';

import ipcConstants from '../constants/ipc';
import userConfig from '../constants/storage';
import {
  decrypt,
  derivePrivateKeys,
  generateSalt, 
  generateSecretKey,
} from './crypto';
import { genA, getHAMK, getk, getK, getM, getS, getu } from './srp';
import params from './srpParams'
import { generateCredentials } from './ipcHandler';

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
    console.log('A_buf: ', A_buf.toString('base64'))
    const a_buf = Buffer.from(data.a, 'hex');
    console.log('a_buf: ', a_buf.toString('base64'))
    const B_buf = Buffer.from(data.B, 'hex');
    console.log('B_buf: ', B_buf.toString('base64'))
    const x_buf = Buffer.from(data.x, 'hex');
    const k_buf = Buffer.from(getk(params['2048']), 'hex');
    console.log('k_buf: ', k_buf.toString('base64'));
    const u_buf = Buffer.from(getu(params['2048'], A_buf, B_buf), 'hex');
    console.log('u_buf: ', u_buf.toString('base64'));
    const I_buf = Buffer.from(data.I);
    const s_buf = Buffer.from(data.s, 'base64');
    

    const S = getS(params['2048'], k_buf, x_buf, a_buf, B_buf, u_buf);
    console.log('S: ', Buffer.from(S, 'hex').toString('base64'));
    const K_buf = getK(params['2048'], S);
    console.log('K_buf: ', K_buf.toString('base64'))
    const M = getM(params['2048'], I_buf, s_buf, A_buf, B_buf, K_buf);
    console.log('M: ', M.toString('base64'));
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
    }
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
