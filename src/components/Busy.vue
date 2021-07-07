<template>
  <div
    class="busy"
    :class="{ show, aboutToHide }">
    <v-progress-circular
      indeterminate
      color="primary"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'busy',
    ]),
  },
  data() {
    return {
      show: false,
      aboutToHide: false,
    };
  },
  watch: {
    busy(value) {
      if (!value) {
        // the busy screen always shows for atleast 1 second
        setTimeout(() => {
          this.aboutToHide = true;
          setTimeout(() => {
            this.show = false;
            this.aboutToHide = false;
          }, 400);
        }, 1000);
      } else this.show = true;
    },
  },
  created() {
    this.show = this.busy;
  },
};
</script>

<style lang="scss" scoped>
.busy {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  transition: opacity 0.4s;
  opacity: 0;
  backdrop-filter: blur(4px) brightness(0.5);
  &.show {
    opacity: 1;
    backdrop-filter: blur(4px) brightness(0.5);
    z-index: 101;
    .v-progress-circular {
      display: inline-flex;
    }
  }
  &.aboutToHide {
    opacity: 0;
  }
  .v-progress-circular {
    display: none;
    width: 64px !important;
    height: 64px !important;
  }
}
</style>
