const {ipcMain: ipc} = require('electron-better-ipc');

ipc.answerRenderer('check-existing-user', async data => {
  console.log('Received data: ', data);
  return {
    name: 'Philip',
    username: 'phouse',
  };
});
