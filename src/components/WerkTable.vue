<template>
  <v-data-table
    :headers="headers"
    :items="items"
    item-key="id">
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

export default {
  props: {
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
        text: 'ID',
        value: 'id',
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
        sortable: false,
        align: 'right',
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
