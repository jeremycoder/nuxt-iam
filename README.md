# INCOMPLETE

# nuxt-iam - powerful authentication & authorization for Nuxt

Nuxt IAM (identity and access management) adds powerful authentication and authorization to your Nuxt app to help you get up and running with authentication and authorization best practices quickly.

- ✔️ user registration
- ✔️ user login
- ✔️ user password reset
- ✔️ user profile
- ✔️ user profile update
- ✔️ user profile delete

https://user-images.githubusercontent.com/7818102/215188979-fe272b3f-ef3a-4b8d-9cfc-0dedd6edb911.mp4

It is a full featured Nuxt 3 app.
Sample app: https://nuxt-rest-api.vercel.app/iam/

To learn more about Nuxt 3, look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## How it Works

Nuxt IAM adds authentication and authorization components, pages, api routes, and logic to your Nuxt app allowing your app to have authentication and authorization logic. All the components, pages, api routes, and logic is 100% customizable so you can change things any way you want.

## Getting Started

Follow the steps below to get started.

### Starting from Scratch

Add content here...

### Adding Nuxt IAM to an existing Nuxt app

Add content here...

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

## Configuration

The following are runtime configuration options for Nuxt IAM. Please add the code below to your **nuxt.config** file.

```
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

    // Do not put secret information here
    public: {
      iamClientPlatform: process.env.IAM_CLIENT_PLATFORM,
      iamVerifyRegistrations: process.env.IAM_VERIFY_REGISTRATIONS,
    },
  },
//...

});
```

### Example .env file

Your nuxt.config file links to your .env file. Here's an example of your **.env** file:

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

# NUXT IAM RESET EMAIL
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

# NUXT IAM VERIFY REGISTRATIONS
IAM_VERIFY_REGISTRATIONS="false"

# SENDGRID API KEY
IAM_SENDGRID_API_KEY="12345678901234567890"
IAM_SENDGRID_SENDER="myname@mysendgridaccount.com"
```

### .env Variables Explained

#### IAM token secrets.

Please rotate every 2 - 4 weeks

- **IAM_ACCESS_TOKEN_SECRET**:
- **IAM_REFRESH_TOKEN_SECRET**:
- **IAM_RESET_TOKEN_SECRET**:
- **IAM_VERIFY_TOKEN_SECRET**:

#### Public Url

- **IAM_PUBLIC_URL**:

#### Chosen email service

- **IAM_EMAILER**:

#### Nodemailer-service

- **IAM_NODEMAILER_SERVICE**:
- **IAM_NODEMAILER_SERVICE_SENDER**:
- **IAM_NODEMAILER_SERVICE_PASSWORD**:

#### Nodemailer-smtp

- **IAM_NODEMAILER_SMTP_HOST**:
- **IAM_NODEMAILER_SMTP_PORT**:
- **IAM_NODEMAILER_SMTP_SENDER**:
- **IAM_NODEMAILER_SMTP_PASSWORD**:

#### Sendgrid key and sender (email)

- **IAM_SENDGRID_API_KEY**:
- **IAM_SENDGRID_SENDER**:

#### Client Platform

- **IAM_CLIENT_PLATFORM**:

#### Verify emails of registrations

- **IAM_VERIFY_REGISTRATIONS**:

## BACKEND

Nuxt IAM has an extensive backend which adds several API endpoints and logic to enable authorization and authentication.

### Server

Nuxt IAM adds the following directories to your **server/api** directory.

- **iam/authn**: global authentication handler
- **iam/refresh-tokens**: refresh tokens handler
- **iam/users**: global users handler

### Client Platform

`client-platform` is a **required** header and it must be sent with every request. Client platform allows Nuxt IAM to provide the best practices for securing your app. `client-platform` must be:

- `app`: Use `app` if the request is coming from a non-browser such as a mobile app, tablet, or a tool like POSTMAN. Access and refresh tokens will be sent in the response headers. Can be used in **production**.
- `browser`: Use `browser` if the request is coming from a browser. Access and refresh tokens will be sent in **secure, httpOnly** cookies. Can be used in **production**.
- `browser-dev`: Use `browser-dev` if the request is coming from a browser in a development environment. Access and refresh tokens are sent in **unsecure** cookies. Use only in **development.**

### Authentication API Endpoints

Nuxt IAM responds to the following endpoints sent to **api/iam/authn**. See api request and response examples for examples.

- **iam/authn/register**: Register user
- **iam/authn/login**: Log user in
- **iam/authn/profile**: Get user profile
- **iam/authn/update**: Update user profile
- **iam/authn/reset**: Reset user password
- Continue...

The following are API routes that Nuxt IAM adds to your app.

#### API Responses

API responses should always be in the format below

```
"status": ["success"] | ["fail"],
 "data": {},
 "error" {},
