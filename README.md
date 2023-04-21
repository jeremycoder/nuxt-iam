# nuxt-iam - Nuxt authentication framework

## Download from **[Github](https://github.com/jeremycoder/nuxt-iam)** NOT npm.

Nuxt IAM, which stands for Nuxt Identity and Access Management, is an authentication and authorization framework for Nuxt that allows you to secure your app with industry best practices. Nuxt IAM, adds authentication and authorization logic to your Nuxt app.

See a fully functional [example app](https://nuxtiam.com/).

https://user-images.githubusercontent.com/7818102/224216154-9b8672e0-f195-4d41-aa15-3b268d65b214.mp4

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

Simply clone the [Github repo](https://github.com/jeremycoder/nuxt-iam), fork it, or download it.

## Getting Started

Nuxt IAM is a Nuxt application and comes ready to run. All you need to add is a database.

1.  Please install [Node](https://nodejs.org) if you don't already have it. The recommended Node version is **16.16 or greater**
2.  Please install [Yarn package manager](https://yarnpkg.com/). (You can also use npm if you like, but we prefer Yarn)
3.  Clone, fork, or download the repo from `https://github.com/jeremycoder/nuxt-iam`, and navigate to the root directory.
4.  Copy the `.env.example` file and create a `.env` file
5.  Run `yarn` or `yarn install`.
6.  Add your database information to your `.env` file. Nuxt IAM curently supports MySQL, but can be modified to support other databases. See [Prisma](https://www.prisma.io/docs/reference/database-reference/connection-urls) for more information.
7.  Connect your app to your database by running `npx prisma migrate dev`. Name your migration `initial_migration` or something similar
8.  Run `yarn dev`, and you're good to go!

More [configuration](https://nuxt-iam.vercel.app/iam/docs/configuration) is required if you need to send emails and use Google authentication.

Learn more about how Nuxt IAM works by looking at the [concepts](https://nuxt-iam.vercel.app/iam/docs/concepts).

Check out the sample app here: https://nuxt-iam.vercel.app/iam/

For documentation: https://nuxt-iam.vercel.app/iam/docs
