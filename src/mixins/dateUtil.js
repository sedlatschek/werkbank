import { pad } from '@/util';

export default {
  filters: {
    prettyDate(date) {
      if (!date) return null;
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hour = pad(date.getHours());
      const minute = pad(date.getMinutes());
      const second = pad(date.getSeconds());
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
  },
};
