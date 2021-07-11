export const BOOTSTRAP = 'BOOTSTRAP';

// app
export const BOOTSTRAP_APP = 'BOOTSTRAP_APP';
export const SET_LAST_USED_VERSION = 'SET_LAST_USED_VERSION';
export const SET_OPEN_WITH_CHANGELOG = 'SET_OPEN_WITH_CHANGELOG';

// settings
export const SET_SETTING = 'SET_SETTING';

// environments
export const BOOTSTRAP_ENVIRONMENTS = 'BOOTSTRAP_ENVIRONMENTS';
export const SET_ENVIRONMENT = 'SET_ENVIRONMENT';
export const REMOVE_ENVIRONMENT = 'REMOVE_ENVIRONMENT';
export const GATHER_ENVIRONMENTS = 'GATHER_ENVIRONMENTS';

// werke
export const BOOTSTRAP_WERKE = 'BOOTSTRAP_WERKE';
export const GATHER_ALL_WERKE = 'GATHER_ALL_WERKE';
export const GATHER_WERKE = 'GATHER_WERKE';
export const SET_GATHERING_WERKE = 'SET_GATHERING_WERKE';
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
export const SET_WERK_MOVING = 'SET_WERK_MOVING';
export const REMOVE_WERK = 'REMOVE_WERK';
export const RELOAD_WERK = 'RELOAD_WERK';
export const LOAD_WERK_IN = 'LOAD_WERK_IN';
export const SAVE_WERK = 'SAVE_WERK';
export const OPEN_WERK_FOLDER = 'OPEN_WERK_FOLDER';
export const PARSE_DIR = 'PARSE_DIR';
export const PARSE_DIRS = 'PARSE_DIRS';
export const SET_WERK_SEARCH = 'SET_WERK_SEARCH';

// icons
export const SET_ICON = 'SET_ICON';
export const REMOVE_ICON = 'REMOVE_ICON';

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
export const RESET_OPERATION = 'RESET_OPERATION';

// moves
export const MOVE_FREEZE = 'MOVE_FREEZE';
export const MOVE_BACKUP = 'MOVE_BACKUP';
export const MOVE_HEATUP = 'MOVE_HEATUP';
export const MOVE_ARCHIVE = 'MOVE_ARCHIVE';
export const MOVE_RETRIEVE = 'MOVE_RETRIEVE';
export const MOVE_TRASH = 'MOVE_TRASH';

// queue
export const BOOTSTRAP_QUEUE = 'BOOTSTRAP_QUEUE';
export const CAST_QUEUE_DATES = 'CAST_QUEUE_DATES';
export const WORK_QUEUE = 'WORK_QUEUE';
export const RUN_BATCH = 'RUN_BATCH';
export const SET_BATCH = 'SET_BATCH';
export const SET_BATCH_PROP = 'SET_BATCH_PROP';
export const REMOVE_BATCH = 'REMOVE_BATCH';
export const SET_QUEUE_INTERVAL = 'SET_QUEUE_INTERVAL';
