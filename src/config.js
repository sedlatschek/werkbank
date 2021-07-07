import { join } from 'path';
import { getAppDataPath } from './util';

export const DIR_APPDATA = join(getAppDataPath(), 'werkbank-next');
export const FILE_STATE = join(DIR_APPDATA, 'werkbank.json');
export const DIR_ICONS = join(DIR_APPDATA, 'icons');

export const WERK_DIR_NAME = '.werk';
export const WERK_FILE_NAME = 'werk.json';
export const WERK_ICON_NAME = 'icon.png';
export const WERK_ICON_MIME = 'data:image/png;base64,';
export const GIT_DIR_NAME = '.git';
export const GIT_ZIP_FILE_NAME = 'git.zip';

export const OP_ATTEMPT_LIMIT = 10;
export const OP_RETRY_TIMEOUT = 30000;
export const QUEUE_INTERVAL = 1000;
