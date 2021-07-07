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
          color="primary"
          dark
          class="mb-2"
          @click.stop="$emit('create')">
          New Environment
        </v-btn>
      </v-toolbar>
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
        title="Edit Environment"
        small
        class="ml-2"
        @click.stop="$emit('edit', item)">
        mdi-pencil
      </v-icon>
      <v-icon
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
