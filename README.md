# nuxt-iam - Nuxt authentication framework

Nuxt IAM, which stands for **Nuxt Identity and Access Management**, is an authentication and authorization framework which adds authentication and authorization logic to your Nuxt app.

See a fully functional [example app](https://nuxt-iam.vercel.app/iam/).

[[add video]]

Nuxt IAM adds the following features to your application:

- ✔️ user registration with email and password
- ✔️ user login with email and password
- ✔️ user login/registration with Google
- ✔️ user password reset
- ✔️ user dashboard
- ✔️ user password change
- ✔️ user profile/account delete
- ✔️ admin user management
- ✔️ admin token management


https://user-images.githubusercontent.com/7818102/215188979-fe272b3f-ef3a-4b8d-9cfc-0dedd6edb911.mp4


It is a full featured Nuxt 3 app.

Sample app: https://nuxt-rest-api.vercel.app/iam/

For full documentations, go to [Nuxt IAM documentation](https://nuxt-iam.vercel.app/iam/)

## How it Works

Nuxt IAM adds authentication and authorization components, pages, api routes, and logic to your Nuxt app allowing your app to have authentication and authorization logic. All the components, pages, api routes, and logic are 100% customizable so you can change things any way you want.

## Getting Started

Follow the steps below to get started.

### Starting from Scratch (with nothing)

To get started with nothing, just clone the repository.

### Adding Nuxt IAM to an existing Nuxt app

Add content here...

For full documentations, go to [Nuxt IAM documentation](https://nuxt-iam.vercel.app/iam/)

## FRONTEND

Nuxt IAM is both frontend and backend. The main authentication and authorization logic takes place in the backend, and you're welcome to change anything as suits your needs. Let's talk about the frontend.

### Pages

Nuxt IAM adds several pages to your apps frontend. The pages are wrappers around components. Use these pages and components as starting points for making your app great. The following routes are added to your Nuxt front end. Find them in your pages directory:

- **iam/index**: Introductory page for Nuxt IAM
- **iam/register**: User registration page. After successful registration, you will be directed to login page
- **iam/verifyemail**: If email verification was set to true, (see configuration section), receives email verification token and sends it to backend for verification.
- **iam/login**: User login page. After successful login, you will be directed to iam/dashboard/index
- **iam/dashboard/index**: User dashboard.
- **iam/dashboard/profile**: User profile. User can update their account.
- **iam/dashboard/settings**: User settings. User can update their password and delete their account.
- **iam/reset**: User can reset their password. Does not have to be logged in. User will receive an email with a one-time password reset token.
- **iam/verify**: Page that receives password reset token and sends it to backend for verification
- **iam/verifyfailed**: Displays email or password verification failure.
- **iam/verifysuccessful**: Displays password verification success and a temporary password.

For full documentations, go to [Nuxt IAM documentation](https://nuxt-iam.vercel.app/iam/)

## Configuration

The following are runtime configuration options for Nuxt IAM. Please add the code below to your **nuxt.config** file.

```
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //...
  runtimeConfig: {
    // IAM token secrets. Please rotate every 2 - 4 weeks
    iamAccessTokenSecret: process.env.IAM_ACCESS_TOKEN_SECRET,
    iamRefreshTokenSecret: process.env.IAM_REFRESH_TOKEN_SECRET,
    iamResetTokenSecret: process.env.IAM_RESET_TOKEN_SECRET,
    iamVerifyTokenSecret: process.env.IAM_VERIFY_TOKEN_SECRET,

    // Public Url
    iamPublicUrl: process.env.IAM_PUBLIC_URL,

    // IAM Emailer
    iamEmailer: process.env.IAM_EMAILER,

    // nodemailer-service
    iamNodemailerService: process.env.IAM_NODEMAILER_SERVICE,
    iamNodemailerServiceSender: process.env.IAM_NODEMAILER_SERVICE_SENDER,
    iamNodemailerServicePassword: process.env.IAM_NODEMAILER_SERVICE_PASSWORD,

    // nodemailer-smtp
    iamNodemailerSmtpHost: process.env.IAM_NODEMAILER_SMTP_HOST,
    iamNodemailerSmtpPort: process.env.IAM_NODEMAILER_SMTP_PORT,
    iamNodemailerSmtpSender: process.env.IAM_NODEMAILER_SMTP_SENDER,
    iamNodemailerSmtpPassword: process.env.IAM_NODEMAILER_SMTP_PASSWORD,

    // IAM SendGrid
    iamSendGridApiKey: process.env.IAM_SENDGRID_API_KEY,
    iamSendgridSender: process.env.IAM_SENDGRID_SENDER,

    // GOOGLE CLIENT ID
    iamGoogleClientId: process.env.IAM_GOOGLE_CLIENT_ID,

    // Do not put secret information here
    public: {
      iamClientPlatform: process.env.IAM_CLIENT_PLATFORM,
      iamVerifyRegistrations: process.env.IAM_VERIFY_REGISTRATIONS,
      iamAllowGoogleAuth: process.env.IAM_ALLOW_GOOGLE_AUTH,
    },
  },

  modules: ["nuxt-vue3-google-signin"],
  googleSignIn: {
    clientId: process.env.IAM_GOOGLE_CLIENT_ID,
  },
  //...
});
```

For full documentations, go to [Nuxt IAM documentation](https://nuxt-iam.vercel.app/iam/)

### Example .env file

Below is an example of a .env file that contains the necessary variables for Nuxt IAM to work properly. Please add the following variables to your **.env** file.

```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# PRISMA DATABASE
DATABASE_URL="mysql://dbuser:dbpassword@dbserver:dbport/dbname"

# NUXT IAM TOKEN SECRETS (Please change them every 2 - 4 weeks)
# Can use in node 'crypto.randomBytes(64).toString('hex')'
IAM_ACCESS_TOKEN_SECRET="fa85424538b2878a7785a703d168fc58550c8ef3a02c23b8aee5f8adf98159b218296926d37164db8ed48d28a73c01387cf4fd0032e7e76858e71a09b2b82c88"
IAM_REFRESH_TOKEN_SECRET="c36f673adcbfe27859867697d6c98430c3757d3eafb7bca3fe90fe349baa9d88ec10932aba5da22f37264c2c2bd31404e5a22822be6f054ec9d40a56b28b97e1"
IAM_RESET_TOKEN_SECRET="a67102c7d684ad370409855fe3e7a65f9f9ccffeb82b0d53fe328c66a1405b03737da79a4dd42266a5a83ea9826421b9b031703337be5fd1e1eac0feb1ae2166"
IAM_VERIFY_TOKEN_SECRET="823459ed2ed1d80df1aedd3a5c03f1ee6132c20a076270d63d89e06c6b0f4fb7299991610f17dde4930b54432a6cf7b8d13b6da08b9f89bb8b30bb2c46c37f9e"

# NUXT IAM
# If using a browser like your Nuxt app, use 'browser' for production
# If using a browser like your Nuxt app, use 'browser-dev' for development
# If you're not using a browser, then use 'app'
IAM_CLIENT_PLATFORM = "browser"

IAM_PUBLIC_URL="http://localhost:3000"

# NUXT IAM EMAIL
# nodemailer-service, nodemailer-smtp, sendgrid
IAM_EMAILER="nodemailer-smtp"

# nodemailer-service
IAM_NODEMAILER_SERVICE="hotmail"
IAM_NODEMAILER_SERVICE_SENDER="myusername@outlook.com"
IAM_NODEMAILER_SERVICE_PASSWORD="myExcellentPassword767*"

# nodemailer-smtp
IAM_NODEMAILER_SMTP_HOST="mysmtp.host"
IAM_NODEMAILER_SMTP_PORT="465"
IAM_NODEMAILER_SMTP_SENDER="myname@mydomain.com"
IAM_NODEMAILER_SMTP_PASSWORD="myAmazingPassword753$"

# SENDGRID API KEY
IAM_SENDGRID_API_KEY="12345678901234567890"
IAM_SENDGRID_SENDER="myname@mysendgridaccount.com"

# NUXT IAM VERIFY REGISTRATIONS
IAM_VERIFY_REGISTRATIONS="false"

# IAM GOOGLE CLIENT ID
IAM_ALLOW_GOOGLE-AUTH="true"
IAM_GOOGLE_CLIENT_ID="123...com"
```

For full documentations, go to [Nuxt IAM documentation](https://nuxt-iam.vercel.app/iam/)

