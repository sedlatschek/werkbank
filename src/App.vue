<template>
  <v-app>
    <v-app-bar
      app
      color="dark"
      dark>
      <h1 class="font-weight-light">Werkbank</h1>
      <v-spacer></v-spacer>
      <v-btn
        title="Create Werk"
        class="ml-5"
        fab
        small
        dark
        color="teal lighten-1"
        @click="createWerk">
        <v-icon dark>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="pt-12">
        <werk-edit
          v-model="showWerkEdit"
          :werk="werkToEdit"/>
        <v-row>
          <v-col>
            <h2 class="mb-5">Hot</h2>
            <werk-table
              :items="hotWerke"
              @edit="editWerk"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2 class="mb-5">Cold</h2>
            <werk-table
              :items="coldWerke"
              @edit="editWerk"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2 class="mb-5">Archived</h2>
            <werk-table
              :items="archivedWerke"
              @edit="editWerk"/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { v4 as uuid } from 'uuid';
import { mapGetters } from 'vuex';
import WerkEdit from './components/WerkEdit.vue';
import WerkTable from './components/WerkTable.vue';

export default {
  name: 'App',
  components: {
    WerkEdit,
    WerkTable,
  },
  computed: {
    ...mapGetters([
      'hotWerke',
      'coldWerke',
      'archivedWerke',
    ]),
  },
  data() {
    return {
      showWerkEdit: false,
      werkToEdit: null,
    };
  },
  methods: {
    createWerk() {
      this.werkToEdit = {
        id: uuid(),
        title: '',
        name: '',
        desc: '',
        created: new Date(),
        env: null,
        compressOnArchive: true,
        state: 0,
        moving: false,
        history: [],
      };
      this.showWerkEdit = true;
    },
    editWerk(werk) {
      this.werkToEdit = werk;
      this.showWerkEdit = true;
    },
  },
};
</script>
