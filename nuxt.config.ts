// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // IAM token secrets. Please rotate every 2 - 4 weeks
    iamAccessTokenSecret: process.env.IAM_ACCESS_TOKEN_SECRET,
    iamRefreshTokenSecret: process.env.IAM_REFRESH_TOKEN_SECRET,
    iamResetTokenSecret: process.env.IAM_RESET_TOKEN_SECRET,

    // IAM Reset Email Options
    iamResetEmailUrl: process.env.IAM_RESET_EMAIL_URL,
    iamResetEmailService: process.env.IAM_RESET_EMAIL_SERVICE,
    iamResetEmailUser: process.env.IAM_RESET_EMAIL_USER,
    iamResetEmailPassword: process.env.IAM_RESET_EMAIL_PASSWORD,
    iamResetEmailFrom: process.env.IAM_RESET_EMAIL_FROM,
    iamResetEmailSubject: process.env.IAM_RESET_EMAIL_SUBJECT,
    iamResetEmailText: process.env.IAM_RESET_EMAIL_TEXT,

    // Do not put secret information here
    public: {
      iamClientPlatform: process.env.IAM_CLIENT_PLATFORM,
      iamVerifyRegistrations: process.env.IAM_VERIFY_REGISTRATIONS,
    },
  },

  typescript: {
    shim: false,
  },
});
