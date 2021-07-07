import Vue from 'vue';
import {
  run,
  backup,
  freeze,
  heatup,
  archive,
  retrieve,
  trash,
} from '@/fs';
import { OP_ATTEMPT_LIMIT, OP_RETRY_TIMEOUT, QUEUE_INTERVAL } from '@/config';
import {
  BOOTSTRAP_QUEUE,
  CAST_QUEUE_DATES,
  MOVE_BACKUP,
  MOVE_FREEZE,
  MOVE_HEATUP,
  RUN_BATCH,
  SET_BATCH,
  SET_BATCH_PROP,
  SET_OPERATION,
  WORK_QUEUE,
  SET_QUEUE_INTERVAL,
  REMOVE_BATCH,
  MOVE_ARCHIVE,
  MOVE_RETRIEVE,
  MOVE_TRASH,
  SET_WERK_MOVING,
  RESET_OPERATION,
} from '../types';

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
          Vue.set(state.queue[i].operations, index, operation);
          break;
        }
      }
    },
    [RESET_OPERATION](state, id) {
      for (let i = 0; i < state.queue.length; i += 1) {
        const index = state.queue[i].operations.findIndex((o) => o.id === id);
        if (index !== -1) {
          Vue.set(state.queue[i].operations[index], 'error', null);
          Vue.set(state.queue[i].operations[index], 'attempt', 0);
          Vue.set(state.queue[i].operations[index], 'lastAttempt', null);
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
      dispatch(CAST_QUEUE_DATES);
    },
    [CAST_QUEUE_DATES]({ commit, getters }) {
      getters.queue.forEach((batch) => {
        commit(SET_BATCH_PROP, {
          id: batch.id,
          key: 'created',
          value: new Date(batch.created),
        });
        batch.operations.forEach((op) => {
          commit(SET_OPERATION, {
            ...op,
            created: new Date(op.created),
            lastAttempt: op.lastAttempt ? new Date(op.lastAttempt) : null,
          });
        });
      });
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
      setBatchProp('attempt', batch.attempt + 1);
      try {
        op.error = null;
        op.running = true;
        op.attempt += 1;
        op.lastAttempt = new Date();
        commit(SET_OPERATION, op);
        await run(op);
        op.done = true;
      } catch (error) {
        op.done = false;
        op.error = error.message;
      } finally {
        op.running = false;
        commit(SET_OPERATION, op);
        setBatchProp('running', false);
      }
      return true;
    },
    [MOVE_BACKUP](context, werk) {
      context.commit(SET_WERK_MOVING, { id: werk.id, value: true });
      context.commit(SET_BATCH, backup(context, werk));
    },
    [MOVE_FREEZE](context, werk) {
      context.commit(SET_WERK_MOVING, { id: werk.id, value: true });
      context.commit(SET_BATCH, freeze(context, werk));
    },
    [MOVE_HEATUP](context, werk) {
      context.commit(SET_WERK_MOVING, { id: werk.id, value: true });
      context.commit(SET_BATCH, heatup(context, werk));
    },
    [MOVE_ARCHIVE](context, werk) {
      context.commit(SET_WERK_MOVING, { id: werk.id, value: true });
      context.commit(SET_BATCH, archive(context, werk));
    },
    [MOVE_RETRIEVE](context, werk) {
      context.commit(SET_WERK_MOVING, { id: werk.id, value: true });
      context.commit(SET_BATCH, retrieve(context, werk));
    },
    [MOVE_TRASH](context, werk) {
      context.commit(SET_WERK_MOVING, { id: werk.id, value: true });
      context.commit(SET_BATCH, trash(context, werk));
    },
  },
};
