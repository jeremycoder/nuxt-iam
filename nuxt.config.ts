// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    iamAccessTokenSecret: process.env.IAM_ACCESS_TOKEN_SECRET,
    iamRefreshTokenSecret: process.env.IAM_REFRESH_TOKEN_SECRET,
    public: {},
  },

  typescript: {
    shim: false,
  },
});
