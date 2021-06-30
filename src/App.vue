<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <h2 class="mb-5">Hot</h2>
            <werk-table :items="hotWerke"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2 class="mb-5">Cold</h2>
            <werk-table :items="coldWerke"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2 class="mb-5">Archived</h2>
            <werk-table :items="archivedWerke"/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import WerkTable from './components/WerkTable.vue';

export default {
  name: 'App',
  components: {
    WerkTable,
  },
  computed: {
    ...mapGetters([
      'hotWerke',
      'coldWerke',
      'archivedWerke',
    ]),
  },
};
</script>
