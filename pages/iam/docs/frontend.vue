<template>
  <div>
    <h1 id="frontend">Frontend</h1>
    <p>
      The following is en explanation of some of the logic and components of
      Nuxt IAM frontend.
    </p>
    <h2 id="pages">Pages</h2>
    <p>
      Nuxt IAM adds several pages to your apps frontend. The pages are wrappers
      around components. Use these pages and components as is, or as starting
      points for making your app great. The following routes are added to your
      Nuxt front end. Find them in your <strong>pages</strong> directory:
    </p>
    <ul>
      <li><strong>iam</strong>: Parent directory for all pages</li>
      <li><strong>iam/index</strong>: Introductory page for Nuxt IAM</li>
      <li>
        <strong>iam/register</strong>: User registration page. After successful
        registration, you will be directed to login page
      </li>
      <li>
        <strong>iam/verifyemail</strong>: If email verification was set to true,
        (see configuration section), receives email verification token and sends
        it to backend for verification.
      </li>
      <li>
        <strong>iam/login</strong>: User login page. After successful login, you
        will be directed to iam/dashboard/index
      </li>
      <li><strong>iam/dashboard/index</strong>: User dashboard.</li>
      <li>
        <strong>iam/dashboard/profile</strong>: User profile. User can update
        their account.
      </li>
      <li>
        <strong>iam/dashboard/settings</strong>: User settings. User can update
        their password and delete their account.
      </li>
      <li>
        <strong>iam/reset</strong>: User can reset their password. Does not have
        to be logged in. User will receive an email with a one-time password
        reset token.
      </li>
      <li>
        <strong>iam/verify</strong>: Page that receives password reset token and
        sends it to backend for verification
      </li>
      <li>
        <strong>iam/verifyfailed</strong>: Displays email or password
        verification failure.
      </li>
      <li>
        <strong>iam/verifysuccessful</strong>: Displays password verification
        success and a temporary password.
      </li>
    </ul>
    <h2 id="components">Components</h2>
    <p>
      Nuxt IAM adds the following components to your Nuxt application. Most of
      the components are wrapped in pages.
    </p>
    <ul>
      <li><strong>iamAdmin</strong>: Deals with user administration</li>
      <li>
        <strong>iamDashboard</strong>: Contains dashboard user interface and
        logic such as checking if user is logged in, and email verification.
        Also acts as the layout wrapper for other pages.
      </li>
      <li>
        <strong>iamLogin</strong>: Contains login UI (user interface) and logic
      </li>
      <li>
        <strong>iamRegister</strong>: Frontend user registration component
      </li>
      <li><strong>iamReset</strong>: Frontend user password reset component</li>
      <li>
        <strong>iamVerifyEmailToken</strong>: Verifies if token sent in email
        verification is valid
      </li>
      <li>
        <strong>iamVerifyFailed</strong>: Component that notifies user is email
        verification token or password verification token failed
      </li>
      <li>
        <strong>iamVerifyPasswordReset</strong>: Receives password verification
        token from email
      </li>
      <li>
        <strong>iamVerifySuccessful</strong>: Notifies user if password reset
        was successful
      </li>
    </ul>
    <h2 id="composables">Composables</h2>
    <p>
      Nuxt IAM uses composables as a bridge between the frontend and the
      backend. We recommend using composables as well. Composables contain the
      functions that send data to the API, and receive data from the API.
    </p>
    <p>Backend &lt;--- composables &lt;--- Frontend</p>
    <p>Backend ---&gt; composables ---&gt; Frontend</p>
    <ul>
      <li>
        <strong>useIam</strong>: Contains functions and logic for authentication
        such as user registration, logging in, checking if user is authenticated
        etc.
      </li>
      <li>
        <strong>useIamAdmin</strong>: Contains functions and logic for user
        administration.
      </li>
    </ul>
  </div>
</template>
