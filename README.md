# Nuxt IAM - Identity and Access Management for Nuxt

Nuxt IAM adds authentication and authorization to Nuxt apps. Nuxt IAM was built to help you get up and running with authentication and authorization best practices quickly. It is a full featured Nuxt 3 app.

To learn more about Nuxt 3, look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## How it Works

Nuxt IAM adds authentication and authorization components, pages, api routes, and logic to your Nuxt app allowing your app to have authentication and authorization logic.

## Getting Started from Scratch

The fastest way to get started is to clone the repo or use the npm ``` npm i nuxt-iam ``` or ``` yarn add nuxt-iam ``` or ``` npx nuxt-iam ``` command. This will add a fresh Nuxt 3 installation with the authentication and authorization logic already there.

## Adding Nuxt IAM to an existing Nuxt app

Add content here

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
To register a user, send a POST request to ``` /api/iam/authn/register ```.
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
