<template>
  <div class="container">
    <!-- If we receive an error -->
    <div class="login-form">
      <div style="margin-left: 64px">
        <img src="~~/iam/ui/img/nuxt-iam-logo.png/" />
      </div>
      <div v-if="formSent === false">
        <form>
          <h2 class="text-center">Password Reset</h2>
          <p>
            Enter your email address and we'll send you an email with
            instructions to reset your password.
          </p>
          <div class="form-group">
            <input
              v-model="resetForm.email"
              type="email"
              class="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div class="form-group">
            <button
              type="submit"
              class="btn btn-primary btn-block"
              @click.prevent="resetMyPassword"
            >
              Reset Password
            </button>
          </div>
          <div class="clearfix">
            <NuxtLink to="/iam/register" class="pull-">Register</NuxtLink>
            <NuxtLink to="/iam/register" class="pull-right">Register</NuxtLink>
          </div>
        </form>
      </div>
      <div v-else>
        <p>Please check your email for reset instructions</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Get necessary functions from useIam composable
const { resetPassword } = useIam();

// Flag when form is submitted
const formSent = ref(false);

const resetForm = {
  email: "",
};

// Try to log user in
async function resetMyPassword() {
  // If nothing is in form, just return without sending anything to server
  if (resetForm.email.length === 0) return;

  // For security purposes, this always returns succesful
  // Check your server console logs for debugging purposes
  const result = await resetPassword(resetForm.email);
  console.log("reset form: ", result);
  formSent.value = true;
}

// If you're using the same version of Bootstrap in your whole app, you can remove the links and scripts below
useHead({
  title: "Nuxt IAM Password Reset Example",
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
