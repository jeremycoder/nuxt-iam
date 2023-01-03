<template>
  <div class="container">
    <!-- If we receive an error -->
    <div
      v-if="newPasswordError"
      class="alert alert-danger alert-dismissable"
      role="alert"
    >
      <button
        @click="newPasswordError = null"
        type="button"
        class="close"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span></button
      >{{ newPasswordError.message }}
    </div>
    <div class="newPassword-form">
      <div style="margin-left: 64px">
        <img src="~~/iam/ui/img/nuxt-iam-logo.png/" />
      </div>
      <form>
        <h2 class="text-center">Enter New Password</h2>
        <div class="form-group">
          <input
            v-model="newPasswordForm.password"
            type="password"
            class="form-control"
            placeholder="Password"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="newPasswordForm.confirmPassword"
            type="password"
            class="form-control"
            placeholder="Confirm Password"
            required
          />
        </div>
        <div class="form-group">
          <button
            type="submit"
            class="btn btn-primary btn-block"
            @click.prevent="tryUpdatePassword"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Get necessary functions from useIam composable
const { updateProfile } = useIam();

const isLoaded = ref(false);

// Show password form only after uuid is verified as a user in db
onMounted(() => {
  // TODO: Create another composable function and an update password endpoint called 'updatepassword'
  // TODO: Requires a token 'update-password' (expires in 15min) in cookie or header
  // TODO: When email token is verified, set cookies 'update-password' to 'browser'
  // TODO: If platform is app, set headers 'update-password' with token

  // TODO: Endpoint will receive password, with confirm password, and must pass the token
  // TODO: Endpoint will accept 'browser' (production) and 'app' only

  isLoaded.value = true;
});

// Get uuid from route
const route = useRoute();
const uuid = route.query.uuid;

let newPasswordError = ref(null);

const newPasswordForm = {
  password: "",
  confirmPassword: "",
};

async function tryUpdateProfile() {
  const { status, error } = await updateProfile(newPasswordForm.password);

  // If we get an error
  if (error) {
    console.log("error: ", error);
    newPasswordError.value = error;
  }

  // If successful, route to login page
  if (status === "success") {
    const router = useRouter();
    router.push("/iam/login");
  }
}

// If you're using the same version of Bootstrap in your whole app, you can remove the links and scripts below
useHead({
  title: "Nuxt IAM newPassword Example",
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
.newPassword-form {
  width: 340px;
  margin: 0 auto;
}
.newPassword-form form {
  margin-bottom: 15px;
  background: #f7f7f7;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  padding: 30px;
}
.newPassword-form h2 {
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
