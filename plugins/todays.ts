// This plugin returns today's date
import dayjs from "dayjs";

const now = dayjs();
const today = dayjs(now).format("dddd, DD MMMM, YYYY");

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.today = today;
});
