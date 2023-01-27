<template>
  <div class="container">
    <div class="login-form" style="margin-bottom: 40px">
      <div style="margin-left: 64px">
        <NuxtLink to="/iam/"
          ><img src="~~/iam/ui/img/nuxt-iam-logo.png/" style="width: 200px"
        /></NuxtLink>
      </div>
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
      <form>
        <h2 class="text-center">Log in</h2>
        <div class="text-center social-btn">
          <a href="#" class="btn btn-danger btn-block"
            ><i class="fa fa-google"></i> Sign in with <b>Google</b></a
          >
        </div>
        <div class="or-seperator"><i>or</i></div>
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
          <NuxtLink to="/iam/reset" class="pull-right"
            >Forgot Password?</NuxtLink
          >
        </div>
      </form>
      <p class="text-center">
        <NuxtLink to="/iam/register">Create an Account</NuxtLink>
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
  const router = useRouter();

  const loginResponse = await login(loginForm.email, loginForm.password);
  loginStatus.value = loginResponse.status;
  loginError.value = loginResponse.error;
  loginData.value = loginResponse.data;
  console.log("loginResponse: ", loginResponse);

  // If login successful, route to dashboard page
  if (loginStatus.value === "success") router.push("/iam/dashboard");
}

// If you're using the same version of Bootstrap in your whole app, you can remove the links and scripts below
useHead({
  title: "Nuxt IAM Login Example",
  link: {
    rel: "stylesheet",
    href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
    type: "text/css",
  },
});
</script>

<style scoped>
.login-form {
  width: 340px;
  margin: 0 auto;
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
.or-seperator {
  margin: 20px 0 10px;
  text-align: center;
  border-top: 1px solid #ccc;
}
.or-seperator i {
  padding: 0 10px;
  background: #f7f7f7;
  position: relative;
  top: -11px;
  z-index: 1;
}
.social-btn .btn {
  margin: 10px 0;
  font-size: 15px;
  text-align: left;
  line-height: 24px;
}
.social-btn .btn i {
  float: left;
  margin: 4px 15px 0 5px;
  min-width: 15px;
}
.input-group-addon .fa {
  font-size: 18px;
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
