import { homedir, platform } from 'os';
import { join } from 'path';

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
