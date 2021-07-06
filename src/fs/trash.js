import { join } from 'path';
import { WERK_DIR_NAME, WERK_FILE_NAME } from '@/config';
import { MOVE_TRASH } from '@/store/types';
import { createBatch } from './factory';

export default function (store, werk) {
  const batch = createBatch(MOVE_TRASH, werk);
  const tmp = { ...werk };

  // determine directory paths
  const dir = store.getters.dirFor(werk);
  const werkDir = join(dir, WERK_DIR_NAME);
  const werkFile = join(werkDir, WERK_FILE_NAME);

  // mark werk as moving
  tmp.moving = true;
  batch.writeFile(werkFile, JSON.stringify(tmp));

  // delete directory
  batch.delete(dir);

  // reload werk state to trigger deletion
  batch.reloadWerk(werk.id);

  return batch;
}
