import { homedir, platform } from 'os';
import { writeFile } from 'fs-extra';
import { join } from 'path';
import { set } from '@akryum/winattr';

export function getAppDataPath() {
  const curPlatform = platform();
  if (curPlatform.startsWith('win')) {
    // windows
    return join(homedir(), 'AppData', 'Roaming');
  }
  if (curPlatform === 'darwin') {
    // macOS
    return join(homedir(), 'Library', 'Application Support');
  }
  // linux
  return join(homedir(), '.config');
}

export function pad(number) {
  if (number < 10) return `0${number}`;
  return number;
}

export function hideDir(dir) {
  return new Promise((resolve, reject) => {
    if (!platform().startsWith('win')) resolve();
    set(dir, { hidden: true }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export async function saveBase64(file, mime, base64) {
  const s = base64.substr(-1 * (base64.length - mime.length));
  await writeFile(file, s, 'base64');
}