```

`status` is always sent. `data` may or may not be sent depending on the request. `error` is only sent if an error occurred.

##### Success

Here's an example of a successful API response when a user is successfully registered:

```
"status": "success",
   "data": {
       "email": "jeremy@example.com"
   }
```

Here's an example of an error occuring when we try to register a user who already exists. Email must be unique throughout the system.

##### Fail

```
"status": "fail",
  "error": {
      "message": "Email already exists",
      "statusCode": 409,
      "statusMessage": "Email already exists"
  }
```

#### Register user

To register a user, send a POST request to `/api/iam/authn/register`.

##### Request

```
const response = await $fetch("/api/iam/authn/register", {
    method: "POST",
    headers: {
      "client-platform": ['app']|['browser']|['browser-dev'],
    },
    body: {
      first_name: 'Jeremy',
      last_name: 'Mwangelwa',
      email: 'jeremy@example.com',
      password: 'MyExamplePassword123*',
    },
  });
```

##### Response

```
"status": "success",
    "data": {
        "email": "jeremy@example.com"
    }
```

If the response status was `success`, then the user was successfully registered and added to the database. A registered user can now be logged in.

#### Login user

To login, send a POST request to `/api/iam/authn/login`.

##### Request

```
const response = await $fetch("/api/iam/authn/login", {
    method: "POST",
    headers: {
      "client-platform": ['app']|['browser']|['browser-dev'],
    },
    body: {
      email: 'jeremy@example.com',
      password: 'MyExamplePassword123*',
    },
  });
```

##### Response

###### Body

```
"status": "success",
    "data": {
        "email": "jeremy@example.com"
    }
```

###### Headers

```
access-token: Bearer eyJhbGciOiJIUzI1NiIs...0g3IYFA

