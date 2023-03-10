<template>
  <div>
    <div class="container px-4 my-5 py-5 border shadow-lg" id="icon-grid">
      <h2 class="pb-2 border-bottom">What is Nuxt IAM?</h2>
      <p>Nuxt IAM, which stands for <strong>Nuxt Identity and Access Management,</strong> is an authentication and authorization framework for Nuxt 
        that allows you to secure your app with industry best practices. Nuxt IAM, adds authentication and authorization logic to your 
        Nuxt app.
      </p> 
      <p>See a fully functional <a href="https://nuxt-iam.vercel.app/iam/">example app</a>.</p>
      
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

    <div class="container px-4 my-5 py-5 border shadow-lg" id="icon-grid">
      <h2 class="pb-2 border-bottom">Features</h2>

      <div
        class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5"
      >
        <div class="col d-flex align-items-start">
          <svg
            class="bi text-muted flex-shrink-0 me-3"
            width="1.75em"
            height="1.75em"
          >
            <use xlink:href="#bootstrap" />
          </svg>
          <div>
            <h4 class="fw-bold mb-0">Authentication</h4>
            <p>
              Add full-stack authentication to your Nuxt app, both back end and
              front end.
            </p>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <svg
            class="bi text-muted flex-shrink-0 me-3"
            width="1.75em"
            height="1.75em"
          >
            <use xlink:href="#cpu-fill" />
          </svg>
          <div>
            <h4 class="fw-bold mb-0">Authorization</h4>
            <p>
              Add permission-based access control to both your front end and
              back end.
            </p>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <svg
            class="bi text-muted flex-shrink-0 me-3"
            width="1.75em"
            height="1.75em"
          >
            <use xlink:href="#calendar3" />
          </svg>
          <div>
            <h4 class="fw-bold mb-0">Secure Your API</h4>
            <p>Add authentication and authorization to your API</p>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <svg
            class="bi text-muted flex-shrink-0 me-3"
            width="1.75em"
            height="1.75em"
          >
            <use xlink:href="#home" />
          </svg>
          <div>
            <h4 class="fw-bold mb-0">Register, Login, Logout Users</h4>
            <p>Scaffold components to register, login, and logout users</p>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <svg
            class="bi text-muted flex-shrink-0 me-3"
            width="1.75em"
            height="1.75em"
          >
            <use xlink:href="#speedometer2" />
          </svg>
          <div>
            <h4 class="fw-bold mb-0">Email Verification</h4>
            <p>Comes with optional email verification to your registration</p>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <svg
            class="bi text-muted flex-shrink-0 me-3"
            width="1.75em"
            height="1.75em"
          >
            <use xlink:href="#toggles2" />
          </svg>
          <div>
            <h4 class="fw-bold mb-0">Password Recovery</h4>
            <p>Allow your users to recover their lost password</p>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <svg
            class="bi text-muted flex-shrink-0 me-3"
            width="1.75em"
            height="1.75em"
          >
            <use xlink:href="#geo-fill" />
          </svg>
          <div>
            <h4 class="fw-bold mb-0">User Profile</h4>
            <p>Add a user profile so your users can manage their data</p>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <svg
            class="bi text-muted flex-shrink-0 me-3"
            width="1.75em"
            height="1.75em"
          >
            <use xlink:href="#tools" />
          </svg>
          <div>
            <h4 class="fw-bold mb-0">User Management</h4>
            <p>Manage your users from an admin panel</p>
          </div>
        </div>
      </div>      

      <div class="row">
        <div
          class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3"
        >
        <NuxtLink to="/iam/docs">
          <button
            type="button"
            class="btn btn-primary btn-lg px-4 me-md-2 fw-bold text-white"
          >
            See the docs
          </button>
        </NuxtLink>
          <button
            type="button"
            class="btn btn-warning btn-lg px-4 me-md-2 fw-bold"
          >
            Download Sample app
          </button>
        </div>
      </div>
    </div>

    <div class="container px-4 my-5 py-5 border shadow-lg" id="icon-grid">
      <h2 class="pb-2 border-bottom">MIT License</h2>
      <p>COPYRIGHT 2023 Nuxt-IAM</p> 
      <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
          The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </p>
      
    
    </div>

   
  </div>
</template>

<script setup>
useHead({
  title: "Nuxt IAM - Identity and Access Management for Nuxt",  
});
</script>

<style scoped>
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}
</style>
