<template>
  <v-text-field
    :value="werkSearch"
    @input="$store.commit(SET_WERK_SEARCH, $event)"
    label="Search for Werk"
    append-icon="mdi-magnify"
    outlined
    filled
    dense
    hide-details/>
</template>

<script>
import { mapGetters } from 'vuex';
import { SET_WERK_SEARCH } from '@/store/types';

export default {
  computed: {
    ...mapGetters([
      'werkSearch',
    ]),
  },
  data() {
    return {
      SET_WERK_SEARCH,
    };
  },
};
</script>