refresh-token: Bearer eyJhbGciOiJIUzI1...xIMUybnk
```

In a successful login, an access token and a refresh token will be sent. If your `client platform` is `app`, the tokens will be sent in the headers. If your `client platform` is `browser`, the tokens will be sent in secure, httpOnly cookies. If your `client platform` is `browser-dev`, the tokens will be sent in unsecure cookies.

**Only use browser-dev in development**

##### Tokens

Access tokens expire every **15 minutes** Refresh tokens expire every **14 days**. If your access token expires, you'll need to login again. You can get a new set of access and refresh tokens when you send a POST request to `/api/iam/authn/refresh` with an unexpired refresh token. If your refresh token has expired, you will not be able to get a new set of tokens and you'll need to login.

###### Automatic token rotation

If your client platform is `browser` or `browser-only`, Nuxt IAM will automatically refresh your tokens if it detects that your access token has expired, and that your refresh token is not expired. When using a browser, you really don't have to concern yourself with tokens.

##### Detecting stolen refresh tokens

Nuxt IAM keeps track of expired refresh tokens. Let's say you you have a one refresh token in the database. If you refresh your tokens, you get a new set of tokens, and the old refresh token will be deactivated. If you or someone else steals the old refresh token and attempts to get a new set of tokens using that refresh token, all your refresh tokens will be deactivated, and you will have to login after your access token expires. This feature protects your account against stolen tokens.

##### Client platform and tokens

If your client platform is `app` and you need to access a protected resource that requires authentication or you need to refresh your tokens, you'll need to send valid access and refresh tokens in your **request headers**. For example:

```
const response = await $fetch("/api/iam/authn/refresh", {
    method: "POST",
    headers: {
      "client-platform": "app",
      "iam-access-token": "Bearer eyJhbGciOiJI....UzI1NiIs",
      "iam-refresh-token": "Bearer eyJhbGcesTJI....UzI1NiIs",
    },
```

If your client platform is `browser` or `browser-dev,` access and refresh tokens are automatically sent by your browser in cookies. You don't have to concern yourself with them.

#### Logout user

To logout, send a POST request to `/api/iam/authn/logout`.

##### Request

```
const response = await $fetch("/api/iam/authn/logout", {
    method: "POST",
    headers: {
      "client-platform": ['app']|['browser']|['browser-dev'],
    },
  });
```

If your client platform is `browser` or `browser-dev`, Nuxt IAM will delete your access and refresh tokens and deactivate your refresh tokens in the database, and you will be immediately logged out of the system.
If your client platform is `app`, Nuxt IAM will deactivate your refresh tokens in the database. You will be logged out as soon as your access token expires.
Logging out immediately is not possible because JSON web tokens cannot be revoked once given. We cannot revoke access tokens once given. However, the access token expires in 15 minutes,
so 15 minutes is the maximum amount of time that a user on client platform `app` will be logged out but still be able to access resources.

##### Response

```
"status": "success"
```

#### isAuthenticated

To check if the current user is authenticated,

##### Request

```
const { status, error } = await $fetch("/api/iam/authn/isauthenticated", {
    headers: {
      "client-platform": ['app']|['browser']|['browser-dev'],
    },
  });
```

##### Response

If user is authenticated,

```
"status": "success"
```

or if user is not authenticated, or an error occurred.

```
"status": "fail"
```

#### Get user profile

An authenticated user can get their profile.

##### Request

```
const response = await $fetch("/api/iam/authn/profile", {
    headers: {
      "client-platform": ['app']|['browser']|['browser-dev'],
    },
  });
```

##### Response

Password is shown as `[hidden]` even though it is one-way hashed using argon 2. We just don't display the hash because the has looks quite ugly :P

```
"status": "success",
    "data": {
        "id": 25,
        "uuid": "3b3b616e-3ac7-4f6f-a0fb-5825c46d24d0",
        "email": "jeremy@example.com",
        "password": "[hidden]",
        "avatar": null,
        "permissions": null,
        "first_name": "Jeremy",
        "last_name": "Mwangelwa",
        "role": "GENERAL",
        "email_verified": false,
        "is_active": true,
        "last_login": "2023-01-27T16:30:15.000Z",
        "created_at": "2023-01-26T21:05:08.000Z",
        "deleted_at": null
    }
```

#### Update user profile

An authenticated user can update their profile. To update password, you must supply both "current_password" and "new_password." 8 characters, an upper-case letter, and a lower-case letter, a number, and a non-alphanumeric character.

##### Request

```
const response = await $fetch("/api/iam/authn/update", {
    headers: {
      "client-platform": ['app']|['browser']|['browser-dev'],
    },
    body: {
      "uuid": "3b3b616e-3ac7-4f6f-a0fb-5825c46d24d0",
      "first_name" : "Jeremy Man",
      "last_name" : "Manna",
      "current_password": "MyExamplePassword123*",
      "new_password": "MyExampleUpdatedPassword123*",
    },
  });
```

##### Response

```
"status": "success",
    "data": {
        "id": 25,
        "uuid": "3b3b616e-3ac7-4f6f-a0fb-5825c46d24d0",
        "email": "jeremy@example.com",
        "password": "[hidden]",
        "avatar": null,
        "permissions": null,
        "first_name": "Jeremy Man",
        "last_name": "Manna",
        "role": "GENERAL",
        "email_verified": false,
        "is_active": true,
        "last_login": "2023-01-27T16:30:15.000Z",
        "created_at": "2023-01-26T21:05:08.000Z",
        "deleted_at": null
    }
```

#### Delete user profile / account

An authenticated user can delete their profile.

##### Request

```
  const response = await $fetch("/api/iam/authn/delete", {
    method: "DELETE",
    headers: {
      "client-platform": ['app']|['browser']|['browser-dev'],
    },
    body: {
      uuid: "3b3b616e-3ac7-4f6f-a0fb-5825c46d24d0",
    },
  });

```

##### Response

```
"status": "success",
```

#### Reset user password

A user can reset their password. An email is required and you need to have set up email transporting utilities. Nuxt IAM supports Nodemailer services, Nodemailer SMTP, and Sendgrid API. Please see .env for configuration.

##### Request

```
  const response = await $fetch("/api/iam/authn/reset", {
    method: "POST",
    headers: {
      "client-platform": ['app']|['browser']|['browser-dev'],
    },
    body: {
      email: email,
    },
  });

```

##### Response

For security purposes, response is always success.

```
"status": "success",
```

#### ADVANCED Verify password reset flow

For a good example or starting point, use the provided pages for your Nuxt front end.

## Features

Nuxt IAM adds the following to your app:

### Backend

We add the following endpoints to the backend.

#### Authentication

- ✔️ user registration endpoint
- ✔️ user email verification endpoint
- ✔️ user verify email token endpoint
- ✔️ user login endpoint
- ✔️ user get profile endpoint
- ✔️ user isAuthentiated endpoint
- ✔️ user refresh tokens endpoint
- ✔️ user profile update endpoint
- ✔️ user logout endpoint
- ✔️ user password reset endpoint
- ✔️ user password reset verification endpoint
- ✔️ user get profile/account delete endpoint

- user login endpoint
- user password reset endpoint

## Getting Started from Scratch

The fastest way to get started is to clone the repo or use the npm `npm i nuxt-iam` or `yarn add nuxt-iam` or `npx nuxt-iam` command. This will add a fresh Nuxt 3 installation with the authentication and authorization logic already there.

## Adding Nuxt IAM to an existing Nuxt app

Add content here

## Backend for Frontend Concept

Nuxt IAM uses a backend for frontend pattern to provide security with best practices for your app. That means that we modify security slightly depending on whether the request is coming from a browser or a non-browser content. If the request is from a browser, Nuxt IAM uses cookies

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## API Routes

The following are API routes that Nuxt IAM adds to your app.

### Register user

To register a user, send a POST request to `/api/iam/authn/register`.

```
const response = await $fetch("/api/iam/authn/register", {
    method: "POST",
    headers: {
      "client-platform": clientPlatform,
    },
    body: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    },
  });
```

### Login user
