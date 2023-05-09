<template>
  <div>
    <div>
      <h1 id="concepts">Concepts</h1>
      <p>
        Understanding the following concepts will help you work with Nuxt IAM
        faster.
      </p>
      <h2 id="both-backend-and-frontend">Both Backend and Frontend</h2>
      <p>
        Nuxt IAM is both frontend and backend. The main authentication and
        authorization logic takes place in the backend. Nuxt IAM adds
        authentication and authorization components, pages, api routes, and
        logic to your Nuxt app allowing your app to have authentication and
        authorization logic. All the components, pages, api routes, and logic
        are 100% customizable so you can change things any way you want.
      </p>
      <h2 id="server">Server</h2>
      <p>
        Nuxt IAM uses Nuxt&#39;s server engine
        <a href="https://nuxt.com/docs/guide/concepts/server-engine">Nitro</a>
        and the entire backend is built on it. Nuxt IAM adds the following
        directories to your <strong>server/api</strong> directory.
      </p>
      <ul>
        <li><strong>iam/authn</strong>: authentication handler</li>
        <li><strong>iam/refresh-tokens</strong>: refresh tokens handler</li>
        <li><strong>iam/users</strong>: global users handler</li>
        <li>
          <strong>iam/doodads</strong>: an example api handler that you can use
          to copy and paste and quickly create api handlers of your own
        </li>
      </ul>
      <h2 id="backend-for-frontend">Backend for Frontend</h2>
      <p>
        Nuxt IAM uses the Backend For Frontend (BFF) architectural pattern to
        increase the security of your Nuxt application. A BFF pattern allows
        Nuxt IAM to provide the best security practices for any client. Nuxt IAM
        differentiates between two types of clients:
        <strong>browsers</strong> and <strong>apps</strong>. It does this by
        requiring that every request contain the
        <strong>client-platform</strong> header.
      </p>
      <p>
        Every client needs to send the <strong>client-platform</strong> header
        on every request.
      </p>
      <p>
        <code>client-platform</code> is a <strong>required</strong> header and
        it must be sent with every request. Client platform allows Nuxt IAM to
        provide the best practices for securing your app.
        <code>client-platform</code> must be:
      </p>
      <ul>
        <li>
          <strong><code>app</code></strong
          >: Use <code>app</code> if the request is coming from a non-browser
          such as a mobile app, tablet, or a tool like POSTMAN. Access and
          refresh tokens will be sent in the <strong>response headers</strong>.
          This is designed to be used in <strong>production</strong>.
        </li>
        <li>
          <strong><code>browser</code></strong
          >: Use <code>browser</code> if the request is coming from a browser.
          Access and refresh tokens will be sent in
          <strong>secure, httpOnly</strong> cookies. This is designed to be used
          in <strong>production</strong>.
        </li>
        <li>
          <strong><code>browser-dev</code></strong
          >: Use <code>browser-dev</code> if the request is coming from a
          browser in a <strong>development environment</strong>. Access and
          refresh tokens are sent in <strong>unsecure</strong> cookies. Use only
          in <strong>development.</strong>
        </li>
      </ul>
      <h2 id="database">Database</h2>
      <p>
        Nuxt IAM requires a database to operate successfully, and uses
        <a href="http://www.prisma.io">Prisma</a> as its object relation mapper
        (ORM). For database configuration, please see
        <a href="./configuration">Configuration</a>.
      </p>
      <h2 id="tokens">Tokens</h2>
      <p>
        Nuxt IAM uses signed JSON web tokens (JWT) as part of its security.
        There are two types of tokens used: <strong>access tokens</strong> and
        <strong>refresh tokens.</strong> Access tokens allow a user to access a
        restricted resource, and refresh tokens allow a user to get a new pair
        of tokens.
      </p>
      <h3 id="access-tokens">Access Tokens</h3>
      <p>
        Access tokens are JWT tokens that grant an authenticated user access to
        a particular resource. For example, if a user wants to access their
        profile, they need to login with their correct email and password
        combination. If successful, Nuxt IAM will create an access token and
        refresh token and send them back to the client.
      </p>
      <p>
        If the client is an <strong>app</strong>, the tokens will be sent in the
        header as <strong>iam-access-token</strong> for the access token, and
        <strong>iam-refresh-token</strong> for the refresh token.
      </p>
      <p>
        If the client is a <strong>browser</strong>, the tokens will be sent in
        cookies. If the client-platform is browser, the cookies will be secure,
        if the client-platform is browser-dev, the cookies will be unsecure.
      </p>
      <p>
        Access tokens expire every <strong>15 minutes</strong>. Once an access
        token expires, the client will be unable to access the resource, and
        will need to log in. New tokens can be obtained using a valid refresh
        token. If you use the pages provided by Nuxt IAM, your access and
        refresh tokens will be automatically replaced once Nuxt IAM detects that
        the access token has expired.
      </p>
      <p>If your refresh token expires, you must log in again.</p>
      <h3 id="refresh-tokens">Refresh Tokens</h3>
      <p>
        Refresh tokens are JWT tokens that are used to get new access and
        refresh tokens. They expire every <strong>14 days</strong>. If your
        access token expires, you&#39;ll need to login again. You can get a new
        set of access and refresh tokens when you send a POST request to
        <code>/api/iam/authn/refresh</code> with an unexpired refresh token. If
        your refresh token has expired, you will not be able to get a new set of
        tokens and you&#39;ll need to login.
      </p>
      <p>
        Every authenticated user can only have one active refresh token at a
        time.
      </p>
      <h4 id="automatic-token-rotation">Automatic token rotation</h4>
      <p>
        If your client platform is <code>browser</code> or
        <code>browser-only</code>, Nuxt IAM will automatically refresh your
        tokens if it detects that your access token has expired, and that your
        refresh token is not expired. When using a browser, you really don&#39;t
        have to concern yourself with tokens.
      </p>
      <h4 id="detecting-stolen-refresh-tokens">
        Detecting stolen refresh tokens
      </h4>
      <p>
        Nuxt IAM keeps track of expired refresh tokens. Let&#39;s say you you
        have a one refresh token in the database. If you refresh your tokens,
        you get a new set of tokens, and the old refresh token will be
        deactivated. If you or someone else steals the old refresh token and
        attempts to get a new set of tokens using that refresh token, all your
        refresh tokens will be deactivated, and you will have to login after
        your access token expires. This feature protects your account against
        stolen tokens.
      </p>
      <h2 id="sessions">Sessions</h2>
      <p>
        Nuxt IAM uses sessions to manage user sessions. Every user can only have
        one session at a time.
      </p>
    </div>
  </div>
</template>
