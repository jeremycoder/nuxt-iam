<template>  
    <div class="container px-4 my-5 py-5 border shadow-lg" id="icon-grid">
      <h1 id="configuration">Configuration</h1>
<p>Here&#39;s how to configure Nuxt IAM. Every time you change your environment variables either in <strong>nuxt.config.ts</strong> or <strong>.env</strong> file, you&#39;ll need to <strong>restart</strong> your application.</p>
<h2 id="nuxt-config-ts">nuxt.config.ts</h2>
<p>The following variables are required in your Nuxt configuration file (nuxt.config.ts). The variables link to the variables in your .env file. Please copy and paste the variables into your <strong>nuxt.config.ts</strong> file.</p>
<pre><code>// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //...
  <span class="hljs-attribute">runtimeConfig</span>: {
    // IAM token secrets. Please rotate every 2 - 4 weeks
    iamAccessTokenSecret: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_ACCESS_TOKEN_SECRET</span>,
    iamRefreshTokenSecret: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_REFRESH_TOKEN_SECRET</span>,
    iamResetTokenSecret: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_RESET_TOKEN_SECRET</span>,
    iamVerifyTokenSecret: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_VERIFY_TOKEN_SECRET</span>,

    // Public Url
    iamPublicUrl: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_PUBLIC_URL</span>,

    // IAM Emailer
    iamEmailer: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_EMAILER</span>,

    // nodemailer-service
    iamNodemailerService: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_NODEMAILER_SERVICE</span>,
    iamNodemailerServiceSender: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_NODEMAILER_SERVICE_SENDER</span>,
    iamNodemailerServicePassword: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_NODEMAILER_SERVICE_PASSWORD</span>,

    // nodemailer-smtp
    iamNodemailerSmtpHost: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_NODEMAILER_SMTP_HOST</span>,
    iamNodemailerSmtpPort: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_NODEMAILER_SMTP_PORT</span>,
    iamNodemailerSmtpSender: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_NODEMAILER_SMTP_SENDER</span>,
    iamNodemailerSmtpPassword: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_NODEMAILER_SMTP_PASSWORD</span>,

    // IAM SendGrid
    iamSendGridApiKey: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_SENDGRID_API_KEY</span>,
    iamSendgridSender: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_SENDGRID_SENDER</span>,

    // GOOGLE CLIENT ID
    iamGoogleClientId: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_GOOGLE_CLIENT_ID</span>,

    // Do not put secret information here
    public: {
      iamClientPlatform: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_CLIENT_PLATFORM</span>,
      iamVerifyRegistrations: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_VERIFY_REGISTRATIONS</span>,
      iamAllowGoogleAuth: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_ALLOW_GOOGLE_AUTH</span>,
    },
  },

  modules: ["nuxt-vue3-google-signin"],
  googleSignIn: {
    clientId: process<span class="hljs-variable">.env</span><span class="hljs-variable">.IAM_GOOGLE_CLIENT_ID</span>,
  },
  //...
});
</code></pre><h2 id="-env-file">.env file</h2>
<p>Below is an example of a .env file that contains the necessary variables for Nuxt IAM to work properly. Please add the following variables to your <strong>.env</strong> file.</p>
<pre><code><span class="hljs-comment"># Environment variables declared in this file are automatically made available to Prisma.</span>
<span class="hljs-comment"># See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema</span>

<span class="hljs-comment"># Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.</span>
<span class="hljs-comment"># See the documentation for all the connection string options: https://pris.ly/d/connection-strings</span>

<span class="hljs-comment"># PRISMA DATABASE</span>
<span class="hljs-attr">DATABASE_URL</span>=<span class="hljs-string">"mysql://dbuser:dbpassword@dbserver:dbport/dbname"</span>

<span class="hljs-comment"># NUXT IAM TOKEN SECRETS (Please change them every 2 - 4 weeks)</span>
<span class="hljs-comment"># Can use in node 'crypto.randomBytes(64).toString('hex')'</span>
<span class="hljs-attr">IAM_ACCESS_TOKEN_SECRET</span>=<span class="hljs-string">"fa85424538b2878a7785a703d168fc58550c8ef3a02c23b8aee5f8adf98159b218296926d37164db8ed48d28a73c01387cf4fd0032e7e76858e71a09b2b82c88"</span>
<span class="hljs-attr">IAM_REFRESH_TOKEN_SECRET</span>=<span class="hljs-string">"c36f673adcbfe27859867697d6c98430c3757d3eafb7bca3fe90fe349baa9d88ec10932aba5da22f37264c2c2bd31404e5a22822be6f054ec9d40a56b28b97e1"</span>
<span class="hljs-attr">IAM_RESET_TOKEN_SECRET</span>=<span class="hljs-string">"a67102c7d684ad370409855fe3e7a65f9f9ccffeb82b0d53fe328c66a1405b03737da79a4dd42266a5a83ea9826421b9b031703337be5fd1e1eac0feb1ae2166"</span>
<span class="hljs-attr">IAM_VERIFY_TOKEN_SECRET</span>=<span class="hljs-string">"823459ed2ed1d80df1aedd3a5c03f1ee6132c20a076270d63d89e06c6b0f4fb7299991610f17dde4930b54432a6cf7b8d13b6da08b9f89bb8b30bb2c46c37f9e"</span>

