import {
  app,
  ipcMain,
  protocol,
  BrowserWindow,
  Menu,
  Tray
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import PersistedState from 'vuex-electron-store';
import { FILE_STATE, FILE_TRAY_ICON } from './config';
import { pathExists, readJson } from 'fs-extra';

const isDevelopment = process.env.NODE_ENV !== 'production';

let tray = null;

PersistedState.initRenderer();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Load last state from disk
  const state = await pathExists(FILE_STATE)
    ? (await readJson(FILE_STATE)).state
    : null;

  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 760,
    minHeight: 300,
    title: 'Werkbank',
    icon: './src/assets/icon/win.ico',
    webPreferences: {
      // Required for Spectron testing
      enableRemoteModule: !!process.env.IS_TEST,

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
    autoHideMenuBar: true,
  });
  // Immediately hide window if minimized launch is configured
  if (state && state.ModuleSettings.settings.launchMinimized) {
    win.hide();
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('minimize', (event) => {
    event.preventDefault();
    win.hide();
  });

  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      win.hide();
      event.returnValue = false;
    }
  });

  return win;
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  const win = await createWindow();

  tray = new Tray(FILE_TRAY_ICON);
  if (process.platform === 'win32') {
    tray.on('click', () => {
      win.show();
    });
  }
  const menu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        win.destroy();
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setToolTip('Werkbank');
  tray.setContextMenu(menu);
});

app.on('before-quit', () => {
  // release tray
  tray = null;
});

// process changes in settings
ipcMain.on('setting-changed', (event, { key, value }) => {
  if (isDevelopment) return;
  if (key === 'launchWithSystem') {
    app.setLoginItemSettings({
      openAtLogin: value,
    });
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
