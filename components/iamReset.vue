<template>
  <div>
    <NxAlert v-if="resetError" @click="resetError = null">
      <strong>{{ resetError.message }}</strong>
    </NxAlert>
    <div v-if="!formSent">
      <NxCard
        header="Reset Password"
        class="reset-card"
        text="Enter your email address and we'll send you an email with instructions to reset your password."
      >
        <NxForm
          :data="inputData"
          submit-text="Reset Password"
          @submit="resetMyPassword"
        />
        <div class="register-login">
          <div>
            <NuxtLink to="/iam/register">Register</NuxtLink>
          </div>
          <div class="login">
            <NuxtLink to="/iam/login">Login</NuxtLink>
          </div>
        </div>
      </NxCard>
    </div>
    <div v-else>
      <NxAlert :show-close="false" theme="warning">
        <strong>
          Please check your email for reset instructions. Check your spam folder
          too.
        </strong>
      </NxAlert>
      <p></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, NxFormInput } from "~~/iam/misc/types";
const { resetPassword } = useIam();

const formSent = ref(false);
const resetError = ref(<Error | null>null);

// Data for register form
const inputData = [
  {
    label: "Email",
    id: "email",
    type: "input:email",
  },
] as Array<NxFormInput>;

/**
 * @desc Receive user obejct with email and send for password reset
 * @param user User object with email
 */
async function resetMyPassword(user: User) {
  // validation
  if (!user.email) {
    resetError.value = {} as Error;
    resetError.value.message = "Missing email address";
    return;
  }

  // For security purposes, this always returns successful
  // Check your server console logs for any errors
  const result = await resetPassword(user.email);
  console.log("reset form: ", result);
  formSent.value = true;
}

useHead({
  title: "Nuxt IAM Register",
});
</script>

<style scoped>
.register-login {
  display: flex;
}

.register-login a {
  text-decoration: none;
}
.login {
  margin-left: auto;
}

.reset-card {
  margin: auto;
}
</style>
