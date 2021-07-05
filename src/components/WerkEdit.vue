<template>
  <v-row justify="center">
    <v-dialog
      :value="value"
      @input="$emit('input', $event)"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition">
      <v-card v-if="tmp">
        <v-toolbar
          dark
          color="primary">
          <v-btn
            icon
            dark
            @click.stop="$emit('input', false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Werk</v-toolbar-title>
          <v-spacer></v-spacer>
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
            v-if="werk && tmp"
            ref="form"
            v-model="valid">
            <v-row>
              <v-col sm="6" cols="12">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="tmp.id"
                      disabled
                      label="Id"
                      required/>
                    <v-text-field
                      v-model="tmp.title"
                      label="Title"
                      :rules="titleRules"
                      required/>
                    <v-text-field
                      v-model="tmp.name"
                      label="Name"
                      :rules="nameRules"
                      required/>
                    <date-field
                      v-model="tmp.created"
                      label="Created"
                      required/>
                    <v-textarea
                      class="mt-5"
                      v-model="tmp.desc"
                      outlined
                      label="Description"/>
                    <environment-select
                      :disabled="!!werk.env"
                      v-model="tmp.env"
                      required/>
                    <v-checkbox
                      v-model="tmp.compressOnArchive"
                      label="Compress werk into zip file on archive"/>
                  </v-col>
                </v-row>
              </v-col>
              <v-col sm="6" cols="12">
                <v-card tile>
                  <v-list-item
                    two-line
                    v-for="(entry, index) in history"
                    :key="`history-${index}`">
                    <v-list-item-content>
                      <v-list-item-title>{{ WERK_STATE[entry.state] }}</v-list-item-title>
                      <v-list-item-subtitle>{{ entry.ts | prettyDate }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { SET_WERK, SAVE_WERK, WERK_STATE } from '@/store/types';
import dateUtil from '@/mixins/dateUtil';
import DateField from './DateField.vue';
import EnvironmentSelect from './EnvironmentSelect.vue';

export default {
  mixins: [dateUtil],
  components: {
    DateField,
    EnvironmentSelect,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    werk: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    history() {
      if (!this.tmp || !this.tmp.history) {
        return [];
      }
      return [].concat(this.tmp.history).reverse();
    },
  },
  data() {
    return {
      tmp: null,
      valid: false,
      titleRules: [
        (v) => !!v || 'Title is required',
      ],
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => /^[a-zA-Z0-9-_]+$/.test(v) || 'Name can only contain alphanumeric characters, hyphens and underscores',
      ],
      WERK_STATE,
    };
  },
  watch: {
    werk(val) {
      this.tmp = { ...val };
    },
  },
  methods: {
    async save() {
      this.$store.dispatch(SET_WERK, this.tmp);
      await this.$store.dispatch(SAVE_WERK, this.tmp);
      this.$emit('input', false);
    },
  },
  created() {
    this.tmp = { ...this.value };
  },
};
</script>
