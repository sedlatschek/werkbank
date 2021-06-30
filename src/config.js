import { join } from 'path';
import { getAppDataPath } from './util';

export const DIR_APPDATA = join(getAppDataPath(), 'werkbank-next');
export const FILE_STATE = join(DIR_APPDATA, 'werkbank.json');

export const WERK_DIR_NAME = '.werk';
export const WERK_FILE_NAME = 'werk.json';
export const WERK_ICON_NAME = 'icon.png';
