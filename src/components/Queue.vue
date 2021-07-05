<template>
  <div>
    <h2>Queue</h2>
    <v-data-table
      :headers="headers"
      :items="queue"
      :expanded.sync="expanded"
      show-expand
      item-key="id">
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
          </v-data-table>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dateUtil from '@/mixins/dateUtil';

export default {
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
        value: 'attempts',
        sortable: false,
      }],
      operationHeader: [{
        text: 'ID',
        value: 'id',
        sortable: false,
      }, {
        text: 'Status',
        value: 'status',
        sortable: false,
      }, {
        text: 'Type',
        value: 'type',
        sortable: false,
      }, {
        text: 'Attempts',
        value: 'attempt',
        sortable: false,
      }, {
        text: 'Last Attempt',
        value: 'lastAttempt',
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
      }],
      expanded: [],
    };
  },
};
</script>
