<template>
  <v-dialog
    ref="dateField"
    v-model="showPicker"
    :return-value.sync="tmp"
    persistent
    width="290px">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :label="label"
        :value="dateToStr(value)"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"/>
    </template>
    <v-date-picker
      v-model="tmp"
      scrollable>
      <v-spacer/>
      <v-btn
        text
        color="primary"
        @click="showPicker = false">
        Cancel
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="update(); showPicker = false">
        OK
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Date,
    label: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      tmp: null,
      showPicker: false,
    };
  },
  watch: {
    value(val) {
      this.$nextTick(() => {
        this.setTmp(val);
      });
    },
  },
  methods: {
    update() {
      this.$nextTick(() => {
        const [year, month, day] = this.tmp.split('-');
        this.$emit('input', new Date(year, month - 1, day));
      });
    },
    pad(number) {
      if (number < 10) {
        return `0${number}`;
      }
      return number;
    },
    dateToStr(date) {
      const year = this.pad(date.getFullYear());
      const month = this.pad(date.getMonth() + 1);
      const day = this.pad(date.getDate());
      return `${year}-${month}-${day}`;
    },
    setTmp(date) {
      if (date) {
        this.tmp = this.dateToStr(date);
      } else {
        this.tmp = null;
      }
    },
  },
  created() {
    this.setTmp(this.value);
  },
};
</script>
