import {
  app,
  dialog,
  ipcMain,
  protocol,
  BrowserWindow,
  Menu,
  Tray,
  shell,
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { autoUpdater } from 'electron-updater';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import PersistedState from 'vuex-electron-store';
import { FILE_STATE, FILE_TRAY_ICON } from './config';
import { pathExists, readJson } from 'fs-extra';

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const TITLE = 'Werkbank';

const top = {
  tray: null,
  win: null,
};

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
    title: TITLE,
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
    autoUpdater.checkForUpdatesAndNotify();
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
  if (process.platform === 'win32')
  {
    // Set the title to be shown on windows for push notifactions.
    // Otherwise the sender 'electron.app.Werkbank' would appear.
    app.setAppUserModelId(TITLE);
  }

  if (IS_DEVELOPMENT && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  if (!app.requestSingleInstanceLock()) {
    // Quit immediately if lock could not be obtained.
    app.isQuitting = true;
    app.quit();
  } else {
    top.win = await createWindow();
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (top.win) {
        if (top.win.isMinimized()) {
          top.win.restore();
        }
        top.win.focus();
      }
    });

    // The method will prevent electron to open external
    // links and will pass them to the default browser instead.
    top.win.webContents.setWindowOpenHandler(({ url }) => {
      setImmediate(() => {
        shell.openExternal(url);
      });
      return { action: 'deny' };
    });

    top.tray = createTray(top.win);
  }
});

function createTray(win, werke = []) {
  const tray = new Tray(FILE_TRAY_ICON);
  if (process.platform === 'win32') {
    tray.on('click', () => {
      win.show();
    });
  }

  const template = [];
  werke.forEach((werk) => template.push({ label: werk.title, click: () => {
    win.webContents.send('open-werk', werk);
  }}));
  if (werke.length > 0) {
    template.push({ type: 'separator' });
  }

  const menu = Menu.buildFromTemplate(template.concat([
    {
      label: 'Create Werk',
      click: () => {
        win.webContents.send('create-werk');
        if (win.isMinimized()) {
          win.restore();
        }
        win.focus();
      },
    },
    {
      label: 'Quit',
      click: () => {
        win.destroy();
        app.isQuitting = true;
        app.quit();
      },
    },
  ]));
  tray.setToolTip(TITLE);
  tray.setContextMenu(menu);
  return tray;
}

app.on('before-quit', () => {
  // release top
  top = null;
});

// process changes in settings
ipcMain.on('setting-changed', (event, { key, value }) => {
  if (IS_DEVELOPMENT) return;
  if (key === 'launchWithSystem') {
    app.setLoginItemSettings({
      openAtLogin: value,
    });
  }
});

ipcMain.on('latest-werke', (event, latestWerke) => {
  top.tray.destroy();
  top.tray = createTray(top.win, latestWerke);
});

['showOpenDialog', 'showSaveDialog', 'showMessageBox'].forEach((d) => {
  ipcMain.on(d, async (event, { index, options }) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const result = await dialog[d](window, options);
    window.send(`${d}Result`, { index, result});
  });
});

['showErrorBox'].forEach((d) => {
  ipcMain.on(d, async (event, { index, title, content }) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const result = await dialog[d](title, content);
    window.send(`${d}Result`, { index, result});
  });
})

// Exit cleanly on request from parent process in development mode.
if (IS_DEVELOPMENT) {
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
