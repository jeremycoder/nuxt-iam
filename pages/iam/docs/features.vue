<template>
  <div>
    <h1 id="features">Features</h1>
    <p>
      The following are some of the features of Nuxt IAM. This page assumes you
      are using all the features of Nuxt IAM. If you&#39;re looking for API
      routes, please go to
      <NuxtLink to="/iam/docs/backend">backend</NuxtLink> documentation.
    </p>
    <h2 id="user-registration">User Registration</h2>
    <p>
      Nuxt IAM comes with pages and an api that allow you to register a user.
    </p>
    <h3 id="local-registration">Local registration</h3>
    <p>
      To register a user locally, that is using <strong>email</strong> and
      <strong>password</strong> , navigate to the page
      <code>/iam/register</code>. See a
      <a href="https://nuxt-iam.vercel.app/iam/register">live example</a>
    </p>
    <h3 id="verify-user-email">Verify user email</h3>
    <p>
      To verify user email registration, you need to go to your
      <strong>.env</strong> file, setup your email sender, and set the
      <strong>.env</strong> variable
      <code>IAM_VERIFY_REGISTRATIONS=&quot;true&quot;</code>. Please see
      <NuxtLink to="iam/docs/configuration">Configuration</NuxtLink> for setting
      up your email sender.
    </p>
    <h3 id="google-registration">Google registration</h3>
    <p>
      To register using Google, you&#39;ll need to have already set up your
      <a href="https://developers.google.com/identity/gsi/web/guides/overview"
        >Google console</a
      >
      app and obtained your credentials. It&#39;s free. You&#39;ll need your
      <strong>Google client id.</strong>
    </p>
    <p>
      Then set your <strong>.env</strong> variables
      <code>IAM_ALLOW_GOOGLE_AUTH=&quot;true&quot;</code> and
      <code>IAM_GOOGLE_CLIENT_ID=&quot;12345&quot;</code>. The 12345 represents
      your Google client id.
    </p>
    <p>
      After that, navigate to the <code>/iam/login</code> page, and click the
      Google button. See a
      <a href="https://nuxt-iam.vercel.app/iam/login">live example</a>
    </p>
    <h2 id="user-login">User login</h2>
    <p>
      Nuxt IAM comes with pages and an api that allow you to login as a user.
    </p>
    <h3 id="local-login">Local login</h3>
    <p>
      To login as a user locally, that is using <strong>email</strong> and
      <strong>password</strong> , navigate to the page <code>/iam/login</code>.
      See a <a href="https://nuxt-iam.vercel.app/iam/login">live example</a>
    </p>
    <h3 id="google-login">Google login</h3>
    <p>
      To login using Google, navigate to the <code>/iam/login</code> page, and
      click the Google button. Nuxt IAM will create an account for you using
      data from your Google account. See a
      <a href="https://nuxt-iam.vercel.app/iam/login">live example</a>
    </p>
    <h2 id="user-password-reset">User password reset</h2>
    <p>
      For this feature to work, you need to
      <strong>configure your email sender</strong>. Please see
      <NuxtLink to="iam/docs/configuration">Configuration</NuxtLink>. If you
      forget your password, navigate to the page <code>/iam/reset</code>. See a
      <a href="https://nuxt-iam.vercel.app/iam/reset">live example</a>.
    </p>
    <h2 id="user-dashboard">User dashboard</h2>
    <p>
      After you have successfully logged in, you&#39;ll be taken to your
      dashboard. See a
      <a href="https://nuxt-iam.vercel.app/iam/dashboard">live example</a>
    </p>
    <h2 id="user-profile">User profile</h2>
    <p>
      The user profile is a child page of the dashboard and contains basic
      information about your user account. It allows you to change some
      information about yourself.
    </p>
    <h2 id="user-settings">User settings</h2>
    <p>
      The user settings allow you to change your password and delete your
      account. Deleting your account will permanently delete your account and
      remove all associated data. Soft deletes have <strong>not</strong> been
      implemented yet.
    </p>
    <h2 id="user-logout">User logout</h2>
    <p>
      Clicking the user log out link will log you out of your profile area. This
      removes all cookies and deactivates your refresh token so that you&#39;ll
      need to log in to get back into your account.
    </p>
    <h2 id="admin-area">Admin area</h2>
    <p>
      The admin area is an area in the profile that is reserved for user
      administration. Nuxt IAM is designed to allow you to configure it how you
      want.
    </p>
    <h3 id="no-automatic-admin-access">No automatic admin access</h3>
    <p>
      All users who register with Nuxt IAM <strong>do not</strong> have access
      to the admin area. Nuxt IAM does not follow the policy of the first
      registered user automatically getting administrator rights as this is
      considered unsafe because a bad actor can assume that the very first
      record in the database belongs to the admin user.
    </p>
    <p>
      The <strong>only</strong> way to get admin access if you&#39;re the
      <strong>first user</strong>, is to modify your record in the database. To
      get admin access, add this value to your
      <strong>permissions field</strong> in the <strong>users table</strong>:
      <code>canAccessAdmin</code>. Any person who has that has
      <code>canAccessAdmin</code> in their permissions field, will be able to
      access the admin area.
    </p>
    <p>
      After you have admin access, you can give any user admin access as well by
      modifying their record.
    </p>
    <h3 id="roles-and-permissions">Roles and permissions</h3>
    <p>
      Nuxt IAM has a few roles and permissions. Nuxt IAM uses both role-based
      access control and attribute-based access control. Nuxt IAM has three
      types of roles: <code>SUPER_ADMIN</code>, <code>ADMIN</code>, and
      <code>GENERAL</code>.
    </p>
    <h4 id="roles">Roles</h4>
    <p>Nuxt IAM comes with three basic roles.</p>
    <ul>
      <li>
        <code>SUPER_ADMIN</code>: Is required to perform access the
        <NuxtLink to="iam/docs/backend">users API</NuxtLink>, and is considered
        to be the most privileged role.
      </li>
      <li>
        <code>ADMIN</code>: Has no privileges. You may add privileges if you
        desire.
      </li>
      <li>
        <code>GENERAL</code>: Is considered to have the lowest level privilege.
        A user with this role, can only only access their account.
      </li>
    </ul>
    <h4 id="permissions">Permissions</h4>
    <p>
      The only permission that comes with Nuxt IAM is
      <code>canAccessAdmin</code>. Any user with this permission can access the
      admin area.
    </p>
    <p>
      <strong>The </strong>most privileged<strong>
        user is the one has a role of <code>SUPER_ADMIN</code> </strong
      >and<strong>
        has <code>canAccessAdmin</code> permission attribute.</strong
      >
      When you add more permission attributes, separate them by commas. For
      example <code>canAccessAdmin, hasDeleteAuthority, canRemoveUser</code>.
    </p>
    <h2 id="admin-user-management">Admin user management</h2>
    <p>
      When a user who has admin access log in, they can view all users, add
      users, modify user data, and delete users.
    </p>
    <h2 id="admin-token-management">Admin token management</h2>
    <p>
      A user with admin access can also remove individual refresh tokens from
      users. Removing a refresh token means that that user will not be able to
      have their tokens automatically refreshed and will need to log in once
      their access token expires. A user with admin access can also remove all
      refresh tokens. This is considered a safety measure. Removing all refresh
      tokens will force <strong>every user in the system</strong> to
      reauthenticated (login) once their access token expires. Access tokens
      last only 15 minutes.
    </p>
    <h2 id="typescript">TypeScript</h2>
    <p>
      Most of Nuxt IAM is written in TypeScript. The Vue components are mostly
      written in JavaScript.
    </p>
    <h2 id="bootstrap">Bootstrap</h2>
    <p>
      Nuxt IAM uses
      <a href="https://getbootstrap.com/docs/5.0/getting-started/introduction/"
        >Bootstrap 5</a
      >
      CSS framework, and some other lower versions of Bootstrap for its frontend
      needs. You don&#39;t have to use Bootstrap. You&#39;re welcome to use any
      CSS framework you need. Nuxt IAM may change to another CSS framework in
      the future.
    </p>
    <p>
      Bootstrap was chosen because most of it can be run from a simple CDN call.
      All pages or components that run Bootstrap call it on the page alone. The
      CSS framework is not added in the Node modules so that it does not
      intefere with other frameworks you may want to use such as Tailwind.
    </p>
    <p>
      Calling Bootstrap from each page is not the most efficient way of using a
      CSS framework, but it allows Nuxt IAM to remain isolated from the rest of
      your app, and not interfere with already installed CSS frameworks you may
      have.
    </p>
  </div>
</template>
