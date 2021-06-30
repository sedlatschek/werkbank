<template>
  <v-data-table
    :headers="headers"
    :items="items"
    item-key="id"
    class="elevation-1"/>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      headers: [{
        text: 'ID',
        value: 'id',
      }, {
        text: 'Name',
        value: 'name',
      }, {
        text: 'Title',
        value: 'title',
      }, {
        text: 'Environment',
        value: 'env',
      }],
    };
  },
};
</script>