<span class="hljs-comment"># NUXT IAM</span>
<span class="hljs-comment"># If using a browser like your Nuxt app, use 'browser' for production</span>
<span class="hljs-comment"># If using a browser like your Nuxt app, use 'browser-dev' for development</span>
<span class="hljs-comment"># If you're not using a browser, then use 'app'</span>
<span class="hljs-attr">IAM_CLIENT_PLATFORM</span> = <span class="hljs-string">"browser"</span>

<span class="hljs-attr">IAM_PUBLIC_URL</span>=<span class="hljs-string">"http://localhost:3000"</span>

<span class="hljs-comment"># NUXT IAM EMAIL</span>
<span class="hljs-comment"># nodemailer-service, nodemailer-smtp, sendgrid</span>
<span class="hljs-attr">IAM_EMAILER</span>=<span class="hljs-string">"nodemailer-smtp"</span>

<span class="hljs-comment"># nodemailer-service</span>
<span class="hljs-attr">IAM_NODEMAILER_SERVICE</span>=<span class="hljs-string">"hotmail"</span>
<span class="hljs-attr">IAM_NODEMAILER_SERVICE_SENDER</span>=<span class="hljs-string">"myusername@outlook.com"</span>
<span class="hljs-attr">IAM_NODEMAILER_SERVICE_PASSWORD</span>=<span class="hljs-string">"myExcellentPassword767*"</span>

<span class="hljs-comment"># nodemailer-smtp</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_HOST</span>=<span class="hljs-string">"mysmtp.host"</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_PORT</span>=<span class="hljs-string">"465"</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_SENDER</span>=<span class="hljs-string">"myname@mydomain.com"</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_PASSWORD</span>=<span class="hljs-string">"myAmazingPassword753$"</span>

<span class="hljs-comment"># SENDGRID API KEY</span>
<span class="hljs-attr">IAM_SENDGRID_API_KEY</span>=<span class="hljs-string">"12345678901234567890"</span>
<span class="hljs-attr">IAM_SENDGRID_SENDER</span>=<span class="hljs-string">"myname@mysendgridaccount.com"</span>

<span class="hljs-comment"># NUXT IAM VERIFY REGISTRATIONS</span>
<span class="hljs-attr">IAM_VERIFY_REGISTRATIONS</span>=<span class="hljs-string">"false"</span>

