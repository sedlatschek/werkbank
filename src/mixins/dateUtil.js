import { pad } from '@/util';

export function prettyDate(date) {
  const tmp = date != null ? date : new Date();
  const year = tmp.getFullYear();
  const month = pad(tmp.getMonth() + 1);
  const day = pad(tmp.getDate());
  const hour = pad(tmp.getHours());
  const minute = pad(tmp.getMinutes());
  const second = pad(tmp.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function safeDate(date) {
  const tmp = date != null ? date : new Date();
  const year = tmp.getFullYear();
  const month = pad(tmp.getMonth() + 1);
  const day = pad(tmp.getDate());
  const hour = pad(tmp.getHours());
  const minute = pad(tmp.getMinutes());
  const second = pad(tmp.getSeconds());
  return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

export default {
  filters: {
    prettyDate,
    safeDate,
  },
};
