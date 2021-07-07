<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    max-width="350">
    <v-card v-if="werk">
      <v-card-title class="text-h5">
        Delete {{ werk.title }} files?
      </v-card-title>
      <v-card-text>
        Every file in
        <code>{{ dirFor(werk) }}</code>
        will be permanently deleted.<br/>
        Do you want to continue?
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          text
          @click="$emit('input', false)">
          Cancel
        </v-btn>
        <v-btn
          color="error"
          text
          @click="confirm">
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    werk: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters([
      'dirFor',
    ]),
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.werk);
      this.$emit('input', false);
    },
  },
};
</script>
