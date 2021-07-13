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
        <v-toolbar-title>Environments</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-container class="mt-10">
        <environment-edit
          v-model="showEnvironmentEdit"
          :environment="environmentToEdit"/>
        <environment-table
          :disabled="processing"
          @create="createEnvironment"
          @edit="editEnvironment"
          @trash="environmentToTrash = $event; showEnvironmentTrashDialog = true;"
          @import-envs="importEnvs"
          @export-envs="exportEnvs"/>
        <environment-trash-dialog
          v-model="showEnvironmentTrashDialog"
          :environment="environmentToTrash"
          @confirm="$store.dispatch(REMOVE_ENVIRONMENT, $event.handle)"/>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { join } from 'path';
import downloadsFolder from 'downloads-folder';
import { readJson, outputJson } from 'fs-extra';
import { APP_TITLE } from '@/config';
import { showOpenDialog, showSaveDialog, showMessageBox } from '@/dialog';
import { SET_ICON, SET_ENVIRONMENT, REMOVE_ENVIRONMENT } from '@/store/types';
import { safeDate } from '@/mixins/dateUtil';
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
      processing: false,
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
    async importEnvs() {
      this.processing = true;
      try {
        const res = await showOpenDialog({
          title: 'Select Environments JSON to import',
          filters: [
            { name: 'JSON', extensions: ['json'] },
          ],
          properties: ['openFile'],
        });
        if (res.cancelled) {
          return;
        }
        const { environments, icons } = await readJson(res.filePaths[0]);

        let skipped = 0;
        let imported = 0;
        // import environments into store
        environments.forEach((env) => {
          const existingEnv = this.$store.getters.envByHandle(env);
          if (existingEnv && existingEnv.dir !== env.dir) {
            skipped += 1;
          } else {
            imported += 1;
            this.$store.dispatch(SET_ENVIRONMENT, env);
          }
        });

        if (skipped > 0) {
          await showMessageBox({
            title: APP_TITLE,
            message: `Skipped ${skipped} environment(s) because path changes are not supported.`,
          });
        }
        await showMessageBox({
          title: APP_TITLE,
          message: `Imported ${imported} environment(s).`,
        });

        // import icons into store
        const iconKeys = Object.keys(icons);
        iconKeys.forEach((id) => this.$store.dispatch(SET_ICON, { id, icon: icons[id] }));
        if (iconKeys.length > 0) {
          await showMessageBox({
            title: APP_TITLE,
            message: `Imported ${iconKeys.length} icon(s).`,
          });
        }
      } finally {
        this.processing = false;
      }
    },
    async exportEnvs() {
      this.processing = true;
      try {
        const result = await showSaveDialog({
          defaultPath: join(downloadsFolder(), `${safeDate()}_werkbank_env.json`),
          filters: [
            { name: 'JSON', extensions: ['json'] },
          ],
        });
        if (result.cancelled) {
          return;
        }
        const { filePath } = result;
        const { environments } = this.$store.getters;
        const icons = {};
        environments.forEach((env) => {
          const icon = this.$store.getters.icon(env.handle);
          if (icon) {
            icons[env.handle] = icon;
          }
        });
        await outputJson(filePath, { environments, icons });
      } finally {
        this.processing = false;
      }
    },
  },
};
</script>
