# nuxt-iam - Nuxt authentication framework

Nuxt IAM, which stands for Nuxt Identity and Access Management, is an authentication and authorization framework for Nuxt that allows you to secure your app with industry best practices. Nuxt IAM, adds authentication and authorization logic to your Nuxt app.

See a fully functional [example app](https://nuxt-iam.vercel.app/iam/).

https://user-images.githubusercontent.com/7818102/215188979-fe272b3f-ef3a-4b8d-9cfc-0dedd6edb911.mp4

Nuxt IAM is a Nuxt app that contains the following authentication and authorization features:

- ✔️ user registration with email and password
- ✔️ user login with email and password
- ✔️ user login/registration with Google
- ✔️ user password reset
- ✔️ user dashboard
- ✔️ user password change
- ✔️ user profile/account delete
- ✔️ admin user management
- ✔️ admin token management

It is a full featured Nuxt 3 app.

For full documentations, go to [Nuxt IAM documentation](https://nuxt-iam.vercel.app/iam/)

## How it Works

Simple clone the [Github repo](https://github.com/jeremycoder/nuxt-iam), fork it, or download it.

## Getting Started

Check out the sample app here: https://nuxt-iam.vercel.app/iam/

For documentation: https://nuxt-iam.vercel.app/iam/docs

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

For full documentations, go to [Nuxt IAM documentation](https://nuxt-iam.vercel.app/iam/docs)
