<template>
  <v-toolbar-title class="d-flex align-items">
    <v-icon class="mr-3">mdi-{{ icon }}</v-icon>
    {{ label }}
  </v-toolbar-title>
</template>

<script>
export default {
  props: {
    icon: String,
    label: String,
  },
};
</script>
