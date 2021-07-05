import AdmZip from 'adm-zip';
import {
  copy,
  ensureFile,
  existsSync,
  mkdirp,
  move,
  remove,
  writeFile,
} from 'fs-extra';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import slugify from 'slugify';
import Vue from 'vue';
import { hideDir } from '@/util';
import {
  GIT_DIR_NAME,
  GIT_ZIP_FILE_NAME,
  OP_ATTEMPT_LIMIT,
  OP_RETRY_TIMEOUT,
  QUEUE_INTERVAL,
  WERK_DIR_NAME,
  WERK_FILE_NAME,
} from '@/config';
import {
  BOOTSTRAP_QUEUE,
  MOVE_BACKUP,
  MOVE_FREEZE,
  MOVE_HEATUP,
  OP_COPY_DIR,
  OP_COPY_FILE,
  OP_CREATE_DIR,
  OP_DELETE,
  OP_HIDE_DIR,
  OP_MOVE,
  OP_UNZIP,
  OP_WRITE_FILE,
  OP_ZIP_DIR,
  RUN_BATCH,
  SET_BATCH,
  SET_BATCH_PROP,
  SET_OPERATION,
  WERK_STATE_COLD,
  WERK_STATE_HOT,
  WORK_QUEUE,
  SET_QUEUE_INTERVAL,
  REMOVE_BATCH,
  OP_RELOAD_WERK,
  RELOAD_WERK,
  MOVE_ARCHIVE,
  WERK_STATE_ARCHIVED,
  MOVE_RETRIEVE,
} from '../types';

async function run(op) {
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

function createOperation(type, properties) {
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

function createBatch(type, werk) {
  return {
    id: uuid(),
    werkId: werk.id,
    created: new Date(),
    type,
    attempts: 0,
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

function backup(store, werk) {
  if (werk.state !== WERK_STATE_HOT) {
    throw new Error('Can not backup. Werk state expected to be "hot"');
  }

  const env = store.getters.environmentByHandle(werk.env);
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

function freeze(store, werk) {
  if (werk.state !== WERK_STATE_HOT) {
    throw new Error('Can not freeze. State expected to be "hot"');
  }

  const env = store.getters.environmentByHandle(werk.env);
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

function heatup(store, werk) {
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

function archive(store, werk) {
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

function retrieve(store, werk) {
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

export default {
  state: {
    queue: [],
    queueInterval: null,
  },
  getters: {
    queue(state) {
      return state.queue;
    },
  },
  mutations: {
    [SET_BATCH](state, batch) {
      const index = state.queue.findIndex((b) => b.id === batch.id);
      if (index === -1) {
        state.queue.push(batch);
      } else {
        Vue.set(state.queue, index, batch);
      }
    },
    [SET_BATCH_PROP](state, { id, key, value }) {
      const index = state.queue.findIndex((batch) => batch.id === id);
      Vue.set(state.queue[index], key, value);
    },
    [REMOVE_BATCH](state, id) {
      const index = state.queue.findIndex((batch) => batch.id === id);
      state.queue.splice(index, 1);
    },
    [SET_OPERATION](state, operation) {
      for (let i = 0; i < state.queue.length; i += 1) {
        const index = state.queue[i].operations.findIndex((o) => o.id === operation.id);
        if (index !== -1) {
          Vue.set(state.queue[i], index, operation);
          break;
        }
      }
    },
    [SET_QUEUE_INTERVAL](state, interval) {
      if (state.queueInterval != null) {
        window.clearInterval(state.queueInterval);
      }
      state.queueInterval = interval;
    },
  },
  actions: {
    [BOOTSTRAP_QUEUE]({ commit, dispatch }) {
      const interval = setInterval(() => {
        dispatch(WORK_QUEUE);
      }, QUEUE_INTERVAL);
      commit(SET_QUEUE_INTERVAL, interval);
    },
    [WORK_QUEUE]({ commit, dispatch, getters }) {
      if (getters.queue.length > 0) {
        // remove finished batches
        const finishedBatches = getters.queue.filter(
          (b) => b.operations.filter((op) => !op.done).length === 0,
        );
        finishedBatches.forEach((b) => commit(REMOVE_BATCH, b.id));
        // find batch with a pending operation
        const batch = getters.queue.find((b) => {
          // get first operation that is not done yet
          const op = b.operations.find((o) => !o.done);
          // check whether it is on timeout/limit
          return op.attempt <= OP_ATTEMPT_LIMIT
            && (!op.lastAttempt
              || (new Date()).getTime() - op.lastAttempt.getTime() >= OP_RETRY_TIMEOUT);
        });
        if (batch) {
          return dispatch(RUN_BATCH, batch);
        }
      }
      return false;
    },
    async [RUN_BATCH]({ commit }, batch) {
      // get first operation that is not done yet
      const op = batch.operations.find((o) => !o.done);
      if (!op) return false;
      // check whether it is on timeout/limit
      if ((op.lastAttempt
        && (new Date()).getTime() - op.lastAttempt.getTime() <= OP_RETRY_TIMEOUT)
        || op.attempt >= OP_ATTEMPT_LIMIT) {
        return false;
      }

      const setBatchProp = (key, value) => commit(SET_BATCH_PROP, { id: batch.id, key, value });
      setBatchProp('running', true);
      try {
        op.running = true;
        op.attempt += 1;
        op.lastAttempt = new Date();
        commit(SET_OPERATION, op);
        await run(op);
        op.done = true;
      } catch (error) {
        op.done = false;
        op.error = error;
      } finally {
        op.running = false;
        commit(SET_OPERATION, op);
        setBatchProp('running', false);
      }
      return true;
    },
    [MOVE_BACKUP](context, werk) {
      context.commit(SET_BATCH, backup(context, werk));
    },
    [MOVE_FREEZE](context, werk) {
      context.commit(SET_BATCH, freeze(context, werk));
    },
    [MOVE_HEATUP](context, werk) {
      context.commit(SET_BATCH, heatup(context, werk));
    },
    [MOVE_ARCHIVE](context, werk) {
      context.commit(SET_BATCH, archive(context, werk));
    },
    [MOVE_RETRIEVE](context, werk) {
      context.commit(SET_BATCH, retrieve(context, werk));
    },
  },
};
