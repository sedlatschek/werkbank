export const BOOTSTRAP = 'BOOTSTRAP';

// settings
export const SET_SETTING = 'SET_SETTING';

// environments
export const BOOTSTRAP_ENVIRONMENTS = 'BOOTSTRAP_ENVIRONMENTS';
export const ADD_ENVIRONMENTS = 'ADD_ENVIRONMENTS';
export const CLEAR_ENVIRONMENTS = 'CLEAR_ENVIRONMENTS';

// werke
export const BOOTSTRAP_WERKE = 'BOOTSTRAP_WERKE';
export const GATHER_WERKE = 'GATHER_WERKE';
export const SET_GATHERING_WERKE = 'SET_GATHERING_WERKE';
export const SET_GATHERING_WERKE_PROGRESS = 'SET_GATHERING_WERKE_PROGRESS';
export const WERK_STATE_HOT = 0;
export const WERK_STATE_COLD = 1;
export const WERK_STATE_ARCHIVED = 2;
export const WERK_STATE = {
  [WERK_STATE_HOT]: 'Hot',
  [WERK_STATE_COLD]: 'Cold',
  [WERK_STATE_ARCHIVED]: 'Archived',
};
export const ADD_WERK = 'ADD_WERK';
export const SET_WERK = 'SET_WERK';
export const REMOVE_WERK = 'REMOVE_WERK';
export const RELOAD_WERK = 'RELOAD_WERK';
export const SAVE_WERK = 'SAVE_WERK';
export const OPEN_WERK_FOLDER = 'OPEN_WERK_FOLDER';

// operations
export const OP_COPY_FILE = 'OP_COPY_FILE';
export const OP_MOVE_FILE = 'OP_MOVE_FILE';
export const OP_WRITE_FILE = 'OP_WRITE_FILE';
export const OP_CREATE_DIR = 'OP_CREATE_DIR';
export const OP_DELETE = 'OP_DELETE';
export const OP_COPY_DIR = 'OP_COPY_DIR';
export const OP_MOVE = 'OP_MOVE';
export const OP_HIDE_DIR = 'OP_HIDE_DIR';
export const OP_ZIP_DIR = 'OP_ZIP_DIR';
export const OP_UNZIP = 'OP_UNZIP';
export const OP_RELOAD_WERK = 'OP_RELOAD_WERK';
export const SET_OPERATION = 'SET_OPERATION';

// moves
export const MOVE_FREEZE = 'MOVE_FREEZE';
export const MOVE_BACKUP = 'MOVE_BACKUP';
export const MOVE_HEATUP = 'MOVE_HEATUP';
export const MOVE_ARCHIVE = 'MOVE_ARCHIVE';
export const MOVE_RETRIEVE = 'MOVE_RETRIEVE';
export const MOVE_TRASH = 'MOVE_TRASH';

// queue
export const BOOTSTRAP_QUEUE = 'BOOTSTRAP_QUEUE';
export const WORK_QUEUE = 'WORK_QUEUE';
export const RUN_BATCH = 'RUN_BATCH';
export const SET_BATCH = 'SET_BATCH';
export const SET_BATCH_PROP = 'SET_BATCH_PROP';
export const REMOVE_BATCH = 'REMOVE_BATCH';
export const SET_QUEUE_INTERVAL = 'SET_QUEUE_INTERVAL';
