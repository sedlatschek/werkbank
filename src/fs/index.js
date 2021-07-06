import AdmZip from 'adm-zip';
import {
  copy,
  ensureFile,
  mkdirp,
  move,
  remove,
  writeFile,
} from 'fs-extra';
import { hideDir } from '@/util';
import {
  OP_COPY_DIR,
  OP_COPY_FILE,
  OP_CREATE_DIR,
  OP_DELETE,
  OP_HIDE_DIR,
  OP_MOVE,
  OP_UNZIP,
  OP_WRITE_FILE,
  OP_ZIP_DIR,
  OP_RELOAD_WERK,
  RELOAD_WERK,
} from '@/store/types';

export async function run(op) {
  switch (op.type) {
    case OP_COPY_DIR:
      await remove(op.dest);
      return copy(op.source, op.dest, {
        filter: (path) => !op.ignore.includes(path),
      });
    case OP_COPY_FILE:
      return copy(op.source, op.dest, { overwrite: true });
    case OP_CREATE_DIR:
      return mkdirp(op.dest);
    case OP_DELETE:
      return remove(op.dest);
    case OP_HIDE_DIR:
      return hideDir(op.dest);
    case OP_MOVE:
      await remove(op.dest);
      return move(op.source, op.dest, { overwrite: true });
    case OP_UNZIP:
      await remove(op.dest);
      return new Promise((resolve, reject) => {
        const zip = new AdmZip(op.source);
        zip.extractAllToAsync(op.dest, true, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    case OP_WRITE_FILE:
      await ensureFile(op.dest);
      return writeFile(op.dest, op.content, { overwrite: true });
    case OP_ZIP_DIR:
      await ensureFile(op.dest);
      await remove(op.dest);
      return new Promise((resolve, reject) => {
        const zip = new AdmZip();
        zip.addLocalFolder(op.source);
        zip.writeZip(op.dest, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    case OP_RELOAD_WERK:
      return window.app.$store.dispatch(RELOAD_WERK, op.source);
    default:
      throw new Error(`Invalid operation type ${op.type}`);
  }
}

export { default as backup } from './backup';
export { default as freeze } from './freeze';
export { default as heatup } from './heatup';
export { default as archive } from './archive';
export { default as retrieve } from './retrieve';
export { default as trash } from './trash';
