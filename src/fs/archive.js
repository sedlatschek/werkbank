import { join } from 'path';
import slugify from 'slugify';
import { WERK_DIR_NAME, WERK_FILE_NAME } from '@/config';
import { WERK_STATE_COLD, MOVE_ARCHIVE, WERK_STATE_ARCHIVED } from '@/store/types';
import { createBatch } from './factory';

export default function (store, werk) {
  if (werk.state !== WERK_STATE_COLD) {
    throw new Error('Can not archive. Werk state expected to be "cold"');
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
  batch.writeFile(coldWerkFile, JSON.stringify(tmp));

  // create directory in archive
  batch.createDir(archiveDir);

  if (werk.compressOnArchive) {
    // move .werk folder into archive
    batch.copyDir(coldWerkDir, archiveWerkDir);

    // zip up the rest of the files
    const zipFile = `${join(archiveDir, slugify(werk.name))}.zip`;
    batch.zipDir(coldDir, zipFile);
  } else {
    // move directory into archive
    batch.copyDir(coldDir, archiveDir);
  }

  // delete cold directory
  batch.delete(coldDir);
  batch.hideDir(archiveWerkDir);

  // change state to archived and save
  tmp.moving = false;
  tmp.state = WERK_STATE_ARCHIVED;
  tmp.history.push({ ts: new Date(), state: WERK_STATE_ARCHIVED });
  batch.writeFile(archiveWerkFile, JSON.stringify(tmp));

  // reload werk state
  batch.reloadWerk(werk.id);

  return batch;
}
