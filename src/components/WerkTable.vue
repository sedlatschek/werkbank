<template>
  <v-data-table
    :headers="headers"
    :items="items"
    item-key="id">
    <template v-slot:item.actions="{ item }">
      <v-icon
        title="Edit Werk"
        small
        class="mr-2"
        @click.stop="$emit('edit', item)">
        mdi-pencil
      </v-icon>
      <v-icon
        title="Delete Werk"
        small
        @click.stop="$emit('delete', item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
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
      }, {
        text: 'Actions',
        value: 'actions',
        sortable: false,
      }],
    };
  },
};
</script>
