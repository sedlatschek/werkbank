<template>
  <v-combobox
    multiple
    :value="tmp"
    :label="label"
    append-icon
    chips
    deletable-chips
    @change="$emit('input', $event)"/>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: 'Tags',
    },
  },
  data() {
    return {
      tmp: null,
    };
  },
  watch: {
    value(val) {
      this.tmp = Array.from(val);
    },
  },
  created() {
    this.tmp = Array.from(this.value);
  },
};
</script>