<span class="hljs-comment"># IAM GOOGLE CLIENT ID</span>
<span class="hljs-attr">IAM_ALLOW_GOOGLE-AUTH</span>=<span class="hljs-string">"true"</span>
<span class="hljs-attr">IAM_GOOGLE_CLIENT_ID</span>=<span class="hljs-string">"123...com"</span>
</code></pre><h2 id="environment-variables-explained">Environment Variables Explained</h2>
<p>The following environment variables exist in Nuxt IAM to help it work properly. Edit the <strong>.env</strong> file. Never commit the .env to a public repository like Github.</p>
<h3 id="prisma-database-connection">Prisma database connection</h3>
<pre><code><span class="hljs-comment"># PRISMA DATABASE</span>
<span class="hljs-attr">DATABASE_URL</span>=<span class="hljs-string">"mysql://dbuser:dbpassword@dbserver:dbport/dbname"</span>
</code></pre><p>Nuxt IAM uses <a href="https://prisma.io">Prisma</a> as its object relational mapper. A database is required in order for Nuxt IAM to work properly. This line tells prisma the name of the database and how to log into it. For more information on Prisma database connections, please see <a href="https://www.prisma.io/docs/reference/database-reference/connection-urls">Prisma database connections</a></p>
<p>Please replace the following variables with your own database&#39;s variables.</p>
<ul>
<li><code>mysql</code>: The database software. Prisma supports other database connections.</li>
<li><code>dbuser</code>: The database user</li>
<li><code>dbpassword</code>: The database password</li>
<li><code>dbserver</code>: The database server</li>
<li><code>dbport</code>: The database port</li>
<li><code>dbname</code>: The database name</li>
</ul>
<h3 id="token-secrets">Token secrets</h3>
<pre><code><span class="hljs-comment"># NUXT IAM TOKEN SECRETS (Please change them every 2 - 4 weeks)</span>
<span class="hljs-comment"># Can use in node 'crypto.randomBytes(64).toString('hex')'</span>
<span class="hljs-attr">IAM_ACCESS_TOKEN_SECRET</span>=<span class="hljs-string">"..."</span>
<span class="hljs-attr">IAM_REFRESH_TOKEN_SECRET</span>=<span class="hljs-string">"..."</span>
<span class="hljs-attr">IAM_RESET_TOKEN_SECRET</span>=<span class="hljs-string">"..."</span>
<span class="hljs-attr">IAM_VERIFY_TOKEN_SECRET</span>=<span class="hljs-string">"..."</span>
</code></pre><p>All Nuxt IAM JSON web tokens (JWT) are signed. Nuxt IAM uses randomly generated secret strings to sign the tokens. Nuxt IAM recommends that you use a minimum string of <strong>64 randomly-generated cryptographically-secure</strong> characters. Please run this code in Node to generate a random hexadecimal string <code>crypto.randomBytes(64).toString(&#39;hex&#39;)</code>. We recommend that you change all your secrets every <strong>2 - 4 weeks.</strong></p>
<p>Changing your secrets will force every user to <strong>reauthenticate</strong> regardless of the status of their active or refresh tokens.</p>
<ul>
<li><code>IAM_ACCESS_TOKEN_SECRET=&quot;...</code>: Secret string used to create access tokens.</li>
<li><code>IAM_REFRESH_TOKEN_SECRET=&quot;...&quot;</code>: Secret string used to create refresh tokens.</li>
<li><code>IAM_RESET_TOKEN_SECRET=&quot;...&quot;</code>: Secret string used to create refresh tokens.</li>
<li><code>IAM_VERIFY_TOKEN_SECRET=&quot;...&quot;</code> : Secret string used to verify tokens.</li>
</ul>
<h3 id="public-url">Public Url</h3>
<ul>
<li><code>IAM_PUBLIC_URL=&quot;http://localhost:3000&quot;</code>: Url used when sending emails. <code>http://localhost:3000</code> is used as an example. Add the correct url for your application.</li>
</ul>
<h3 id="email-configuration">Email configuration</h3>
<p>Nuxt IAM supports sending emails.</p>
<pre><code><span class="hljs-comment"># NUXT IAM EMAIL</span>
<span class="hljs-comment"># nodemailer-service, nodemailer-smtp, sendgrid</span>
<span class="hljs-attr">IAM_EMAILER</span>=<span class="hljs-string">"nodemailer-smtp"</span>

<span class="hljs-comment"># nodemailer-service</span>
<span class="hljs-attr">IAM_NODEMAILER_SERVICE</span>=<span class="hljs-string">"hotmail"</span>
<span class="hljs-attr">IAM_NODEMAILER_SERVICE_SENDER</span>=<span class="hljs-string">"myusername@outlook.com"</span>
<span class="hljs-attr">IAM_NODEMAILER_SERVICE_PASSWORD</span>=<span class="hljs-string">"myExcellentPassword767*"</span>

<span class="hljs-comment"># nodemailer-smtp</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_HOST</span>=<span class="hljs-string">"mysmtp.host"</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_PORT</span>=<span class="hljs-string">"465"</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_SENDER</span>=<span class="hljs-string">"myname@mydomain.com"</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_PASSWORD</span>=<span class="hljs-string">"myAmazingPassword753$"</span>
</code></pre><h4 id="email-service">Email service</h4>
<p>Nuxt IAM supports three types of email services: <a href="https://nodemailer.com/smtp/well-known/">Nodemailer service</a>, <a href="https://nodemailer.com/smtp/">Nodemailer SMTP</a>, and <a href="https://sendgrid.com/">Sendgrid</a>.</p>
<pre><code><span class="hljs-comment"># nodemailer-service, nodemailer-smtp, sendgrid</span>
<span class="hljs-attr">IAM_EMAILER</span>=<span class="hljs-string">"nodemailer-smtp"</span>
</code></pre><p>Nuxt IAM needs to know which email service to use to send emails. You need to configure your email services before any features that require email can be used. Nuxt IAM uses email services to send email verification emails, and password reset emails.</p>
<ul>
<li><code>IAM_EMAILER=&quot;nodemailer-smtp&quot;</code>: Tells Nuxt IAM which email service to use. You can add <code>nodemailer-smtp</code>, <code>nodemailer-service</code>, or <code>sendgrid</code>. In the example, we have chosen <code>nodemailer-smtp</code>.</li>
</ul>
<h4 id="nodemailer-service">Nodemailer Service</h4>
<p>Below is an example of a properly configured email service using Nodemailer and Microsoft&#39;s Hotmail email service. Nodemailer is free to use, and you can get a free <code>outlook.com</code> account.</p>
<pre><code><span class="hljs-comment"># nodemailer-service</span>
<span class="hljs-attr">IAM_NODEMAILER_SERVICE</span>=<span class="hljs-string">"hotmail"</span>
<span class="hljs-attr">IAM_NODEMAILER_SERVICE_SENDER</span>=<span class="hljs-string">"myusername@outlook.com"</span>
<span class="hljs-attr">IAM_NODEMAILER_SERVICE_PASSWORD</span>=<span class="hljs-string">"myExcellentPassword767*"</span>
</code></pre><p>In the above example, you&#39;ll need to have the email address <code>myusername@outlook.com</code> and password <code>myExcellentPassword767*</code>. Make sure your email address is verified with Hotmail. Perhaps try to send and receive an email with your Hotmail account before using Nuxt IAM. For more information about Nodemailer, please see <a href="https://nodemailer.com/smtp/well-known/">Nodemailer services</a>.</p>
<h4 id="nodemailer-smtp">Nodemailer SMTP</h4>
<p>Below is an example of a properly configured email service using Nodemailer SMTP (simple mail transfer protocol). Nodemailer is free to use.</p>
<pre><code><span class="hljs-comment"># nodemailer-smtp</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_HOST</span>=<span class="hljs-string">"mysmtp.host"</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_PORT</span>=<span class="hljs-string">"465"</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_SENDER</span>=<span class="hljs-string">"myname@mydomain.com"</span>
<span class="hljs-attr">IAM_NODEMAILER_SMTP_PASSWORD</span>=<span class="hljs-string">"myAmazingPassword753$"</span>
</code></pre><p>To use <code>nodemailer-smtp</code> you&#39;ll need to have the email address with an SMTP host. If you have your own domain name, you can find this information with your web hosting provider. In the example above, <code>mysmtp.host</code> is the host, <code>465</code> is the port (very common port), <code>myname@domain.com</code> is the email address, <code>myAmazingPassword753$</code> is the password.</p>
<h4 id="sendgrid-email-service">Sendgrid Email service</h4>
<p>Nuxt IAM also supports <a href="https://sendgrid.com/">Sendgrid</a> for email services. To use Nuxt IAM with Sendgrid, you&#39;ll need to create an account with Sendgrid, have a verified sender email address, and an api key. Sendgrid has a free plan.</p>
<pre><code><span class="hljs-comment"># SENDGRID API KEY</span>
<span class="hljs-attr">IAM_SENDGRID_API_KEY</span>=<span class="hljs-string">"12345678901234567890"</span>
<span class="hljs-attr">IAM_SENDGRID_SENDER</span>=<span class="hljs-string">"myname@mysendgridaccount.com"</span>
</code></pre><p>In the example above, <code>12345678901234567890</code> is the Sendgrid api key, and <code>myname@mysendgridaccount.com</code> is the verified Sendgrid sender email. You&#39;ll need to have these configured before you can use Nuxt IAM for email.</p>
<h3 id="email-verification">Email verification</h3>
<p>Nuxt IAM allows you to add email verification to your application. After a user registers with your application, a user account is created. When the user logs in, if the email is not verified, the user will be prompted to click a button to verify their email. After the button is clicked, an email will be sent to the user&#39;s email address on file.</p>
<p>The user has 24 hours to verify their email address. The user will receive an email with <strong>one-time</strong> verification email link. After the email is verified, the user will be able to login and proceed to their account.</p>
<p>The link can only be verified <strong>one time</strong>. If the user attempts to verify again, verification will fail.</p>
<pre><code><span class="hljs-comment"># NUXT IAM VERIFY REGISTRATIONS</span>
<span class="hljs-attr">IAM_VERIFY_REGISTRATIONS</span>=<span class="hljs-string">"false"</span>
</code></pre><p>The example above allows you to ask for email verification at registration or not. <code>false</code> means that emails will not be verified. When a user registers with your application, they will be immediately sent to their user profile. Nuxt IAM recommends verifying all registrations. To verify all registrations, change your environment variable to <code>IAM_VERIFY_REGISTRATIONS=&quot;true&quot;</code>.</p>
<h3 id="using-google-to-register-login">Using Google to Register / Login</h3>
<p>Nuxt IAM allows you to use Google identification services to allow users to register and log in using their Google account. You&#39;ll need to have a <a href="https://developers.google.com/identity/gsi/web/guides/overview">Google console account</a> created with a client ID. If you already have an account, you should be able to create <a href="https://console.cloud.google.com/apis/credentials">credentials</a> as of February 15, 2023. You&#39;ll want the <strong>OAuth 2.0 Client IDs</strong> section.</p>
<p>If you upgrade a package in your Nuxt application, you might have to <a href="https://console.cloud.google.com/apis/credentials">change your Google client ID</a>, which is not hard to do at</p>
<h4 id="authorized-javascript-origins">Authorized JavaScript Origins</h4>
<p>Your authorized JavaScript origins should look similar to below. If using localhost, you&#39;ll need to have <strong>both</strong>:</p>
<ul>
<li><strong><a href="http://localhost:3000">http://localhost:3000</a></strong>, and</li>
<li><strong><a href="http://localhost">http://localhost</a></strong></li>
</ul>
<p>Here&#39;s an example of a production origin:</p>
<ul>
<li><strong><a href="https://nuxt-iam.vercel.app">https://nuxt-iam.vercel.app</a></strong></li>
</ul>
<h4 id="authorized-redirect-uri">Authorized Redirect URI</h4>
<p>The authorized rediret uri will need to <code>http://localhost:3000/iam/dashboard</code>.</p>
<p>Here&#39;s an example of a production authorized uri:</p>
<ul>
<li><strong><a href="https://nuxt-iam.vercel.app/iam/dashboard">https://nuxt-iam.vercel.app/iam/dashboard</a></strong></li>
</ul>
<p>Whatever domain name you use, the redirect uri must be <strong>/iam/dashboard</strong>.</p>
<pre><code><span class="hljs-comment"># IAM GOOGLE CLIENT ID</span>
<span class="hljs-attr">IAM_ALLOW_GOOGLE-AUTH</span>=<span class="hljs-string">"true"</span>
<span class="hljs-attr">IAM_GOOGLE_CLIENT_ID</span>=<span class="hljs-string">"123...com"</span>
</code></pre><p>The example above shows properly configured variables for using Google Identity Services. In the example, <code>IAM_ALLOW_GOOGLE-AUTH=&quot;true&quot;</code> means that this app will be using Google Identity Services. That means a Google Sign In button will appear on your login page. Setting <code>IAM_ALLOW_GOOGLE-AUTH=&quot;false&quot;</code> means that the you will not be using Google Identity Services, and the Google Sign In button will not be visible on the login button.</p>
<p><code>IAM_GOOGLE_CLIENT_ID=&quot;123...com&quot;</code> is the client id for your Google app.</p>
<h4 id="google-sign-in-nuxt-config-ts">Google Sign In .nuxt.config.ts</h4>
<p>You&#39;ll need to add the following to your <strong>nuxt.config.ts</strong> file to properly use Google Identity Services. If you copied the nuxt.config.ts variables, then you should already have this information in your nuxt.config.ts file.</p>
<pre><code><span class="hljs-selector-tag">export</span> <span class="hljs-selector-tag">default</span> <span class="hljs-selector-tag">defineNuxtConfig</span>({
  <span class="hljs-comment">//...</span>
  <span class="hljs-attribute">runtimeConfig</span>: {
    <span class="hljs-comment">//...</span>

    <span class="hljs-comment">// GOOGLE CLIENT ID</span>
    <span class="hljs-attribute">iamGoogleClientId</span>: process.env.IAM_GOOGLE_CLIENT_ID,

    <span class="hljs-comment">// Do not put secret information here</span>
    <span class="hljs-attribute">public</span>: {
      <span class="hljs-comment">// ...</span>
      <span class="hljs-attribute">iamAllowGoogleAuth</span>: process.env.IAM_ALLOW_GOOGLE_AUTH,
      <span class="hljs-comment">//...</span>
    },
  },

  <span class="hljs-attribute">modules</span>: [<span class="hljs-string">"nuxt-vue3-google-signin"</span>],
  <span class="hljs-attribute">googleSignIn</span>: {
    <span class="hljs-attribute">clientId</span>: process.env.IAM_GOOGLE_CLIENT_ID,
  },
  <span class="hljs-comment">//...</span>
});
</code></pre><h2 id="error-reporting">Error reporting</h2>
<p>Nuxt IAM provides very little frontend error reporting, but provides extensive backend error reporting. If an error occurs, please check your your server console logs.</p>

    </div>    
</template>

<style scoped>
pre {
  background-color: #000;
  color: #fff;
  padding: 10px;
}
</style>