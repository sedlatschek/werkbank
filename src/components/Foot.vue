<template>
  <v-footer padless>
    <v-card
      class="flex"
      flat
      tile>
      <v-card-text class="py-1 black--text font-weight-light d-flex justify-space-between ">
        <span>Made with ❤️ by Simon Sedlatschek</span>
        <a @click.stop="dialog = true">Disclaimer</a>
        <v-dialog
          v-model="dialog"
          scrollable
          width="740">
          <v-card>
            <v-card-title>
              Disclaimer
            </v-card-title>
            <v-card-text>
              <pre class="disclaimer font-weight-bold">{{ disclaimer }}</pre>
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
import disclaimer from '@/assets/disclaimer.txt';

export default {
  data() {
    return {
      dialog: false,
      disclaimer,
    };
  },
};
</script>

<style scoped>
.disclaimer {
  padding-top: 1em;
  white-space: pre-wrap;
}
</style>
