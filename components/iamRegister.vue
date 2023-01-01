<template>
  <div class="container">
    <!-- If we receive an error -->
    <div
      v-if="registerError"
      class="alert alert-danger alert-dismissable"
      role="alert"
    >
      <button
        @click="registerError = null"
        type="button"
        class="close"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span></button
      >{{ registerError.message }}
    </div>
    <div class="register-form">
      <div style="margin-left: 64px">
        <img src="~~/iam/ui/img/nuxt-iam-logo.png/" />
      </div>
      <form>
        <h2 class="text-center">Register</h2>
        <div class="form-group">
          <input
            v-model="registerForm.firstName"
            type="text"
            class="form-control"
            placeholder="First name"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="registerForm.lastName"
            type="email"
            class="form-control"
            placeholder="Last name"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="registerForm.email"
            type="email"
            class="form-control"
            placeholder="Email"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="registerForm.password"
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
            @click.prevent="tryRegister"
          >
            Register
          </button>
        </div>
        <div class="clearfix">
          <label class="pull-left checkbox-inline"
            ><input type="checkbox" /> I accept the
            <NuxtLink to="#">Terms and Conditions</NuxtLink>
          </label>
        </div>
      </form>
      <p class="text-center">
        Already have an account?
        <NuxtLink to="/login">Log in here</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
// Get necessary functions from useIam composable
const { register } = useIam();

// Captures any registration errors
let registerError = ref(null);

// Object to hold registration data
const registerForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

// Try to register user
async function tryRegister() {
  const { status, error } = await register(
    registerForm.firstName,
    registerForm.lastName,
    registerForm.email,
    registerForm.password
  );

  // If we get an error
  if (error) {
    console.log("error: ", error);
    registerError.value = error;
  }

  // If successful, route to login page
  if (status === "success") {
    const router = useRouter();
    router.push("/login");
  }
}

// If you're using the same version of Bootstrap in your whole app, you can remove the links and scripts below
useHead({
  title: "Nuxt IAM Register Example",
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
.register-form {
  width: 340px;
  margin: 0 auto;
}
.register-form form {
  margin-bottom: 15px;
  background: #f7f7f7;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  padding: 30px;
}
.register-form h2 {
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
