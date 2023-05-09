<template>
  <div>
    <h1>Getting Started</h1>
    <p>
      Nuxt IAM is a Nuxt application and comes ready to run. All you need to add
      is a database.
    </p>
    <ol>
      <li>
        Please install <a href="https://nodejs.org">Node</a> if you don't
        already have it. The recommended Node version is
        <strong>Node 16.16 or greater.</strong>
      </li>
      <li>
        Please install <a href="https://yarnpkg.com/">Yarn package manager</a>.
        (You can also use npm if you like, but we prefer Yarn)
      </li>
      <li>
        Clone, fork, or download the repo from
        <code>https://github.com/jeremycoder/nuxt-iam</code>, and navigate to
        the root directory.
      </li>
      <li>
        Copy the <code>.env.example</code> file and create a
        <code>.env</code> file
      </li>
      <li>Run <code>yarn</code> or <code>yarn install</code>.</li>
      <li>
        Add your database information to your <code>.env</code> file. Nuxt IAM
        curently supports MySQL, but can be modified to support other databases.
        See
        <a
          href="https://www.prisma.io/docs/reference/database-reference/connection-urls"
          >Prisma</a
        >
        for more information.
      </li>
      <li>
        Connect your app to your database by running
        <code>npx prisma migrate dev</code>. Name your migration
        <code>initial_migration</code> or something similar
      </li>
      <li>Run <code>yarn dev</code>, and you're good to go!</li>
    </ol>

    <p>
      More <NuxtLink to="/iam/docs/configuration">configuration</NuxtLink> is
      required if you need to send emails and use Google authentication.
    </p>

    <p>
      Learn more about how Nuxt IAM works by looking at the
      <NuxtLink to="/iam/docs/concepts">concepts.</NuxtLink>
    </p>
  </div>
</template>
