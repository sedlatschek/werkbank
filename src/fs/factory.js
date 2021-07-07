import { v4 as uuid } from 'uuid';
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
} from '@/store/types';

export function createOperation(type, properties) {
  return {
    id: uuid(),
    created: new Date(),
    type,
    source: null,
    dest: null,
    content: null,
    ignore: [],
    attempt: 0,
    lastAttempt: null,
    running: false,
    error: null,
    done: false,
    ...properties,
  };
}

export function createBatch(type, werk) {
  return {
    id: uuid(),
    werkId: werk.id,
    created: new Date(),
    type,
    attempt: 0,
    operations: [],
    done() {
      return this.operations.filter((o) => !o.done).length === 0;
    },
    copyDir(source, dest, ignore = []) {
      const op = createOperation(OP_COPY_DIR, { source, dest, ignore });
      this.operations.push(op);
      return op;
    },
    copyFile(source, dest) {
      const op = createOperation(OP_COPY_FILE, { source, dest });
      this.operations.push(op);
      return op;
    },
    createDir(dest) {
      const op = createOperation(OP_CREATE_DIR, { dest });
      this.operations.push(op);
      return op;
    },
    delete(dest) {
      const op = createOperation(OP_DELETE, { dest });
      this.operations.push(op);
      return op;
    },
    hideDir(dest) {
      const op = createOperation(OP_HIDE_DIR, { dest });
      this.operations.push(op);
      return op;
    },
    move(source, dest) {
      const op = createOperation(OP_MOVE, { source, dest });
      this.operations.push(op);
      return op;
    },
    unzip(source, dest) {
      const op = createOperation(OP_UNZIP, { source, dest });
      this.operations.push(op);
      return op;
    },
    writeFile(dest, content) {
      const op = createOperation(OP_WRITE_FILE, { dest, content });
      this.operations.push(op);
      return op;
    },
    zipDir(source, dest) {
      const op = createOperation(OP_ZIP_DIR, { source, dest });
      this.operations.push(op);
      return op;
    },
    reloadWerk(werkId) {
      const op = createOperation(OP_RELOAD_WERK, { source: werkId });
      this.operations.push(op);
      return op;
    },
  };
}
