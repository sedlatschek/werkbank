import { existsSync } from 'fs-extra';
import { join } from 'path';
import {
  GIT_DIR_NAME,
  GIT_ZIP_FILE_NAME,
  WERK_DIR_NAME,
  WERK_FILE_NAME,
} from '@/config';
import { MOVE_HEATUP, WERK_STATE_COLD, WERK_STATE_HOT } from '@/store/types';
import { createBatch } from './factory';

export default function (store, werk) {
  if (werk.state !== WERK_STATE_COLD) {
    throw new Error('Can not heatup. Werk state expected to be "cold"');
  }

  const batch = createBatch(MOVE_HEATUP, werk);
  const tmp = { ...werk };

  // determine directory paths
  const hotDir = store.getters.dirFor(werk, WERK_STATE_HOT);
  const hotWerkDir = join(hotDir, WERK_DIR_NAME);
  const hotWerkFile = join(hotWerkDir, WERK_FILE_NAME);
  const coldDir = store.getters.dirFor(werk, WERK_STATE_COLD);
  const coldWerkDir = join(coldDir, WERK_DIR_NAME);
  const coldWerkFile = join(coldWerkDir, WERK_FILE_NAME);

  // mark werk as moving
  tmp.moving = true;
  batch.writeFile(coldWerkFile, JSON.stringify(tmp));

  // move to hot dir
  batch.copyDir(coldDir, hotDir);
  batch.delete(coldDir);
  batch.hideDir(hotWerkDir);

  // unzip git
  const hotGitFile = join(hotDir, GIT_ZIP_FILE_NAME);
  const coldGitFile = join(coldDir, GIT_ZIP_FILE_NAME);
  const gitDir = join(hotDir, GIT_DIR_NAME);
  if (existsSync(coldGitFile)) {
    batch.createDir(gitDir);
    batch.unzip(hotGitFile, gitDir);
    batch.hideDir(gitDir);
    batch.delete(hotGitFile);
  }

  // change state to hot and save
  tmp.moving = false;
  tmp.state = WERK_STATE_HOT;
  tmp.history.push({ ts: new Date(), state: WERK_STATE_HOT });
  batch.writeFile(hotWerkFile, JSON.stringify(tmp));

  // reload werk state
  batch.reloadWerk(werk.id);

  return batch;
}
