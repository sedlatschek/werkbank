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
        <v-toolbar-title>Environment</v-toolbar-title>
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
        <v-form
          v-if="environment && tmp"
          v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="tmp.handle"
                :rules="handleRules"
                :disabled="!!environment.handle"
                label="Handle"
                required/>
              <v-text-field
                v-model="tmp.name"
                :rules="nameRules"
                :disabled="!!environment.name"
                label="Name"
                required/>
              <v-text-field
                v-model="tmp.dir"
                :rules="dirRules"
                :disabled="!!environment.dir"
                label="Directory"
                required
                hint="The directory path gets preceded with the vault path."/>
              <image-select
                label="Icon"
                v-model="icon"/>
              <tags
                label="Ignored folders"
                v-model="tmp.ignore"/>
              <v-checkbox
                v-model="tmp.preset.compressOnArchive"
                label="Compress werk into zip file on archive"/>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { pathExists, remove } from 'fs-extra';
import { SET_ENVIRONMENT, SET_ICON, REMOVE_ICON } from '@/store/types';
import { PNG_MIME } from '@/config';
import { saveBase64 } from '@/util';
import ImageSelect from './ImageSelect.vue';
import Tags from './Tags.vue';

export default {
  components: {
    ImageSelect,
    Tags,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    environment: {
      type: Object,
    },
  },
  data() {
    return {
      valid: false,
      tmp: null,
      icon: null,
      handleRules: [
        (v) => !!v || 'Handle is required',
        (v) => (v === this.environment.handle || !this.$store.getters.envByHandle(v)) || 'Handle must be unique',
        (v) => /^[a-z0-9-_]+$/.test(v) || 'Handle can only contain alphanumeric characters, hyphens and underscores',
      ],
      nameRules: [
        (v) => !!v || 'Name is required',
      ],
      dirRules: [
        (v) => !!v || 'Directory is required',
      ],
    };
  },
  watch: {
    environment(val) {
      this.reset(val);
    },
  },
  methods: {
    reset(value) {
      this.tmp = { ...value };
      if (value) {
        this.icon = this.$store.getters.icon(value.handle);
      } else {
        this.icon = null;
      }
    },
    async save() {
      const iconFile = this.$store.getters.envIconFile(this.tmp.handle);
      if (await pathExists(iconFile)) {
        await this.$store.dispatch(REMOVE_ICON, this.tmp.handle);
        await remove(iconFile);
      }
      if (this.icon) {
        await this.$store.dispatch(SET_ICON, { id: this.tmp.handle, icon: this.icon });
        await saveBase64(iconFile, PNG_MIME, this.icon);
      }
      this.$store.dispatch(SET_ENVIRONMENT, this.tmp);
      this.$emit('input', false);
    },
  },
  created() {
    this.reset(this.environment);
  },
};
</script>
