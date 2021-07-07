<template>
  <v-app>
    <v-app-bar
      app
      color="dark"
      dark>
      <h1 class="font-weight-light">Werkbank</h1>
      <v-spacer></v-spacer>
      <v-btn
        title="Open Settings"
        class="ml-5"
        fab
        small
        dark
        color="teal lighten-1"
        @click="showSettings = true">
        <v-icon dark>
          mdi-cog
        </v-icon>
      </v-btn>
      <v-btn
        title="Environments"
        class="ml-3"
        fab
        small
        dark
        color="teal lighten-1"
        @click="showEnvironments = true">
        <v-icon dark>
          mdi-iframe-outline
        </v-icon>
      </v-btn>
      <v-btn
        title="Gather Werke"
        class="ml-3"
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
        <environments v-model="showEnvironments"/>
        <settings v-model="showSettings"/>
        <werk-trash-dialog
          v-model="showWerkTrashDialog"
          :werk="werkToTrash"
          @confirm="$store.dispatch(MOVE_TRASH, $event)"/>
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
              @edit="editWerk"
              @trash="trashWerk"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2 class="mb-5">Cold</h2>
            <werk-table
              :items="coldWerke"
              :up-action="MOVE_HEATUP"
              :down-action="MOVE_ARCHIVE"
              @edit="editWerk"
              @trash="trashWerk"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2 class="mb-5">Archived</h2>
            <werk-table
              :items="archivedWerke"
              :up-action="MOVE_RETRIEVE"
              @edit="editWerk"
              @trash="trashWerk"/>
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
  MOVE_TRASH,
  WERK_STATE_HOT,
} from '@/store/types';
import Environments from './components/Environments.vue';
import Queue from './components/Queue.vue';
import Settings from './components/Settings.vue';
import WerkTrashDialog from './components/WerkTrashDialog.vue';
import WerkEdit from './components/WerkEdit.vue';
import WerkTable from './components/WerkTable.vue';

export default {
  name: 'App',
  components: {
    Environments,
    Queue,
    WerkTrashDialog,
    WerkEdit,
    WerkTable,
    Settings,
  },
  computed: {
    ...mapGetters([
      'hotWerke',
      'coldWerke',
      'archivedWerke',
      'setting_dirs',
    ]),
  },
  data() {
    return {
      showEnvironments: false,
      showSettings: false,
      showWerkEdit: false,
      werkToEdit: null,
      showWerkTrashDialog: false,
      werkToTrash: null,
      MOVE_FREEZE,
      MOVE_HEATUP,
      MOVE_ARCHIVE,
      MOVE_RETRIEVE,
      MOVE_TRASH,
    };
  },
  methods: {
    gatherWerke() {
      const dirs = this.$store.getters.setting_dirs;
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
    trashWerk(werk) {
      this.showWerkTrashDialog = true;
      this.werkToTrash = werk;
    },
  },
  mounted() {
    // open settings if not configured yet
    this.showSettings = this.setting_dirs.some((dir) => !dir);
  },
};
</script>
