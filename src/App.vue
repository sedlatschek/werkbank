<template>
  <v-app>
    <v-app-bar
      app
      color="dark"
      dark>
      <h1 class="font-weight-light">Werkbank</h1>
      <v-spacer/>
      <search/>
      <v-spacer/>
      <v-btn
        title="Gather Werke"
        fab
        small
        dark
        color="teal lighten-1"
        :disabled="gatheringWerke"
        @click.stop="$store.dispatch(GATHER_ALL_WERKE)">
        <v-icon dark>
          mdi-find-replace
        </v-icon>
      </v-btn>
      <v-badge
        :content="queue.length.toString()"
        :value="queue.length > 0"
        color="accent"
        overlap>
        <v-btn
          title="Queue"
          class="ml-3"
          fab
          small
          dark
          color="teal lighten-1"
          @click="showQueue = true">
          <v-icon dark>
            mdi-tray-full
          </v-icon>
        </v-btn>
      </v-badge>
      <v-btn
        title="Open Settings"
        class="ml-3"
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
    <busy/>
    <v-main>
      <environments v-model="showEnvironments"/>
      <settings v-model="showSettings"/>
      <queue v-model="showQueue"/>
      <werke ref="werke"/>
    </v-main>
    <foot/>
  </v-app>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapGetters } from 'vuex';
import { GATHER_ALL_WERKE } from '@/store/types';
import Busy from './components/Busy.vue';
import Environments from './components/Environments.vue';
import Foot from './components/Foot.vue';
import Queue from './components/Queue.vue';
import Search from './components/Search.vue';
import Settings from './components/Settings.vue';
import Werke from './components/Werke.vue';

export default {
  name: 'App',
  components: {
    Busy,
    Environments,
    Foot,
    Queue,
    Search,
    Settings,
    Werke,
  },
  computed: {
    ...mapGetters([
      'gatheringWerke',
      'queue',
      'setting_dirs',
    ]),
  },
  data() {
    return {
      showEnvironments: false,
      showQueue: false,
      showSettings: false,
      GATHER_ALL_WERKE,
    };
  },
  methods: {
    createWerk() {
      this.$refs.werke.createWerk();
    },
  },
  created() {
    ipcRenderer.on('create-werk', this.createWerk);
  },
  mounted() {
    // open settings if not configured yet
    this.showSettings = this.setting_dirs.some((dir) => !dir);
  },
};
</script>
