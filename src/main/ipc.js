const { app } = require('electron');
const {ipcMain: ipc} = require('electron-better-ipc');
import fs from 'fs';

import userConfig from '../constants/storage';
console.log(userConfig);
ipc.answerRenderer('check-existing-user', async data => {
  // import credentials file
  const userConfigPath = `${app.getPath('userData')}/${userConfig.USER_CONFIG_FILE}`;
  try {
    if (fs.existsSync(userConfigPath)) {
      // TODO: validate that the data file is valid
      return {
        error: false,
        data: {
          exists: true,
          userData: {},
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
