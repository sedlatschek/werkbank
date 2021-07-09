<template>
  <v-footer padless>
    <v-card
      class="flex"
      flat
      tile>
      <v-card-text class="py-1 black--text font-weight-light d-flex justify-space-between">
        <span>Made with ❤️ by Simon Sedlatschek</span>
        <div>
          <a class="mx-2" @click.stop="open('Changelog')">Changelog</a>
          <a class="ml-2" @click.stop="open('Disclaimer')">Disclaimer</a>
        </div>
        <v-dialog
          v-model="dialog"
          scrollable
          width="740">
          <v-card>
            <v-card-title>
              {{ type }}
            </v-card-title>
            <v-card-text style="margin-top: -1em">
              <div v-if="type === 'Changelog'" class="changelog" v-html="changelog"/>
              <pre v-else class="disclaimer font-weight-bold">{{ disclaimer }}</pre>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
              <v-spacer/>
              <v-btn
                text
                @click="dialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import markdownIt from 'markdown-it';
import mila from 'markdown-it-link-attributes';
import disclaimer from '@/assets/disclaimer.txt';
import { SET_OPEN_WITH_CHANGELOG } from '@/store/types';
import changelog from '../../CHANGELOG.md';

const md = markdownIt();
md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
});

export default {
  data() {
    return {
      dialog: false,
      type: 'Changelog',
      changelog: md.render(changelog.replace(/^# Changelog/, '')),
      disclaimer,
    };
  },
  methods: {
    open(type) {
      this.type = type;
      this.dialog = true;
    },
  },
  mounted() {
    if (this.$store.getters.openWithChangelog) {
      this.$store.commit(SET_OPEN_WITH_CHANGELOG, false);
      setTimeout(() => this.open('Changelog'), 400);
    }
  },
};
</script>

<style lang="scss">
.changelog {
  h2 {
    margin-top: 1em;
    margin-bottom: .2em;
  }
  a {
    text-decoration: none;
  }
}
.disclaimer {
  padding-top: 1em;
  white-space: pre-wrap;
}
</style>
