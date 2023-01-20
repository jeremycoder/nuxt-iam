<template>
  <div>
    <div class="container my-5">
      <div
        class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg"
      >
        <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">
          <h1 class="display-4 fw-bold lh-1">Nuxt IAM</h1>
          <p class="lead">
            Revolutionize your app's security with Nuxt's new authentication and
            authorization module. Nuxt IAM is an identity and access management
            module for Nuxt that allows you to secure your app with industry
            best practices.
          </p>
          <div
            class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3"
          >
            <NuxtLink to="/iam/register"
              ><button
                type="button"
                class="btn btn-primary btn-lg px-4 me-md-2 fw-bold"
              >
                Register
              </button></NuxtLink
            >

            <NuxtLink to="/iam/login"
              ><button
                type="button"
                class="btn btn-outline-secondary btn-lg px-4"
              >
                Log in
              </button></NuxtLink
            >
          </div>
        </div>
        <div class="col-lg-4">
          <NuxtLink to="/iam/"
            ><img src="~~/iam/ui/img/nuxt-iam-logo.png/" width="297px"
          /></NuxtLink>
        </div>
      </div>
    </div>

    <div class="container px-4 py-5 border shadow-lg" id="icon-grid">
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

      <h4>Software is provided as is</h4>
      <p>
        "The software is provided "as is," without warranty of any kind, express
        or implied, including but not limited to the warranties of
        merchantability, fitness for a particular purpose and non-infringement.
        In no event shall the authors or copyright holders be liable for any
        claim, damages or other liability, whether in an action of contract,
        tort or otherwise, arising from, out of or in connection with the
        software or the use or other dealings in the software."
      </p>
      <h4>Liability waiver</h4>
      <p>
        "By using the software, you agree to waive any and all claims against
        the creators, developers, and distributors of the software for any
        damages, losses, costs, liabilities, and expenses, including but not
        limited to, direct, indirect, incidental, consequential, and punitive
        damages, arising out of or in any way connected with the use of the
        software. This waiver applies to all claims, whether based on contract,
        tort, strict liability, or any other legal theory, and whether or not
        the creators, developers, and distributors of the software have been
        advised of the possibility of such damage. You acknowledge that the
        software may contain bugs, errors, and other issues, and that the
        software may not perform as intended. You also acknowledge that the
        software may be updated, modified, or discontinued at any time without
        notice."
      </p>
      <h4>Use software at your own risk</h4>
      <p>
        "By using the software, you acknowledge that you are doing so at your
        own risk. The creators, developers, and distributors of the software
        make no warranties, express or implied, regarding the software's
        performance, safety, or reliability. You understand that the software
        may contain bugs, errors, and other issues and that the software may not
        perform as intended. You also understand that the software may be
        updated, modified, or discontinued at any time without notice. You agree
        to indemnify and hold harmless the creators, developers, and
        distributors of the software from any and all claims, damages, losses,
        costs, liabilities, and expenses, including but not limited to, direct,
        indirect, incidental, consequential, and punitive damages, arising out
        of or in any way connected with your use of the software."
      </p>

      <div class="row">
        <div
          class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3"
        >
          <button
            type="button"
            class="btn btn-primary btn-lg px-4 me-md-2 fw-bold"
          >
            See the docs
          </button>
          <button
            type="button"
            class="btn btn-warning btn-lg px-4 me-md-2 fw-bold"
          >
            Download Sample app
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Nuxt IAM - Identity and Access Management for Nuxt",
  link: {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    type: "text/css",
  },
  script: {
    src: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
  },
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
