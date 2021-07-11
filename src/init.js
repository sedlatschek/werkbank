import { ensureDir, pathExists } from 'fs-extra';
import icon from '@/assets/icon/icon-32x32.png';
import { FILE_TRAY_ICON, DIR_ENV_ICONS, PNG_MIME } from './config';
import { saveBase64 } from './util';

export default async function () {
  await ensureDir(DIR_ENV_ICONS);
  if (!await pathExists(FILE_TRAY_ICON)) {
    await saveBase64(FILE_TRAY_ICON, PNG_MIME, icon);
  }
}
