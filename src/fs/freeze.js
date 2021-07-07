import { existsSync } from 'fs-extra';
import { join } from 'path';
import {
  GIT_DIR_NAME,
  GIT_ZIP_FILE_NAME,
  WERK_DIR_NAME,
  WERK_FILE_NAME,
} from '@/config';
import { MOVE_FREEZE, WERK_STATE_COLD, WERK_STATE_HOT } from '@/store/types';
import { createBatch } from './factory';

export default function (store, werk) {
  if (werk.state !== WERK_STATE_HOT) {
    throw new Error('Can not freeze. State expected to be "hot"');
  }

  const env = store.getters.envByHandle(werk.env);
  const batch = createBatch(MOVE_FREEZE, werk);
  const tmp = { ...werk };
  const { ignore } = env;

  // determine paths
  const hotDir = store.getters.dirFor(werk, WERK_STATE_HOT);
  const hotWerkDir = join(hotDir, WERK_DIR_NAME);
  const hotWerkFile = join(hotWerkDir, WERK_FILE_NAME);
  const coldDir = store.getters.dirFor(werk, WERK_STATE_COLD);
  const coldWerkDir = join(coldDir, WERK_DIR_NAME);
  const coldWerkFile = join(coldWerkDir, WERK_FILE_NAME);

  // mark werk as moving
  tmp.moving = true;
  batch.writeFile(hotWerkFile, JSON.stringify(werk));

  // zip up git
  const gitDir = join(hotDir, GIT_DIR_NAME);
  const gitZip = join(hotDir, GIT_ZIP_FILE_NAME);
  if (existsSync(gitDir)) {
    batch.zipDir(gitDir, gitZip);
    batch.delete(gitDir);
  }

  // clean up cold dir
  batch.delete(coldDir);
  batch.createDir(coldDir);

  // move to cold dir
  batch.copyDir(hotDir, coldDir, ignore);
  batch.delete(hotDir);
  batch.hideDir(coldWerkDir);

  // change state to cold and save
  tmp.moving = false;
  tmp.state = WERK_STATE_COLD;
  tmp.history.push({ ts: new Date(), state: WERK_STATE_COLD });
  batch.writeFile(coldWerkFile, JSON.stringify(tmp));

  // reload werk state
  batch.reloadWerk(werk.id);

  return batch;
}
