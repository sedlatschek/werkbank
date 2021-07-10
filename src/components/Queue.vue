<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition">
    <v-card class="rounded-0">
      <v-toolbar
        dark
        color="primary">
        <v-btn
          icon
          dark
          @click.stop="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Queue</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="queue"
              :expanded.sync="expanded"
              show-expand
              item-key="id">
              <template v-slot:top>
                <v-toolbar flat>
                  <table-title
                    label="Queue"
                    icon="tray-full"/>
                  <v-spacer/>
                </v-toolbar>
              </template>
              <template v-slot:expanded-item="{ item }">
                <td
                  style="padding: 0"
                  :colspan="operationHeader.length">
                  <v-data-table
                    dense
                    hide-default-footer
                    :headers="operationHeader"
                    :items="item.operations"
                    item-key="id">
                    <template v-slot:item.status="{ item }">
                      <v-chip
                        v-if="item.running"
                        color="accent"
                        dark>
                        Running
                      </v-chip>
                      <v-chip
                        v-else-if="item.done"
                        color="success"
                        dark>
                        Done
                      </v-chip>
                      <v-chip
                        v-else-if="item.error"
                        color="error"
                        dark>
                        Error
                      </v-chip>
                      <v-chip v-else>
                        Pending
                      </v-chip>
                    </template>
                    <template v-slot:item.lastAttempt="{ item }">
                      <span class="text-no-wrap">{{ item.lastAttempt | prettyDate }}</span>
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-icon
                        v-if="item.error"
                        title="Reset Operation"
                        small
                        @click.stop="$store.commit(RESET_OPERATION, item.id)">
                        mdi-reload
                      </v-icon>
                    </template>
                  </v-data-table>
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { RESET_OPERATION } from '@/store/types';
import dateUtil from '@/mixins/dateUtil';
import TableTitle from './TableTitle.vue';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TableTitle,
  },
  mixins: [dateUtil],
  computed: {
    ...mapGetters([
      'queue',
    ]),
  },
  data() {
    return {
      headers: [{
        text: 'ID',
        value: 'id',
        sortable: false,
      }, {
        text: 'Type',
        value: 'type',
        sortable: false,
      }, {
        text: 'Attempts',
        value: 'attempt',
        sortable: false,
      }],
      operationHeader: [{
        text: 'ID',
        value: 'id',
        sortable: false,
      }, {
        text: 'Status',
        value: 'status',
        align: 'center',
        sortable: false,
        width: 120,
      }, {
        text: 'Type',
        value: 'type',
        align: 'center',
        sortable: false,
      }, {
        text: 'Attempts',
        value: 'attempt',
        align: 'center',
        sortable: false,
      }, {
        text: 'Last Attempt',
        value: 'lastAttempt',
        align: 'center',
        sortable: false,
      }, {
        text: 'Source',
        value: 'source',
        sortable: false,
      }, {
        text: 'Destination',
        value: 'dest',
        sortable: false,
      }, {
        text: 'Error',
        value: 'error',
        sortable: false,
      }, {
        text: 'Actions',
        value: 'actions',
        align: 'right',
        sortable: false,
        width: 80,
      }],
      expanded: [],
      RESET_OPERATION,
    };
  },
};
</script>
