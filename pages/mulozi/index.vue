<template>
  <div
    class="bg-gray-100 min-h-screen flex flex-col justify-center items-center p-4"
  >
    <div class="w-full max-w-sm mb-4">
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4 text-3xl text-center font-bold text-gray-800">
          Welcome to Mulozi
        </div>
        <p class="text-gray-700 text-base mb-4">
          Mulozi is a Nuxt 3 authentication startup that makes it easy to secure
          your applications and protect your users' data. Our powerful, flexible
          platform allows you to easily integrate authentication into your
          existing systems, so you can focus on building amazing products and
          experiences. Mulozi takes security seriously and uses several measures
          to protect your applications and users' data. One of these measures is
          CSRF protection, which helps prevent malicious attacks on your
          application by ensuring that requests to the server are coming from a
          trusted source. Mulozi also uses a back-end for front-end (BFF)
          strategy to provide a seamless experience for your users. This means
          that the server has a separate layer that acts as an intermediary
          between the front-end and the back-end, allowing you to easily
          integrate authentication into your existing systems. To authenticate
          users, Mulozi uses JSON Web Tokens (JWTs), which are signed by the
          server and contain information about the user. When a user logs in,
          the server sends an access token and a refresh token to the client.
          The access token is used to authenticate requests to the server, while
          the refresh token is used to request a new access token when the
          original access token expires. Mulozi also allows you to deactivate
          refresh tokens if needed, for example if a user's device is lost or
          stolen. This ensures that unauthorized users cannot use the refresh
          token to request new access tokens and gain access to the user's data.
        </p>
        <div class="flex items-center justify-between">
          <a
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            href="/signup"
          >
            Sign Up
          </a>
          <a
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="/login"
          >
            Log In
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
