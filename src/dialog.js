import { ipcRenderer } from 'electron';

const resolves = {};
let lastIndex = 1;

const funcs = [
  'showOpenDialog',
  'showSaveDialog',
  'showMessageBox',
  'showErrorBox',
];

funcs.forEach((on) => {
  ipcRenderer.on(`${on}Result`, (event, { index, result }) => {
    const tmp = { ...result };
    if (!tmp.cancelled) {
      tmp.cancelled = tmp.canceled;
      delete tmp.canceled;
    }
    if (resolves[index]) {
      resolves[index](tmp);
      delete resolves[index];
    }
  });
});

function create(name, options) {
  lastIndex += 1;
  const index = lastIndex;
  ipcRenderer.send(name, { index, ...options });
  const promise = new Promise((res) => {
    resolves[index] = res;
  });
  return promise;
}

export function showOpenDialog(options = {}) {
  return create('showOpenDialog', { options });
}

export function showSaveDialog(options = {}) {
  return create('showSaveDialog', { options });
}

export function showMessageBox(options = {}) {
  return create('showMessageBox', { options });
}

export function showErrorBox(title, content) {
  return create('showErrorBox', { title, content });
}
