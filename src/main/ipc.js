const { app } = require('electron');
const {ipcMain: ipc} = require('electron-better-ipc');
import fs from 'fs';

import ipcConstants from '../constants/ipc';
import userConfig from '../constants/storage';
import { 
  derivePrivateKeys,
  generateSalt, 
  generateSecretKey,
} from './crypto';
import { generateCredentials } from './ipcHandler';

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
    const accountId = data.accountId;
    console.log(data);

    const privateKeys = derivePrivateKeys(data);
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
    console.log(typeof encodedPrivateKeys.srpObj.srpx);
    console.log(encodedPrivateKeys);
    return {
      error: false,
      data: encodedPrivateKeys,
    };
  } catch (err) {
    console.error('Received error while unlocking: ', err);
    return {
      error: true,
      data: {},
    };
  }
});

ipc.answerRenderer(ipcConstants.GENERATE_CREDENTIALS, async data => {
  const userConfigPath = `${app.getPath('userData')}/${userConfig.USER_CONFIG_FILE}`;
  return generateCredentials(data, userConfigPath);
});

ipc.answerRenderer(ipcConstants.STORE_LOCAL_CONFIG, async data => {
  console.log('attempting to store yo');
});
