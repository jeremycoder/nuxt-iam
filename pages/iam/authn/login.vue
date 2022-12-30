<template>
  <div class="container">
    <!-- If we receive an error -->
    <div
      v-if="loginError"
      class="alert alert-danger alert-dismissable"
      role="alert"
    >
      <button
        @click="loginError = null"
        type="button"
        class="close"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span></button
      >{{ loginError.message }}
    </div>
    <div class="login-form">
      <form>
        <h2 class="text-center">Log in</h2>
        <div class="form-group">
          <input
            v-model="loginForm.email"
            type="email"
            class="form-control"
            placeholder="Email"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="loginForm.password"
            type="password"
            class="form-control"
            placeholder="Password"
            required
          />
        </div>
        <div class="form-group">
          <button
            type="submit"
            class="btn btn-primary btn-block"
            @click.prevent="tryLogin"
          >
            Log in
          </button>
        </div>
        <div class="clearfix">
          <label class="pull-left checkbox-inline"
            ><input type="checkbox" /> Remember me</label
          >
          <a href="#" class="pull-right">Forgot Password?</a>
        </div>
      </form>
      <p class="text-center">
        <NuxtLink to="/iam/authn/register">Create an Account</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
// Get necessary functions from useIam composable
const { login } = useIam();

// These variables come from response from calling Nuxt IAM api
let loginStatus = ref(null);
let loginError = ref(null);
let loginData = ref(null);

const loginForm = {
  email: "",
  password: "",
};

// Try to log user in
async function tryLogin() {
  const loginResponse = await login(loginForm.email, loginForm.password);
  loginStatus.value = loginResponse.status;
  loginError.value = loginResponse.error;
  loginData.value = loginResponse.data;
  console.log("loginResponse: ", loginResponse);
}

// If you're using the same version of Bootstrap in your whole app, you can remove the links and scripts below
useHead({
  title: "Nuxt IAM Login Example",
  link: {
    rel: "stylesheet",
    href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
    type: "text/css",
  },
  script: {
    src: "https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js",
  },
  script: {
    src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
  },
});
</script>

<style scoped>
.login-form {
  width: 340px;
  margin: 50px auto;
}
.login-form form {
  margin-bottom: 15px;
  background: #f7f7f7;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  padding: 30px;
}
.login-form h2 {
  margin: 0 0 15px;
}
.form-control,
.btn {
  min-height: 38px;
  border-radius: 2px;
}
.btn {
  font-size: 15px;
  font-weight: bold;
}
</style>
