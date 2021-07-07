import { existsSync } from 'fs-extra';
import { join } from 'path';
import { GIT_DIR_NAME, GIT_ZIP_FILE_NAME, WERK_DIR_NAME } from '@/config';
import { MOVE_BACKUP, WERK_STATE_COLD, WERK_STATE_HOT } from '@/store/types';
import { createBatch } from './factory';

export default function (store, werk) {
  if (werk.state !== WERK_STATE_HOT) {
    throw new Error('Can not backup. Werk state expected to be "hot"');
  }

  const env = store.getters.envByHandle(werk.env);
  const batch = createBatch(MOVE_BACKUP, werk);
  const { ignore } = env;

  // determine directory paths
  const hotDir = store.getters.dirFor(werk, WERK_STATE_HOT);
  const hotWerkDir = join(hotDir, WERK_DIR_NAME);
  const coldDir = store.getters.dirFor(werk, WERK_STATE_COLD);

  // add .werk directory to ignore
  ignore.push(hotWerkDir);

  // recreate directory in cold dir
  batch.delete(coldDir);
  batch.createDir(coldDir);

  // dont copy git dir
  const gitDir = join(hotDir, GIT_DIR_NAME);
  if (existsSync(gitDir)) {
    ignore.push(gitDir);
  }

  // copy directories that are not ignore ed
  batch.copyDir(hotDir, coldDir, ignore);

  // zip up git dir and save file into cold dir
  const gitZip = join(coldDir, GIT_ZIP_FILE_NAME);
  if (existsSync(gitDir)) {
    batch.zipDir(gitDir, gitZip);
  }

  return batch;
}
