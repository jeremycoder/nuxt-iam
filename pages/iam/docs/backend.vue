<template>
  <div class="container px-4 my-5 py-5 border shadow-lg" id="icon-grid">
    <h1 id="backend">Backend</h1>
    <p>
      Nuxt IAM provides you with an extensive backend. Below is an explanation
      of files and API logic that deals with the backend.
    </p>
    <h2 id="database">Database</h2>
    <p>
      Nuxt IAM requires a database to operate successfully, and uses
      <a href="http://www.prisma.io">Prisma</a> as its object relation mapper
      (ORM). For database configuration, please see
      <a href="./configuration">Configuration</a>.
    </p>
    <p>
      Prisma adds a <strong>prisma/schema</strong> file to your application. The
      schema file tells Prisma the structure of your database. For more
      information about your Prisma schema file, please see
      <a href="https://www.prisma.io/docs/concepts/components/prisma-schema"
        >Prisma schema</a
      >
    </p>
    <p>The default Nuxt IAM Prisma schema should look similar to</p>
    <pre><code>generator client {
    provider = <span class="hljs-string">"prisma-client-js"</span>
  }

  datasource db {
    provider = <span class="hljs-string">"mysql"</span>
    url      = env(<span class="hljs-string">"DATABASE_URL"</span>)
  }

  model users {
    id             <span class="hljs-built_in">Int</span>              <span class="hljs-meta">@id</span> <span class="hljs-meta">@default</span>(autoincrement())
    uuid           <span class="hljs-built_in">String</span>           <span class="hljs-meta">@unique</span>(map: <span class="hljs-string">"uuid"</span>) <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">60</span>)
    email          <span class="hljs-built_in">String</span>           <span class="hljs-meta">@unique</span>(map: <span class="hljs-string">"email"</span>) <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">255</span>)
    password       <span class="hljs-built_in">String</span>           <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">255</span>)
    avatar         <span class="hljs-built_in">String</span>?          <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">1000</span>)
    permissions    <span class="hljs-built_in">String</span>?          <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">4000</span>)
    first_name     <span class="hljs-built_in">String</span>           <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">255</span>)
    last_name      <span class="hljs-built_in">String</span>           <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">255</span>)
    role           Role             <span class="hljs-meta">@default</span>(GENERAL)
    email_verified Boolean          <span class="hljs-meta">@default</span>(<span class="hljs-literal">false</span>)
    is_active      Boolean          <span class="hljs-meta">@default</span>(<span class="hljs-literal">true</span>)
    last_login     <span class="hljs-built_in">DateTime</span>?        <span class="hljs-meta">@db</span>.<span class="hljs-built_in">DateTime</span>(<span class="hljs-number">0</span>)
    created_at     <span class="hljs-built_in">DateTime</span>         <span class="hljs-meta">@default</span>(now()) <span class="hljs-meta">@db</span>.<span class="hljs-built_in">DateTime</span>(<span class="hljs-number">0</span>)
    deleted_at     <span class="hljs-built_in">DateTime</span>?        <span class="hljs-meta">@db</span>.<span class="hljs-built_in">DateTime</span>(<span class="hljs-number">0</span>)
    refresh_tokens refresh_tokens[]
    sessions       sessions[]
    provider_users provider_users[]
  }

  model provider_users {
    id               <span class="hljs-built_in">Int</span>      <span class="hljs-meta">@id</span> <span class="hljs-meta">@default</span>(autoincrement())
    provider         Provider
    provider_user_id <span class="hljs-built_in">String</span>   <span class="hljs-meta">@unique</span>(map: <span class="hljs-string">"provider_user_id"</span>)
    user             users?   <span class="hljs-meta">@relation</span>(fields: [user_id], references: [id], onDelete: Cascade)
    user_id          <span class="hljs-built_in">Int</span>
  }

  model sessions {
    id           <span class="hljs-built_in">Int</span>       <span class="hljs-meta">@id</span> <span class="hljs-meta">@default</span>(autoincrement())
    user         users?    <span class="hljs-meta">@relation</span>(fields: [user_id], references: [id], onDelete: Cascade)
    user_id      <span class="hljs-built_in">Int</span>
    sid          <span class="hljs-built_in">String</span>    <span class="hljs-meta">@unique</span>(map: <span class="hljs-string">"sid"</span>)
    start_time   <span class="hljs-built_in">DateTime</span>  <span class="hljs-meta">@default</span>(now())
    end_time     <span class="hljs-built_in">DateTime</span>?
    access_token <span class="hljs-built_in">String</span>    <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">4000</span>)
    csrf_token   <span class="hljs-built_in">String</span>    <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">255</span>)
    is_active    Boolean
    ip_address   <span class="hljs-built_in">String</span>
  }

  enum Role {
    SUPER_ADMIN
    ADMIN
    GENERAL
  }

  enum Provider {
    GOOGLE
  }

  model refresh_tokens {
    id           <span class="hljs-built_in">Int</span>      <span class="hljs-meta">@id</span> <span class="hljs-meta">@default</span>(autoincrement())
    token_id     <span class="hljs-built_in">String</span>   <span class="hljs-meta">@unique</span>(map: <span class="hljs-string">"token_id"</span>) <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">60</span>)
    user         users?   <span class="hljs-meta">@relation</span>(fields: [user_id], references: [id], onDelete: Cascade)
    user_id      <span class="hljs-built_in">Int</span>
    is_active    Boolean
    date_created <span class="hljs-built_in">DateTime</span> <span class="hljs-meta">@default</span>(now()) <span class="hljs-meta">@db</span>.<span class="hljs-built_in">DateTime</span>(<span class="hljs-number">0</span>)
  }

  model one_time_tokens {
    id           <span class="hljs-built_in">Int</span>        <span class="hljs-meta">@id</span> <span class="hljs-meta">@default</span>(autoincrement())
    token_id     <span class="hljs-built_in">String</span>     <span class="hljs-meta">@unique</span>(map: <span class="hljs-string">"token_id"</span>) <span class="hljs-meta">@db</span>.VarChar(<span class="hljs-number">60</span>)
    token_type   tokenType?
    expires_at   <span class="hljs-built_in">DateTime</span>   <span class="hljs-meta">@db</span>.<span class="hljs-built_in">DateTime</span>(<span class="hljs-number">0</span>)
    date_created <span class="hljs-built_in">DateTime</span>   <span class="hljs-meta">@default</span>(now()) <span class="hljs-meta">@db</span>.<span class="hljs-built_in">DateTime</span>(<span class="hljs-number">0</span>)
  }

  enum tokenType {
    RESET
  }
  </code></pre>
    <p>
      To add and modify tables, familiarize yourself with
      <a href="http://www.prisma.io">Prisma</a>.
    </p>
    <h2 id="server">Server</h2>
    <p>
      Nuxt IAM adds the following directories to your
      <strong>server/api</strong> directory.
    </p>
    <ul>
      <li><strong>iam/authn</strong>: global authentication handler</li>
      <li><strong>iam/refresh-tokens</strong>: refresh tokens handler</li>
      <li><strong>iam/users</strong>: global users handler</li>
    </ul>
    <h2 id="api-requests-and-responses">API Requests and Responses</h2>
    <p>
      All API requests must have send the <code>client-platform</code> header.
      The <code>client-platform</code> header tells Nuxt IAM what type of client
      is sending the request, and can therefore provide the best security for
      the client.
    </p>
    <h3 id="client-platform">Client platform</h3>
    <p>
      <code>client-platform</code> is a <strong>required</strong> header and it
      must be sent with every request. Client platform allows Nuxt IAM to
      provide the best practices for securing your app.
      <code>client-platform</code> must be:
    </p>
    <ul>
      <li>
        <code>app</code>: Use <code>app</code> if the request is coming from a
        non-browser such as a mobile app, tablet, or a tool like POSTMAN. Access
        and refresh tokens will be sent in the response headers. Can be used in
        <strong>production</strong>.
      </li>
      <li>
        <code>browser</code>: Use <code>browser</code> if the request is coming
        from a browser. Access and refresh tokens will be sent in
        <strong>secure, httpOnly</strong> cookies. Can be used in
        <strong>production</strong>.
      </li>
      <li>
        <code>browser-dev</code>: Use <code>browser-dev</code> if the request is
        coming from a browser in a development environment. Access and refresh
        tokens are sent in <strong>unsecure</strong> cookies. Use only in
        <strong>development.</strong>
      </li>
    </ul>
    <p>
      If the <code>client-platform</code> header is not sent, the API will
      respond with an error. In some cases, if <code>client-platform</code> is
      not sent, it will default to <code>browser</code>, which assumes the
      request is being sent by a browser in production.
    </p>
    <h4 id="client-platform-app-">Client Platform: &#39;app&#39;</h4>
    <p>
      If <code>client-platform</code> is app, you&#39;ll need to manage the
      access and refresh tokens that are sent. For example, when a user
      successfully logs in, Nuxt IAM will respond with an
      <strong>access token</strong> and a <strong>refresh token</strong> in the
      header. You&#39;ll need the access token in your next request if
      you&#39;ll be requesting restricted data such as the user&#39;s profile.
    </p>
    <p>
      Access tokens only last <strong>15 minutes</strong>, so after the 15
      minutes is up, you need to login again to get a new set of access and
      refresh tokens. Refresh tokens last <strong>14 days.</strong>
    </p>
    <p>
      If your access token has expired, but your refresh token has not expired,
      you can send a POST request to <code>/api/iam/authn/refresh</code> with
      your expired access token and valid refresh token in the header, and you
      should get new tokens.
    </p>
    <p>You must then use those tokens to access any restricted data.</p>
    <h3 id="api-responses">API responses</h3>
    <p>API responses should always be in the format below</p>
    <pre><code>{
    <span class="hljs-string">"status"</span>: [<span class="hljs-string">"success"</span>] | [<span class="hljs-string">"fail"</span>],
    <span class="hljs-string">"data"</span>: {},
    <span class="hljs-string">"error"</span> {},
  }
  </code></pre>
    <p>
      <code>status</code> is always sent. <code>data</code> is sometimes sent
      depending on the request. <code>error</code> is only sent if an error
      occurred.
    </p>
    <h4 id="success">Success</h4>
    <p>
      Here&#39;s an example of a successful API response when a user is
      successfully registers:
    </p>
    <pre><code>{
    <span class="hljs-attr">"status"</span>: <span class="hljs-string">"success"</span>,
      <span class="hljs-attr">"data"</span>: {
          <span class="hljs-attr">"email"</span>: <span class="hljs-string">"jeremy@example.com"</span>
      }
  }
  </code></pre>
    <p>
      Here&#39;s an example of an error occuring when we try to register a user
      who already exists. Email must be unique throughout the system.
    </p>
    <h4 id="fail">Fail</h4>
    <pre><code>{
    <span class="hljs-attr">"status"</span>: <span class="hljs-string">"fail"</span>,
    <span class="hljs-attr">"error"</span>: {
        <span class="hljs-attr">"message"</span>: <span class="hljs-string">"Email already exists"</span>,
        <span class="hljs-attr">"statusCode"</span>: <span class="hljs-number">409</span>,
        <span class="hljs-attr">"statusMessage"</span>: <span class="hljs-string">"Email already exists"</span>
    }
  }
  </code></pre>
    <h2 id="authentication-authn-api">Authentication (authn) API</h2>
    <p>The authentication API handles all authentication logic.</p>
    <h3 id="authentication-api-endpoints">Authentication API Endpoints</h3>
    <p>
      Nuxt IAM adds the following authentication endpoints to your app. See
      examples below.
    </p>
    <ul>
      <li>
        <strong>/api/iam/authn/profile</strong>: GET request will get the
        authenticated user&#39;s profile
      </li>
      <li>
        <strong>/api/iam/authn/isauthenticated</strong>: GET request returns
        value determining whether user is authenticated (logged in) or not
      </li>
      <li>
        <strong>/api/iam/authn/register</strong>: POST request registers a user
      </li>
      <li>
        <strong>/api/iam/authn/login</strong>: POST request logs a user in
      </li>
      <li>
        <strong>/api/iam/authn/login-google</strong>: POST request logs a user
        in using Google
      </li>
      <li>
        <strong>/api/iam/authn/refresh</strong>: POST request gets a new pair of
        access and refresh tokens
      </li>
      <li>
        <strong>/api/iam/authn/reset</strong>: POST request resets a user&#39;s
        password
      </li>
      <li>
        <strong>/api/iam/authn/verifyreset/[token]</strong>: POST request sends
        password verification token
      </li>
      <li>
        <strong>/api/iam/authn/verifyemailtoken</strong>: POST request to for
        email verification
      </li>
      <li>
        <strong>/api/iam/authn/logout</strong>: POST request to log a user out
      </li>
      <li>
        <strong>/api/iam/authn/update</strong>: PUT request to update user
        profile
      </li>
      <li>
        <strong>/api/iam/authn/delete</strong>: DELETE request to delete user
        profile / account
      </li>
    </ul>
    <h3 id="authentication-api-requests-and-responses">
      Authentication API Requests and Responses
    </h3>
    <p>
      The following section provides examples of authentication API requests and
      responses.
    </p>
    <h3 id="register-user">Register user</h3>
    <p>
      To register a user, send a POST request to
      <code>/api/iam/authn/register</code>.
    </p>
    <h4 id="request">Request</h4>
    <p>
      Here&#39;s an example request to register a user. Remember,
      <code>client-platform</code> can be <code>app</code>,
      <code>browser</code>, or <code>browser-dev.</code> In the example below,
      <code>client-platform</code> is <code>app</code>, because this request is
      being sent from a non-browser application.
    </p>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/register"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: 'app',
      },
      body: {
        first_name: 'Jeremy',
        last_name: 'Mwangelwa',
        email: 'jeremy@example.com',
        password: 'MyExamplePassword123*',
      },
    });
  </code></pre>
    <h4 id="response">Response</h4>
    <p>Here&#39;s an example of a successful response.</p>
    <pre><code>{
    <span class="hljs-attr">"status"</span>: <span class="hljs-string">"success"</span>,
      <span class="hljs-attr">"data"</span>: {
          <span class="hljs-attr">"email"</span>: <span class="hljs-string">"jeremy@example.com"</span>
      }
  }
  </code></pre>
    <p>
      If the response status was <code>success</code>, then the user was
      successfully registered and added to the database. A registered user can
      now be logged in.
    </p>
    <h3 id="login-user">Login user</h3>
    <p>To login, send a POST request to <code>/api/iam/authn/login</code>.</p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/login"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: 'app',
      },
      body: {
        email: 'jeremy@example.com',
        password: 'MyExamplePassword123*',
      },
    });
  </code></pre>
    <h4 id="response">Response</h4>
    <h5 id="body">Body</h5>
    <pre><code><span class="hljs-string">"status"</span>: <span class="hljs-string">"success"</span>,
      <span class="hljs-string">"data"</span>: {
          <span class="hljs-string">"email"</span>: <span class="hljs-string">"jeremy@example.com"</span>
      }
  </code></pre>
    <h5 id="response-after-login">Response after login</h5>
    <pre><code><span class="hljs-attribute">iam-access-token</span>: Bearer eyJhbGciOiJIUzI1NiIs...0g3IYFA

  <span class="armasm">
    iam-refresh-token: <span class="hljs-keyword">Bearer </span>eyJhbGciOiJIUzI1...xIMUybnk</span>
  </code></pre>
    <p>
      In a successful login, an access token and a refresh token will be sent.
      If your <code>client platform</code> is <code>app</code>, the tokens will
      be sent in the headers. If your <code>client platform</code> is
      <code>browser</code>, the tokens will be sent in
      <strong>secure, httpOnly</strong> cookies. If your
      <code>client platform</code> is <code>browser-dev</code>, the tokens will
      be sent in unsecure cookies.
    </p>
    <p><strong>Only use browser-dev in development</strong></p>
    <h5 id="client-platform-and-tokens">Client platform and tokens</h5>
    <p>
      If your client platform is <code>app</code> and you need to access a
      protected resource that requires authentication or you need to refresh
      your tokens, you&#39;ll need to send valid access and refresh tokens in
      your <strong>request headers</strong>. For example:
    </p>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/refresh"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"app"</span>,
        <span class="hljs-string">"iam-access-token"</span>: <span class="hljs-string">"Bearer eyJhbGciOiJI....UzI1NiIs"</span>,
        <span class="hljs-string">"iam-refresh-token"</span>: <span class="hljs-string">"Bearer eyJhbGcesTJI....UzI1NiIs"</span>,
      },
  </code></pre>
    <p>
      If your client platform is <code>browser</code> or
      <code>browser-dev,</code> access and refresh tokens are automatically sent
      by your browser in cookies. You don&#39;t have to concern yourself with
      them.
    </p>
    <h3 id="logout-user">Logout user</h3>
    <p>To logout, send a POST request to <code>/api/iam/authn/logout</code>.</p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/logout"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"app"</span>,
      },
    });
  </code></pre>
    <p>
      If your client platform is <code>browser</code> or
      <code>browser-dev</code>, Nuxt IAM will delete your access and refresh
      tokens and deactivate your refresh tokens in the database, and you will be
      immediately logged out of the system. If your client platform is
      <code>app</code>, Nuxt IAM will deactivate your refresh tokens in the
      database. You will be logged out as soon as your access token expires.
      Logging out immediately is not possible because JSON web tokens cannot be
      revoked once given. We cannot revoke access tokens once given. However,
      the access token expires in 15 minutes, so 15 minutes is the maximum
      amount of time that a user on client platform <code>app</code> will be
      logged out but still be able to access resources.
    </p>
    <h3 id="get-user-profile">Get user profile</h3>
    <p>
      To get their profile/account, an authenticated user should send a GET
      request to <code>/api/iam/authn/profile</code>.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/profile"</span>, {
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">'browser'</span>,
      },
    });
  </code></pre>
    <p>In the example above, the GET request is implied.</p>
    <h3 id="login-with-google">Login with Google</h3>
    <p>
      To login with Google, a user send a POST request to
      <code>/api/iam/authn/login-google</code>.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/login-google"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"browser"</span>,
      },
      body: {
        token: token,
      },
    });
  </code></pre>
    <p>
      The token is the access/id token you receive from Google after you
      authenticate with them.
    </p>
    <h3 id="check-if-user-is-authenticated-logged-in">
      Check if user is authenticated/logged in
    </h3>
    <p>
      To check if the current user is authenticated, send a GET request to
      <code>/api/iam/authn/isauthenticated</code>.
    </p>
    <h4 id="request">Request</h4>
    <p>
      Below is an example function that checks if the user is logged in and
      returns true or false.
    </p>
    <pre><code><span class="hljs-built_in">let</span> isAuthenticated = <span class="hljs-literal">false</span>;

    // Api response always has <span class="hljs-built_in">status</span>, data, <span class="hljs-keyword">or</span> <span class="hljs-built_in">error</span>
    const { <span class="hljs-built_in">status</span>, <span class="hljs-built_in">error</span> } = await $fetch(<span class="hljs-string">"/api/iam/authn/isauthenticated"</span>, {
      headers: {
        <span class="hljs-string">"client-platform"</span>: clientPlatform,
      },
    });

    // If <span class="hljs-built_in">status</span> <span class="hljs-built_in">is</span> 'fail', <span class="hljs-keyword">not</span> authenticated
    <span class="hljs-keyword">if</span> (<span class="hljs-built_in">status</span> === <span class="hljs-string">"fail"</span>) {
      <span class="hljs-keyword">if</span> (<span class="hljs-built_in">error</span>) console.<span class="hljs-built_in">log</span>(<span class="hljs-string">"error: "</span>, <span class="hljs-built_in">error</span>);
      isAuthenticated = <span class="hljs-literal">false</span>;
    }

    // If <span class="hljs-built_in">status</span> <span class="hljs-built_in">is</span> 'success', <span class="hljs-built_in">is</span> authenticated
    <span class="hljs-keyword">if</span> (<span class="hljs-built_in">status</span> === <span class="hljs-string">"success"</span>) {
      isAuthenticated = <span class="hljs-literal">true</span>;
    }

    <span class="hljs-built_in">return</span> isAuthenticated;
  </code></pre>
    <h3 id="update-user-profile">Update user profile</h3>
    <p>
      To update their profile/account, an authenticated user must send a PUT
      request to <code>/api/iam/authn/update</code>.
    </p>
    <h4 id="csrf-cross-site-request-forgery-protection-tokens">
      CSRF (cross-site request forgery) protection tokens
    </h4>
    <p>
      A csrf token must be sent with any request that modifies data. Csrf tokens
      are sent in the body of data after a user is authenticated. For an example
      of proper usage, please see the <code>IamDashboard</code> component, or
      the
      <NuxtLink to="/iam/dashboard/admin"
        ><code>iam/dashboard/admin</code></NuxtLink
      >
      page
    </p>
    <h4 id="request">Request</h4>
    <p>
      For your request to be successful, you must supply the user&#39;s
      <code>uuid</code>, <code>csrf_token</code>, and at least one of the
      updatable fields (first name, last name etc.) The uuid is
      <strong>not</strong> the id. Nuxt IAM uses both id and uuid for a user
      account and they are both unique. The uuid is displayed to the public, but
      the id is used internally most of the time.
    </p>
    <p>
      If you&#39;re updating the password, you must supply both
      <strong>current</strong> and <strong>new password</strong> and the new
      password must follow the minimum password strength.
      <strong
        >The password must contain at least 8 characters, an upper-case letter,
        and a lower-case letter, a number, and a non-alphanumeric
        character.</strong
      >
    </p>
    <p>Below is an example.</p>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/update"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">PUT</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: 'browser',
      },
      body: {
        uuid: values.uuid,
        first_name: values.firstName,
        last_name: values.lastName,
        csrf_token: values.csrfToken,
        current_password: values.currentPassword,
        new_password: values.newPassword,
      },
    });
  </code></pre>
    <h3 id="refresh-tokens">Refresh tokens</h3>
    <p>
      To refresh tokens, send a POST request to
      <code>/api/iam/authn/refresh</code>. Refreshing tokens will return a new
      access token and a new refresh token. All your other tokens will be
      invalidated.
    </p>
    <p>
      For this to work, you&#39;ll need to have an active or expired access
      token, and an active refresh token. If both your tokens are expired, you
      will not be able to refresh your tokens.
    </p>
    <h4 id="request">Request</h4>
    <p>
      If your client platform is <code>app</code>, you&#39;ll need to send your
      tokens in the header as below.
    </p>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/refresh"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"app"</span>,
        <span class="hljs-string">"iam-access-token"</span>: <span class="hljs-string">"Bearer eyJhbGciOiJI....UzI1NiIs"</span>,
        <span class="hljs-string">"iam-refresh-token"</span>: <span class="hljs-string">"Bearer eyJhbGcesTJI....UzI1NiIs"</span>,
      },
    });
  </code></pre>
    <p>The tokens will return in the response headers.</p>
    <p>
      If your client platform is <code>browser</code> or
      <code>browser-dev</code>, you&#39;ll need to send your tokens as cookies.
      If you use the Nuxt IAM frontend pages, you won&#39;t have to concern
      yourself with tokens.
    </p>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/refresh"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"browser"</span>,
      },
    });
  </code></pre>
    <p>
      The tokens will return in cookies. If your client platform is
      <code>browser</code>, the tokens will return in
      <strong>secure, httpOnly</strong> cookies. If your client platform is
      <code>browser-dev</code>, the tokens will return in
      <strong>unsecure</strong> cookies. <code>browser-dev</code> is to be used
      only for development.
    </p>
    <h3 id="delete-profile-account">Delete profile / account</h3>
    <p>
      To delete their profile/account, an authenticated user must send a DELETE
      request to <code>/api/iam/authn/delete</code>.
    </p>
    <h4 id="request">Request</h4>
    <p>
      The body of the request needs the user&#39;s <strong>uuid</strong> of the
      user and a <strong>csrf token</strong>. The uuid is
      <strong>not</strong> the id. Nuxt IAM uses both id and uuid for a user
      account and they are both unique. The uuid is displayed to the public, but
      the id is used internally most of the time.
    </p>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/delete"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">DELETE</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"app"</span>,
      },
      body: {
        uuid: uuid,
        csrf_token: csrfToken,
      },
    });
  </code></pre>
    <p>
      For an example of how to properly delete your profile, please see the
      <code>iam/dashboard/settings</code> page.
    </p>
    <h3 id="reset-password">Reset password</h3>
    <p>
      To reset your password, send a POST request to
      <code>/api/iam/authn/reset</code>.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/reset"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: 'browser',
      },
      body: {
        email: email,
      },
    });
  </code></pre>
    <p>
      If an email address exists in the system, an email with a
      <strong>one-time</strong> password reset token will be sent. The token
      expires in <strong>1 hour.</strong> For security purposes, the response is
      always <code>success</code>. Nuxt IAM does not reveal whether the email
      exists or not.
    </p>
    <h3 id="verify-password-reset-token">Verify password reset token</h3>
    <p>
      <em
        >Some may consider this topic advanced. For examples, see how the
        provided pages work in Nuxt IAM.</em
      >
    </p>
    <p>
      To verify a password reset token, send a POST request to
      <code>/api/iam/authn/verifyreset</code>. A password reset token can only
      be verified <strong>once.</strong> Any further verifications will fail.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/verifyreset"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: 'browser',
      },
      body: {
        token: token,
      },
    });
  </code></pre>
    <p>
      If an email address exists in the system, an email with a
      <strong>one-time</strong> password reset token will be sent. The token
      expires in <strong>1 hour.</strong> For security purposes, the response is
      always <code>success</code>. Nuxt IAM does not reveal whether the email
      exists or not.
    </p>
    <h3 id="verify-email">Verify email</h3>
    <p>
      <em
        >Some may consider this topic advanced. For examples, see how the
        provided pages work in Nuxt IAM.</em
      >
    </p>
    <p>
      To verify an email, send a POST request to
      <code>/api/iam/authn/verifyemail</code>. An email with a verification
      token link will be sent to you. An email can only be verified
      <strong>once</strong>. Any other verifications will fail.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/verifyemail"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: 'browser',
      },
      body: {
        email: email,
      },
    });
  </code></pre>
    <p>
      If an email address exists in the system, an email with a
      <strong>one-time</strong> email verification token will be sent. The token
      expires in <strong>1 day.</strong>
    </p>
    <h3 id="verify-email-token">Verify email token</h3>
    <p>
      <em
        >Some may consider this topic advanced. For examples, see how the
        provided pages work in Nuxt IAM.</em
      >
    </p>
    <p>
      To verify an email verification token, send a POST request to
      <code>/api/iam/authn/verifyemailtoken</code>.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/authn/verifyemailtoken"</span>, {
      method: <span class="hljs-string">"<span class="hljs-keyword">POST</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: clientPlatform,
      },
      body: {
        token: token,
      },
    });
  </code></pre>
    <h2 id="users-users-api">Users (users) API</h2>
    <p>
      The users API handles all requests regarding users. Users are considered a
      restricted resource, therefore cannot be accessed without
      <strong>authentication</strong> and <strong>authorization.</strong>
    </p>
    <h3 id="users-api-endpoints">Users API Endpoints</h3>
    <p>
      Nuxt IAM adds the following users endpoints to your app. See examples
      below.
    </p>
    <ul>
      <li>
        <strong>/api/iam/users</strong>: GET request will return all users.
        Maximum return is 100 users. Use <code>skip</code> and
        <code>take</code> request parameters to get a set of users e.g.,
        <code>/api/iam/users?skip=40&amp;take=20</code>. See more information on
        <a
          href="https://www.prisma.io/docs/concepts/components/prisma-client/pagination"
          >Prisma pagination</a
        >.
      </li>
      <li>
        <strong>/api/iam/users/[uuid]</strong>: GET a specific user record given
        the user&#39;s uuid. uuid is <strong>not</strong> the user&#39;s id.
        Both are unique, but function differently. uuid is displayed publicly,
        but the user id is used mostly internally.
      </li>
      <li>
        <strong>/api/iam/users</strong>: POST request will
        <strong>not</strong> create a user. It will return a 422 error. You must
        use <code>/api/iam/authn/register</code> to create a user.
      </li>
      <li>
        <strong>/api/iam/users/[uuid]</strong>: PUT request updates a user given
        the user&#39;s uuid
      </li>
      <li>
        <strong>/api/iam/users/[uuid]</strong>: DELETE request deletes a user
        given the user&#39;s uuid
      </li>
    </ul>
    <h3 id="users-api-requests-and-authorization">
      Users API Requests and Authorization
    </h3>
    <p>
      User data is considered a restricted resource and therefore Nuxt IAM
      requires that anyone accessing user data be authenticated and authorized.
      You are of course welcome to change any authentication or authorization
      logic as you like.
    </p>
    <h3 id="getting-all-users">Getting all users</h3>
    <p>To get all users, send a GET request to <code>/api/iam/users</code>.</p>
    <h4 id="request">Request</h4>
    <p>
      Here&#39;s an example request to get all users. Remember,
      <code>client-platform</code> can be <code>app</code>,
      <code>browser</code>, or <code>browser-dev.</code> In the example below,
      <code>client-platform</code> is <code>app</code>, because this request is
      being sent from a non-browser application.
    </p>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/users"</span>, {
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"app"</span>,
      },
    });
  </code></pre>
    <p>
      To paginate use
      <a
        href="https://www.prisma.io/docs/concepts/components/prisma-client/pagination"
        >Prisma pagination</a
      >
      parameters <code>skip</code> and <code>take</code>. In the request below,
      we&#39;ll skip the first 40 users, and grab the next 10.
    </p>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/users?skip=40&amp;take=10"</span>, {
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"app"</span>,
      },
    });
  </code></pre>
    <h4 id="authorization-required">Authorization required</h4>
    <p>
      To get all users, a user must be <strong>authenticated</strong> (be logged
      in), have the role of <code>SUPER_ADMIN</code>, and have their
      <strong>email verified.</strong>
    </p>
    <h3 id="getting-a-particular-user">Getting a particular user</h3>
    <p>
      To get a specific user, send a GET request to
      <code>/api/iam/users/[uuid]</code>. <code>uuid</code> needs to be a valid
      user uuid.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/users/[uuid]"</span>, {
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"app"</span>,
      },
    });
  </code></pre>
    <h4 id="authorization-required">Authorization required</h4>
    <p>
      To get a specific user, a user must be <strong>authenticated</strong> (be
      logged in), and must either have the role of <code>SUPER_ADMIN</code>, or
      be the <strong>owner</strong> of the record.
    </p>
    <h3 id="create-a-new-user">Create a new user</h3>
    <p>
      To create a new user, follow the directions for registering a new user.
    </p>
    <h3 id="update-a-user">Update a user</h3>
    <p>
      To update a specific user, send a PUT request to
      <code>/api/iam/users/[uuid]</code>. <code>uuid</code> needs to be a valid
      user uuid.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(`/api/iam/users/<span class="hljs-string">[uuid]</span>`, {
      method: <span class="hljs-string">"<span class="hljs-keyword">PUT</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"app"</span>,
      },
      body: values,
    });
  </code></pre>
    <p>As of February 2023, values need to be of this type:</p>
    <pre><code>  first_name?: string;
    last_name?: string;
    role?: <span class="hljs-string">'SUPER_ADMIN'</span> | <span class="hljs-string">'ADMIN'</span> | <span class="hljs-string">'GENERAL'</span>;
    csrf_token?: string;
    is_active?: <span class="hljs-keyword">boolean</span>;
    permissions?: string;
  </code></pre>
    <p>
      The <code>?</code> means that the values are optional. That means you can
      update all of them at the same time, or only one.
    </p>
    <h4 id="authorization-required">Authorization required</h4>
    <p>
      To update a specific user, a user must be
      <strong>authenticated</strong> (be logged in), must either have the role
      of <code>SUPER_ADMIN</code>, or be the <strong>owner</strong> of the
      record, and must present the <strong>csrf token</strong>.
    </p>
    <h3 id="delete-a-user">Delete a user</h3>
    <p>
      To delete a user, send a DELETE request to
      <code>/api/iam/users/[uuid]</code>. <code>uuid</code> needs to be a valid
      user uuid.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(`/api/iam/users/<span class="hljs-string">[uuid]</span>`, {
      method: <span class="hljs-string">"<span class="hljs-keyword">DELETE</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: 'browser',
      },
      body: {
        csrf_token: 'abc...',
      },
    });
  </code></pre>
    <h4 id="authorization-required">Authorization required</h4>
    <p>
      To delete a user, you must be <strong>authenticated</strong> (be logged
      in), must either have the role of <code>SUPER_ADMIN</code>, or be the
      <strong>owner</strong> of the record, and must present the
      <strong>csrf token</strong>.
    </p>
    <h2 id="refresh-tokens-refresh-tokens-api">
      Refresh Tokens (refresh-tokens) API
    </h2>
    <p><em>Some may consider the following topics to be adavanced.</em></p>
    <p>
      The refresh-tokens API handles all requests regarding refresh tokens.
      Refresh tokens are considered a restricted resource and, therefore, cannot
      be accessed without <strong>authentication</strong> and
      <strong>authorization.</strong>
    </p>
    <p>
      Refresh tokens are used to get a new set of access and refresh tokens.
      Nuxt IAM allows only <strong>one</strong> refresh token to be active at
      any one time. To first get access and refresh tokens, a user must log in.
      Once logged in, Nuxt IAM will send the user one access token and a refresh
      token.
    </p>
    <p>
      If you login again (by sending a POST request to the login endpoint), you
      will obtain a new set of tokens and the old refresh token will be made
      inactive. Attempting to refresh your tokens with an inactive token
      triggers a &quot;stolen token alert&quot; and makes all your refresh
      tokens inactive. You will be forced to login again. This trigger allows
      the user to only have one token that can be used to refresh tokens.
    </p>
    <p>
      Nuxt IAM allows you to work with refresh tokens as a security measure.
      Refresh tokens are JSON (JavaScript Object Notation) web tokens. They are
      automatically generated and signed by Nuxt IAM. Any change in the token
      invalidates the token. A user with an invalid refresh token will not be
      able to obtain a new set of access and refresh tokens. The user will need
      to successfylly authenticate (log in) to get a new set of tokens.
    </p>
    <p>Nuxt IAM provides a limited number of refresh token endpoints.</p>
    <h3 id="refresh-tokens-api-endpoints">Refresh Tokens API Endpoints</h3>
    <p>
      Nuxt IAM adds the following refresh tokens endpoints to your app. See
      examples below.
    </p>
    <ul>
      <li>
        <strong>/api/iam/refresh-tokens</strong>: GET request will return all
        users. Maximum return is 100 users. Use <code>skip</code> and
        <code>take</code> request parameters to get a set of refresh tokens
        e.g., <code>/api/iam/refresh-tokens?skip=40&amp;take=20</code>. See more
        information on
        <a
          href="https://www.prisma.io/docs/concepts/components/prisma-client/pagination"
          >Prisma pagination</a
        >.
      </li>
      <li>
        <strong>/api/iam/refresh-tokens/[id]</strong>: DELETE request deletes a
        specific refresh token. This forces the token user to have to log in
        once their access token expires.
      </li>
      <li>
        <strong>/api/iam/refresh-tokens</strong>: DELETE request deletes all
        refresh tokens. This will force all users to log in once their access
        token expires.
      </li>
    </ul>
    <h3 id="refresh-tokens-api-requests-and-authorization">
      Refresh Tokens API Requests and Authorization
    </h3>
    <p>
      Refresh tokens data is considered a restricted resource and therefore Nuxt
      IAM requires that anyone accessing user data be authenticated and
      authorized. You are of course welcome to change any authentication or
      authorization logic as you like.
    </p>
    <h3 id="getting-all-refresh-tokens">Getting all refresh tokens</h3>
    <p>
      To get all refresh tokens, send a GET request to
      <code>/api/iam/refresh-tokens</code>.
    </p>
    <h4 id="request">Request</h4>
    <p>
      Here&#39;s an example request to get all refresh tokens. Remember,
      <code>client-platform</code> can be <code>app</code>,
      <code>browser</code>, or <code>browser-dev.</code> In the example below,
      <code>client-platform</code> is <code>app</code>, because this request is
      being sent from a non-browser application.
    </p>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/refresh-tokens"</span>, {
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"app"</span>,
      },
    });
  </code></pre>
    <p>
      To paginate use
      <a
        href="https://www.prisma.io/docs/concepts/components/prisma-client/pagination"
        >Prisma pagination</a
      >
      parameters <code>skip</code> and <code>take</code>. In the request below,
      we&#39;ll skip the first 40 refresh tokens, and grab the next 10.
    </p>
    <pre><code>const response = await $fetch(<span class="hljs-string">"/api/iam/users?skip=40&amp;take=10"</span>, {
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"app"</span>,
      },
    });
  </code></pre>
    <p>In the examples above, the GET request is implied.</p>
    <h4 id="authorization-required">Authorization required</h4>
    <p>
      To get all refresh tokens, a user must be
      <strong>authenticated</strong> (be logged in), have the role of
      <code>SUPER_ADMIN</code>, and have their <strong>email verified.</strong>
    </p>
    <h3 id="deleting-a-particular-refresh-token">
      Deleting a particular refresh token
    </h3>
    <p>
      To delete a specific refresh token, send a DELETE request to
      <code>/api/iam/refresh-tokens/[id]</code>. This will force the user to
      login after their access token has expired.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(`/api/iam/refresh-tokens/<span class="hljs-string">[id]</span>`, {
      method: <span class="hljs-string">"<span class="hljs-keyword">DELETE</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"browser"</span>,
      },
      body: {
        csrf_token: csrfToken,
      },
    });
  </code></pre>
    <h4 id="authorization-required">Authorization required</h4>
    <p>
      To delete a specific refresh token, a user must be
      <strong>authenticated</strong> (be logged in), must have the role of
      <code>SUPER_ADMIN</code>, have their <strong>email verified,</strong> and
      must present the <strong>csrf token</strong>.
    </p>
    <h3 id="deleting-all-refresh-tokens">Deleting all refresh tokens</h3>
    <p>
      To delete all refresh token, send a DELETE request to
      <code>/api/iam/refresh-tokens</code>. This will force all users to login
      after each of their access tokens expire.
    </p>
    <h4 id="request">Request</h4>
    <pre><code>const response = await $fetch(`/api/iam/refresh-tokens/`, {
      method: <span class="hljs-string">"<span class="hljs-keyword">DELETE</span>"</span>,
      headers: {
        <span class="hljs-string">"client-platform"</span>: <span class="hljs-string">"browser"</span>,
      },
      body: {
        csrf_token: csrfToken,
      },
    });
  </code></pre>
    <h4 id="authorization-required">Authorization required</h4>
    <p>
      To delete all refresh tokens, a user must be
      <strong>authenticated</strong> (be logged in), must have the role of
      <code>SUPER_ADMIN</code>, have their <strong>email verified,</strong> and
      must present the <strong>csrf token</strong>.
    </p>
  </div>
</template>

<style scoped>
pre {
  background-color: #000;
  color: #fff;
  padding: 10px;
}
</style>
