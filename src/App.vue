<template>
  <v-app>
    <v-app-bar
      app
      color="dark"
      dark>
      <h1 class="font-weight-light">Werkbank</h1>
      <v-spacer></v-spacer>
      <v-btn
        title="Gather Werke"
        class="ml-5"
        fab
        small
        dark
        color="teal lighten-1"
        @click="gatherWerke">
        <v-icon dark>
          mdi-find-replace
        </v-icon>
      </v-btn>
      <v-btn
        title="Create Werk"
        class="ml-3"
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
            <queue/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2 class="mb-5">Hot</h2>
            <werk-table
              enable-backup
              :down-action="MOVE_FREEZE"
              :items="hotWerke"
              @edit="editWerk"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2 class="mb-5">Cold</h2>
            <werk-table
              :items="coldWerke"
              :up-action="MOVE_HEATUP"
              :down-action="MOVE_ARCHIVE"
              @edit="editWerk"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2 class="mb-5">Archived</h2>
            <werk-table
              :items="archivedWerke"
              :up-action="MOVE_RETRIEVE"
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
import {
  GATHER_WERKE,
  MOVE_FREEZE,
  MOVE_HEATUP,
  MOVE_ARCHIVE,
  MOVE_RETRIEVE,
  WERK_STATE_HOT,
} from '@/store/types';
import Queue from './components/Queue.vue';
import WerkEdit from './components/WerkEdit.vue';
import WerkTable from './components/WerkTable.vue';

export default {
  name: 'App',
  components: {
    Queue,
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
      MOVE_FREEZE,
      MOVE_HEATUP,
      MOVE_ARCHIVE,
      MOVE_RETRIEVE,
    };
  },
  methods: {
    gatherWerke() {
      const dirs = Object.values(this.$store.getters.settings.directories);
      dirs.forEach((dir) => this.$store.dispatch(GATHER_WERKE, dir));
    },
    createWerk() {
      this.werkToEdit = {
        id: uuid(),
        title: '',
        name: '',
        desc: '',
        created: new Date(),
        env: null,
        compressOnArchive: true,
        state: WERK_STATE_HOT,
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
