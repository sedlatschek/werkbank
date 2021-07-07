<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar
        dark
        color="primary">
        <v-btn
          icon
          dark
          @click.stop="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Environments</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-container class="mt-10">
        <environment-edit
          v-model="showEnvironmentEdit"
          :environment="environmentToEdit"/>
        <environment-table
          @create="createEnvironment"
          @edit="editEnvironment"
          @trash="environmentToTrash = $event; showEnvironmentTrashDialog = true;"/>
        <environment-trash-dialog
          v-model="showEnvironmentTrashDialog"
          :environment="environmentToTrash"
          @confirm="$store.dispatch(REMOVE_ENVIRONMENT, $event.handle)"/>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { REMOVE_ENVIRONMENT } from '@/store/types';
import EnvironmentEdit from './EnvironmentEdit.vue';
import EnvironmentTable from './EnvironmentTable.vue';
import EnvironmentTrashDialog from './EnvironmentTrashDialog.vue';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    EnvironmentEdit,
    EnvironmentTable,
    EnvironmentTrashDialog,
  },
  data() {
    return {
      showEnvironmentEdit: false,
      environmentToEdit: null,
      showEnvironmentTrashDialog: false,
      environmentToTrash: null,
      REMOVE_ENVIRONMENT,
    };
  },
  methods: {
    createEnvironment() {
      this.environmentToEdit = {
        handle: '',
        name: '',
        dir: '',
        ignore: [],
      };
      this.showEnvironmentEdit = true;
    },
    editEnvironment(env) {
      this.environmentToEdit = env;
      this.showEnvironmentEdit = true;
    },
  },
};
</script>
