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
export const SAVE_WERK = 'SAVE_WERK';
