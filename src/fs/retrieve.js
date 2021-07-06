import { join } from 'path';
import slugify from 'slugify';
import { WERK_DIR_NAME, WERK_FILE_NAME } from '@/config';
import { WERK_STATE_COLD, MOVE_ARCHIVE, WERK_STATE_ARCHIVED } from '@/store/types';
import { createBatch } from './factory';

export default function (store, werk) {
  if (werk.state !== WERK_STATE_ARCHIVED) {
    throw new Error('Can not retrieve. Werk state expected to be "archived"');
  }

  const batch = createBatch(MOVE_ARCHIVE, werk);
  const tmp = { ...werk };

  // determine directory paths
  const coldDir = store.getters.dirFor(werk, WERK_STATE_COLD);
  const coldWerkDir = join(coldDir, WERK_DIR_NAME);
  const coldWerkFile = join(coldWerkDir, WERK_FILE_NAME);
  const archiveDir = store.getters.dirFor(werk, WERK_STATE_ARCHIVED);
  const archiveWerkDir = join(archiveDir, WERK_DIR_NAME);
  const archiveWerkFile = join(archiveWerkDir, WERK_FILE_NAME);

  // mark werk as moving
  tmp.moving = true;
  batch.writeFile(archiveWerkFile, JSON.stringify(tmp));

  // create directory in cold vault
  batch.createDir(coldDir);

  if (werk.compressOnArchive) {
    // move .werk folder into cold vault
    batch.copyDir(archiveWerkDir, coldWerkDir);

    // unzip werk files into cold vault
    const zipFile = `${join(archiveDir, slugify(werk.name))}.zip`;
    batch.unzip(zipFile, coldDir);
  } else {
    // move directory into cold vault
    batch.copyDir(archiveDir, coldDir);
  }

  // delete archive directory
  batch.delete(archiveDir);
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
