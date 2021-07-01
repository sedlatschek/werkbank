<template>
  <v-select
    :value="value"
    @input="$emit('input', $event)"
    :disabled="disabled"
    :items="environments"
    item-text="name"
    item-value="handle"
    label="Environment"
    :rules="rules"/>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    value: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters([
      'environments',
    ]),
    rules() {
      if (this.required) {
        return [
          (v) => !!v || 'Environment is required',
        ];
      }
      return [];
    },
  },
};
</script>
