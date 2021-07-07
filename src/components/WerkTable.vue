<template>
  <v-data-table
    :headers="headers"
    :items="items"
    item-key="id">
    <template v-slot:top>
      <v-toolbar flat>
        <table-title
          :label="label"
          :icon="icon"/>
        <v-spacer/>
      </v-toolbar>
    </template>
    <template v-slot:item.icon="{ item }">
      <div class="d-flex align-center justify-center">
        <v-img
          aria-hidden
          max-height="24"
          max-width="24"
          :src="$store.getters.icon(item.id)"/>
      </div>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        title="Open Werk Folder"
        small
        class="ml-2"
        @click.stop="open(item)">
        mdi-folder-open
      </v-icon>
      <v-icon
        title="Edit Werk"
        small
        class="ml-2"
        @click.stop="$emit('edit', item)">
        mdi-pencil
      </v-icon>
      <v-icon
        title="Delete Werk"
        small
        class="ml-2"
        @click.stop="$emit('trash', item)">
        mdi-delete
      </v-icon>
      <v-icon
        v-if="enableBackup"
        title="Backup Werk"
        small
        class="ml-2"
        @click.stop="backup(item)">
        mdi-content-save
      </v-icon>
      <v-icon
        v-if="upAction"
        title="Heatup Werk"
        small
        class="ml-2"
        @click.stop="up(item)">
        mdi-arrow-up-bold
      </v-icon>
      <v-icon
        v-if="downAction"
        title="Freeze Werk"
        small
        class="ml-2"
        @click.stop="down(item)">
        mdi-arrow-down-bold
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { MOVE_BACKUP, OPEN_WERK_FOLDER } from '@/store/types';
import TableTitle from './TableTitle.vue';

export default {
  components: {
    TableTitle,
  },
  props: {
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
    items: {
      type: Array,
      required: true,
    },
    downAction: {
      type: String,
      default: null,
    },
    upAction: {
      type: String,
      default: null,
    },
    enableBackup: {
      type: Boolean,
      default: false,
    },
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
      }, {
        text: 'Title',
        value: 'title',
      }, {
        text: 'Environment',
        value: 'env',
      }, {
        text: 'Actions',
        value: 'actions',
        align: 'right',
        sortable: false,
        width: 152,
      }],
    };
  },
  methods: {
    open(werk) {
      this.$store.dispatch(OPEN_WERK_FOLDER, werk);
    },
    down(werk) {
      this.$store.dispatch(this.downAction, werk);
    },
    up(werk) {
      this.$store.dispatch(this.upAction, werk);
    },
    backup(werk) {
      this.$store.dispatch(MOVE_BACKUP, werk);
    },
  },
};
</script>
