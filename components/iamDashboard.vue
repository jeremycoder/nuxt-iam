<template>
  <div v-if="isLoaded">
    <div v-if="isLoggedIn && profile">
      <!-- Check if email is verified -->
      <div
        v-if="verifyRegistrations && !emailIsVerified"
        class="container-xl px-4 mt-4"
      >
        <div class="container">
          <h2>Email verification is required</h2>
          <div v-if="!verificationEmailSent">
            <p>Please click the button below to verify your email</p>
            <button
              class="btn btn-primary"
              type="button"
              @click="verifyMyEmail(profile.email)"
            >
              Send email verification
            </button>
            <button
              class="btn btn-secondary ms-2"
              type="button"
              @click="logMeOut()"
            >
              Log out
            </button>
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
      <div v-else-if="getProfileError" class="container my-5">
        <div class="alert alert-danger" role="alert">
          <h3 class="alert-heading">Get profile error</h3>
          <p>
            {{ getProfileError.message }}
          </p>
          <hr />
          <button type="button" class="btn btn-secondary" @click="logMeOut">
            Log out
          </button>
        </div>
      </div>      
      <div v-else>        
        <!-- Main content -->
        <main>
          <div class="container">
            <NuxtPage :profile="profile" @profileUpdate="getMyProfile" />            
          </div>
        </main>      
      </div>    
    </div>    
  </div>
  <div v-else class="container-xl px-4 mt-4">
    <div class="spinner-border" role="status"></div>
  </div>
</template>

<script setup>
import { useIamProfileStore } from '@/stores/useIamProfileStore'

const iamStore = useIamProfileStore()
const { isAuthenticated, getProfile, logout, verifyEmail } = useIam();

const isLoaded = ref(false);
const iAmLoggedIn = ref(false);
const showProfile = ref(false);
let getProfileError = ref(null);
let verificationEmailSent = ref(false);

// Profile variables
const firstName = ref("");
const lastName = ref("");

// Check email verification
const verifyRegistrations =
  useRuntimeConfig().public.iamVerifyRegistrations === "true";
const emailIsVerified = ref(false);

// User profile
 const profile = {
    id: "",
    uuid: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    avatar: "",
    csrfToken: "",
    isActive: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    permissions: "",
  };

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

// Log user out
async function logMeOut() {
  const { status } = await logout();
  if (status === "success") {
    
    // Clear store variables
    iamStore.setIsLoggedIn(false)
    iamStore.clearProfile()

    navigateTo("/iam/login");
  }
}

// Attempt to get user profile
async function getMyProfile() {
  const { status, error, data } = await getProfile();  

  // If error, show error
  if (error) {
    console.log("error: ", error);
    getProfileError.value = error;
  }

  // If successful, data will contain profile
  if (status === "success" && data) {
    profile.id = data.id;
    profile.uuid = data.uuid;
    profile.firstName = data.first_name;
    profile.lastName = data.last_name;
    profile.email = data.email;
    profile.avatar = data.avatar;
    profile.csrfToken = data.csrf_token;
    profile.isActive = data.is_active;
    profile.role = data.role;
    profile.permissions = data.permissions;

    // Assign to local reactive variables
    firstName.value = profile.firstName;
    lastName.value = profile.lastName;

    // Check email verification status
    emailIsVerified.value = data.email_verified;
    showProfile.value = true;    

    // Store some profile data in store
    iamStore.setProfile({
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar,
    })
    
    // Set log in true in store
    iamStore.setIsLoggedIn(true)
    iamStore.setUpdateCount()    
  }  
}

/**
 * @desc Sends API request to verify email
 * @param email User email
 */
async function verifyMyEmail(email) {  
  verifyEmail(email);
  verificationEmailSent.value = true;
}

useHead({
  title: "Nuxt IAM Dashboard",  
});
</script>

