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
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items>
          <v-btn
            dark
            text
            :disabled="!valid"
            @click.stop="save">
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container class="mt-10">
        <v-form v-model="valid">
          <v-row>
            <v-col
              cols="12"
              class="d-flex align-center"
              v-for="(path, index) in paths"
              :key="`path-${index}`">
              <v-text-field
                :rules="pathRules"
                v-model="tmp[path.key]"
                :label="path.label"
                required/>
              <v-btn
                :title="`Select Path for ${path.label}`"
                class="ml-5"
                color="primary"
                @click.stop="selectPath(path.key)">
                Select
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="tmp.dark"
                label="Dark Mode"/>
              <v-checkbox
                v-model="tmp.launchWithSystem"
                label="Launch Werkbank on system startup"/>
              <v-checkbox
                v-model="tmp.launchMinimized"
                label="Launch Werkbank minimized"/>
              <v-checkbox
                v-model="tmp.gatherOnStartup"
                label="Gather werke on launch"/>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { existsSync } from 'fs';
import { SET_SETTING } from '@/store/types';
import { showOpenDialog } from '@/dialog';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters([
      'settings',
    ]),
  },
  data() {
    return {
      valid: false,
      tmp: null,
      paths: [{
        key: 'dir_hot',
        label: 'Hot Vault',
      }, {
        key: 'dir_cold',
        label: 'Cold Vault',
      }, {
        key: 'dir_archive',
        label: 'Archive Vault',
      }],
      pathRules: [
        (v) => (!!v && existsSync(v)) || 'Path must exist',
      ],
    };
  },
  methods: {
    save() {
      const keys = Object.keys(this.tmp);
      keys.forEach((key) => {
        this.$store.dispatch(SET_SETTING, { key, value: this.tmp[key] });
        if (key === 'dark') {
          this.$vuetify.theme.dark = this.tmp[key];
        }
      });
      this.$emit('input', false);
    },
    async selectPath(key) {
      const result = await showOpenDialog({
        properties: ['openDirectory'],
      });
      if (!result.cancelled) {
        const path = result.filePaths[0];
        this.tmp[key] = path;
      }
    },
  },
  created() {
    this.tmp = { ...this.settings };
  },
};
</script>
