<template>
  <div v-if="isLoaded">
    <div v-if="isLoggedIn && profile">
      <!-- Check if email is verified -->
      <div v-if="verifyRegistrations && !emailIsVerified">
        <div>
          <h2 class="email-verification-text">
            Email verification is required
          </h2>
          <div v-if="!verificationEmailSent">
            <p>Please click the button below to verify your email</p>
            <div class="email-verification-buttons">
              <NxButton
                class="email-verification-button"
                theme="primary"
                @click="verifyMyEmail(profile.email)"
              >
                Send email verification
              </NxButton>
              <NxButton theme="secondary" @click="logMeOut()">
                Log out
              </NxButton>
            </div>
          </div>
          <div v-else>
            <p>
              Please check your email. Check your spam folder too. Click the
              link in the email to verify your email. You should receive it
              within 15 minutes.
            </p>
          </div>
        </div>
      </div>
      <!-- Check if account is active -->
      <div v-else-if="profile && !profile.is_active">
        <NxAlert theme="danger" :show-close="false">
          <strong
            >Account is not active. Please contact an administrator.</strong
          >
        </NxAlert>
        <NxButton theme="secondary" @click="logMeOut"> Log out </NxButton>
      </div>
      <!-- If we getting profile results in error -->
      <div v-else-if="getProfileError">
        <NxAlert theme="danger" :show-close="true">
          <strong>{{ getProfileError.message }}</strong>
        </NxAlert>
        <NxButton theme="secondary" @click="logMeOut">Log out</NxButton>
      </div>
      <!-- Otherwise display profile -->
      <div v-else>
        <main>
          <div class="container">
            <NuxtPage :profile="profile" @profileUpdate="getMyProfile" />
          </div>
        </main>
      </div>
    </div>
    <div v-else>
      <NxAlert theme="danger" :show-close="false"
        ><strong>User profile not found</strong></NxAlert
      >
      <NxButton theme="secondary" @click="logMeOut">Log out</NxButton>
    </div>
  </div>
  <div v-else>
    <div class="loading-spinner" />
  </div>
</template>

<script setup lang="ts">
import { User } from "~~/iam/misc/types";
import { useIamProfileStore } from "@/stores/useIamProfileStore";

const iamStore = useIamProfileStore();
const { isAuthenticated, getProfile, logout, verifyEmail } = useIam();

const isLoaded = ref(false);
const iAmLoggedIn = ref(false);
const getProfileError = ref(<Error | null>null);
let verificationEmailSent = ref(false);

// Check email verification
const verifyRegistrations =
  useRuntimeConfig().public.iamVerifyRegistrations === "true";
const emailIsVerified = ref(false);

// User profile
const profile = ref(<User>{});

onMounted(async () => {
  await isLoggedIn();
  await getMyProfile();
  isLoaded.value = true;
});

async function isLoggedIn() {
  iAmLoggedIn.value = await isAuthenticated();

  // If user is not authenticated, push to login page
  if (!iAmLoggedIn.value) navigateTo("/iam/login");
}

// Attempt to get user profile
async function getMyProfile() {
  const { status, error, data } = await getProfile();

  // If error, show error
  if (error) {
    console.log("error: ", error);
    getProfileError.value = error;
    return;
  }

  // If successful, data will contain profile
  if (status === "success" && data) {
    profile.value = data as User;

    // Check email verification status
    emailIsVerified.value = data.email_verified;

    // Store user profile
    iamStore.setProfile(profile.value);
    iamStore.setIsLoggedIn(true);
    iamStore.setUpdateCount();
  }
}

// Log user out
async function logMeOut() {
  const { status } = await logout();
  if (status === "success") {
    // Clear store variables
    iamStore.clearProfile();
    iamStore.setIsLoggedIn(false);
    navigateTo("/iam/login");
  }
}

/**
 * @desc Sends API request to verify email
 * @param email User email
 */
async function verifyMyEmail(email: string) {
  verifyEmail(email);
  verificationEmailSent.value = true;
}

useHead({
  title: "Nuxt IAM Dashboard",
});
</script>

<style scoped>
.email-verification-text {
  color: #dc3545;
}

.email-verification-buttons {
  display: flex;
}

.email-verification-button {
  margin-right: 1rem;
}
</style>
