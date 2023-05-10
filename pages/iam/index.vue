<template>
  <div>
    <div class="container px-4 my-5 py-5 border shadow-lg" id="icon-grid">
      <h2 class="pb-2 border-bottom">What is Nuxt IAM?</h2>
      <p>
        Nuxt IAM, which stands for
        <strong>Nuxt Identity and Access Management,</strong> is an
        authentication and authorization framework for Nuxt that allows you to
        secure your app with industry best practices. Nuxt IAM, adds
        authentication and authorization logic to your Nuxt app.
      </p>
      <p>
        See a fully functional <a href="https://nuxtiam.com/">example app</a>.
      </p>

      <p>Nuxt IAM adds the following features to your application:</p>
      <ul>
        <li>✔️ user registration with email and password</li>
        <li>✔️ user login with email and password</li>
        <li>✔️ user login/registration with Google</li>
        <li>✔️ user password reset</li>
        <li>✔️ user dashboard</li>
        <li>✔️ user password change</li>
        <li>✔️ user profile/account delete</li>
        <li>✔️ admin user management</li>
        <li>✔️ admin token management</li>
      </ul>
    </div>

    <h2>Features</h2>
    <div class="features">
      <div>
        <NxCard
          header="Authentication"
          theme="primary"
          max-width="22"
          text="Add full-stack authentication to your Nuxt app, both back end and front end."
        />
      </div>
      <div>
        <NxCard
          header="Authorization"
          theme="danger"
          max-width="22"
          text="Add permission-based access control to both your front end and back end."
        />
      </div>
      <div>
        <NxCard
          header="Secure Your API"
          theme="secondary"
          max-width="22"
          text="Add authentication and authorization to your API."
        />
      </div>
      <div>
        <NxCard
          header="Register, Login, Logout Users"
          theme="primary"
          max-width="22"
          text="Scaffold components to register, login, and logout users."
        />
      </div>
      <div>
        <NxCard
          header="Google Login"
          max-width="22"
          text="Allow your users to easily login with Google."
        />
      </div>
      <div>
        <NxCard
          header="Email Verification"
          theme="danger"
          max-width="22"
          text="Comes with optional email verification to your registration."
        />
      </div>
      <div>
        <NxCard
          header="Password Recovery"
          max-width="22"
          text="Allow your users to recover their lost password."
        />
      </div>
      <div>
        <NxCard
          header="User Profile"
          max-width="22"
          text="Add a user profile so your users can manage their data."
        />
      </div>
      <div>
        <NxCard
          header="User Management"
          max-width="22"
          text="Manage your users from an admin panel."
        />
      </div>
    </div>

    <div>
      <h2 class="pb-2 border-bottom">MIT License</h2>
      <p>COPYRIGHT 2023 Nuxt-IAM</p>
      <p>
        Permission is hereby granted, free of charge, to any person obtaining a
        copy of this software and associated documentation files (the
        "Software"), to deal in the Software without restriction, including
        without limitation the rights to use, copy, modify, merge, publish,
        distribute, sublicense, and/or sell copies of the Software, and to
        permit persons to whom the Software is furnished to do so, subject to
        the following conditions: The above copyright notice and this permission
        notice shall be included in all copies or substantial portions of the
        Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
        KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
        SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </p>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Nuxt IAM - Features",
});
</script>

<style scoped>
.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
