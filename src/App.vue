<template>
  <v-app>
    <v-app-bar
      app
      color="dark"
      dark>
      <h1 class="font-weight-light">Werkbank</h1>
      <v-spacer/>
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
      </v-container>
      <queue ref="queue"/>
      <werke ref="werke"/>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import { GATHER_WERKE } from '@/store/types';
import Environments from './components/Environments.vue';
import Queue from './components/Queue.vue';
import Settings from './components/Settings.vue';
import Werke from './components/Werke.vue';

export default {
  name: 'App',
  components: {
    Environments,
    Queue,
    Settings,
    Werke,
  },
  computed: {
    ...mapGetters([
      'setting_dirs',
    ]),
  },
  data() {
    return {
      showEnvironments: false,
      showSettings: false,
    };
  },
  methods: {
    gatherWerke() {
      const dirs = this.$store.getters.setting_dirs;
      dirs.forEach((dir) => this.$store.dispatch(GATHER_WERKE, dir));
    },
    createWerk() {
      this.$refs.werke.createWerk();
    },
  },
  mounted() {
    // open settings if not configured yet
    this.showSettings = this.setting_dirs.some((dir) => !dir);
  },
};
</script>
