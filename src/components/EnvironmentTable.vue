<template>
  <v-data-table
    :items="environments"
    :headers="headers"
    item-key="handle">
    <template v-slot:top>
      <v-toolbar flat>
        <table-title
          label="Environments"
          icon="iframe-outline"/>
        <v-spacer/>
        <v-btn
          title="Import Environments"
          :disabled="disabled"
          class="mb-2 mx-1"
          @click.stop="$emit('import-envs')">
          Import
        </v-btn>
        <v-btn
          title="Export Environments"
          :disabled="disabled"
          class="mb-2 mx-1"
          @click.stop="$emit('export-envs')">
          Export
        </v-btn>
        <v-btn
          title="Create New Environment"
          :disabled="disabled"
          color="primary"
          dark
          class="mb-2 ml-1"
          @click.stop="$emit('create')">
          New Environment
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.icon="{ item }">
      <div class="d-flex align-center justify-center">
        <v-img
          aria-hidden
          max-height="24"
          max-width="24"
          :src="$store.getters.icon(item.handle)"/>
      </div>
    </template>
    <template v-slot:item.ignore="{ item }">
      {{ item.ignore.join(', ') }}
    </template>
    <template v-slot:item.preset="{ item }">
      {{ JSON.stringify(item.preset) }}
    </template>
    <template v-slot:item.werke="{ item }">
      {{ $store.getters.werkeByEnv(item.handle).length || 0 }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        :disabled="disabled"
        title="Edit Environment"
        small
        class="ml-2"
        @click.stop="$emit('edit', item)">
        mdi-pencil
      </v-icon>
      <v-icon
        :disabled="disabled"
        title="Delete Environment"
        small
        class="ml-2"
        @click.stop="$emit('trash', item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>

import { mapGetters } from 'vuex';
import TableTitle from './TableTitle.vue';

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TableTitle,
  },
  computed: {
    ...mapGetters([
      'environments',
    ]),
  },
  data() {
    return {
      headers: [{
        text: 'Icon',
        value: 'icon',
        sortable: false,
        align: 'left',
        width: 56,
      }, {
        text: 'Name',
        value: 'name',
        width: 210,
      }, {
        text: 'Handle',
        value: 'handle',
        width: 184,
      }, {
        text: 'Ignore',
        value: 'ignore',
      }, {
        text: 'Preset',
        value: 'preset',
      }, {
        text: 'Werke',
        value: 'werke',
        align: 'center',
        width: 92,
      }, {
        text: 'Actions',
        value: 'actions',
        align: 'right',
        sortable: false,
        width: 80,
      }],
    };
  },
};
</script>
