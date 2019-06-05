const { app, BrowserWindow} = require('electron');
require('./ipc');
const path = require('path');
const os = require('os');

let mainWindow;

console.log('STARTING UP');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html')

  BrowserWindow.addDevToolsExtension(
    path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
  );

  // open DevTools.
  mainWindow.webContents.openDevTools()

  // emmitted when window is closed
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// Quit when all windows close
app.on('window-all-closed', function() {
  // on macOs, applications stay active until quit explicitly
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function() {
  // on macos it's common to create a window when the dock icon is clicked
  if (mainWindow === null) createWindow();
});

