// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // IAM token secrets. Please rotate every 2 - 4 weeks
    iamAccessTokenSecret: process.env.IAM_ACCESS_TOKEN_SECRET,
    iamRefreshTokenSecret: process.env.IAM_REFRESH_TOKEN_SECRET,
    iamResetTokenSecret: process.env.IAM_RESET_TOKEN_SECRET,

    // IAM Email Options
    iamEmailer: process.env.IAM_EMAILER,
    iamEmailUrl: process.env.IAM_EMAIL_URL,
    iamEmailHost: process.env.IAM_EMAIL_HOST,
    iamEmailPort: process.env.IAM_EMAIL_PORT,
    iamEmailService: process.env.IAM_EMAIL_SERVICE,
    iamEmailUser: process.env.IAM_EMAIL_USER,
    iamEmailPassword: process.env.IAM_EMAIL_PASSWORD,
    iamEmailFrom: process.env.IAM_EMAIL_FROM,
    iamEmailSubject: process.env.IAM_EMAIL_SUBJECT,
    iamEmailText: process.env.IAM_EMAIL_TEXT,

    // IAM SendGrid
    iamSendGridApiKey: process.env.SENDGRID_API_KEY,

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
