<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    max-width="400">
    <v-card v-if="environment">
      <v-card-title class="text-h5">
        <span v-if="possible">Delete {{ environment.name }} environment?</span>
        <span v-else>{{ environment.name }} not empty</span>
      </v-card-title>
      <v-card-text v-if="possible">
        The environment {{ environment.name }} will be deleted. Any files remain untouched.
        Do you want to continue?
      </v-card-text>
      <v-card-text v-else>
        There {{ werke.length === 1 ? 'is' : 'are' }} still {{ werke.length }}
        werk{{ werke.length === 1 ? '' : 'e' }} for this environment.
        Only empty environments can be deleted.
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
          :disabled="!possible"
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
    environment: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters([
      'werkeByEnv',
    ]),
    werke() {
      if (!this.environment) {
        return [];
      }
      return this.$store.getters.werkeByEnv(this.environment.handle);
    },
    possible() {
      return this.environment && this.werke.length === 0;
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.environment);
      this.$emit('input', false);
    },
  },
};
</script>
