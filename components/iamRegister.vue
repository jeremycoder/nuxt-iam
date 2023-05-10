<template>
  <div>
    <!-- if error -->
    <NxAlert v-if="registerError" theme="danger" @click="registerError = null">
      <strong>{{ registerError.message }}</strong>
    </NxAlert>

    <!--if successful -->
    <NxAlert v-if="registerSuccess" theme="success" :show-close="false">
      <strong>Registration successful</strong>
    </NxAlert>

    <!-- if email verification is required -->
    <NxAlert v-if="verifyRegistrations" theme="warning" :show-close="false">
      <strong>Email verification is required.</strong>
    </NxAlert>

    <!-- Registration card and form -->
    <NxCard
      header="Register"
      class="register-card"
      text="Enter all user information below"
    >
      <NxForm :data="inputData" submit-text="Register" @submit="registerUser" />
      <div class="terms-account">
        <div>
          <input type="checkbox" v-model="acceptTerms" />
          <span>
            I accept the
            <NuxtLink to="/iam/register"> Terms and Conditions </NuxtLink>
          </span>
        </div>
        <div class="account">
          <p>
            Already have an account?
            <NuxtLink to="/iam/login">Log in here </NuxtLink>
          </p>
        </div>
      </div>
    </NxCard>
  </div>
</template>

<script setup lang="ts">
import { User, NxFormInput } from "~~/iam/misc/types";
const verifyRegistrations =
  useRuntimeConfig().public.iamVerifyRegistrations === "true";

const { register } = useIam();
const registerError = ref(<Error | null>null);
const registerSuccess = ref(false);
const acceptTerms = ref(false);

// Data for register form
const inputData = [
  {
    label: "First Name",
    id: "first_name",
    type: "input:text",
  },
  {
    label: "Last Name",
    id: "last_name",
    type: "input:text",
  },
  {
    label: "Email",
    id: "email",
    type: "input:email",
  },
  {
    label: "Password",
    id: "password",
    type: "input:password",
  },
] as Array<NxFormInput>;

// Attempt to register user
async function registerUser(user: User) {
  // Validation
  if (!user.first_name) {
    registerError.value = {} as Error;
    registerError.value.message = "First name is required";
    return;
  }

  if (!user.last_name) {
    registerError.value = {} as Error;
    registerError.value.message = "Last name is required";
    return;
  }

  if (!user.email) {
    registerError.value = {} as Error;
    registerError.value.message = "Email is required";
    return;
  }

  if (!user.password) {
    registerError.value = {} as Error;
    registerError.value.message = "Password is required";
    return;
  }

  if (!acceptTerms.value) {
    registerError.value = {} as Error;
    registerError.value.message = "You must accept terms and conditions";
    return;
  }

  // Send registration data
  const { status, error } = await register(user);

  // If we get an error
  if (error) {
    console.log("error: ", error);
    registerError.value = error;
  }

  // If successful, show success message, wait, then navigate to login page
  if (status === "success") {
    registerSuccess.value = true;
    setTimeout(() => {
      navigateTo("/iam/login");
    }, 1000);
  }
}

useHead({
  title: "Register",
});
</script>

<style scoped>
.terms-account a {
  text-decoration: none;
}

.account {
  margin-left: auto;
}

.register-card {
  margin: auto;
}
</style>
