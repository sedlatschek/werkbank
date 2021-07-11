<template>
  <div class="image-select">
    <v-img :src="tmp">
      <v-btn
        class="mx-1"
        title="Select image"
        fab
        small
        dark
        color="teal lighten-1"
        @click="$refs.fileinput.$refs.input.click()">
        <v-icon dark>
          mdi-file-upload
        </v-icon>
      </v-btn>
      <v-btn
        v-if="tmp"
        class="mx-1"
        title="Clear image"
        fab
        small
        dark
        color="teal lighten-1"
        @click="clear">
        <v-icon dark>
          mdi-delete
        </v-icon>
      </v-btn>
    </v-img>
    <v-file-input
      aria-hidden
      ref="fileinput"
      class="d-none"
      clearable
      v-model="tmpFile"
      :rules="rules"
      accept="image/png"
      placeholder="Select an image from your hard drive"
      prepend-icon="mdi-file-upload"
      :label="label"
      @change="onChange"/>
  </div>
</template>

<script>
import { loadBase64 } from '@/util';
import { PNG_MIME } from '@/config';

export default {
  props: {
    value: String,
    label: String,
  },
  data() {
    return {
      tmp: null,
      tmpFile: null,
      rules: [
        (v) => !v || v.size < 2000000 || 'Image size must be less than 2 MB',
      ],
    };
  },
  watch: {
    value(val) {
      this.reset(val);
    },
  },
  methods: {
    reset(value) {
      this.tmp = value;
    },
    async onChange(file) {
      if (file) {
        const icon = await loadBase64(file.path, PNG_MIME);
        this.$emit('input', icon);
      } else {
        this.$emit('input', null);
      }
    },
    clear() {
      this.reset(null);
      this.$emit('input', null);
    },
  },
  created() {
    this.reset(this.value);
  },
};
</script>

<style lang="scss">
.image-select {
  .v-image {
    background-image: linear-gradient(45deg, #b3b2b2 25%, transparent 25%),
      linear-gradient(-45deg, #b3b2b2 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #b3b2b2 75%),
      linear-gradient(-45deg, transparent 75%, #b3b2b2 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    background-repeat: repeat;
    width: 232px;
    height: 232px;
    max-width: 232px;
    max-height: 232px;
    border: 1px solid var(--v-secondary-darken1);
    border-radius: .25rem;
    cursor: pointer;
    .v-responsive__content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
