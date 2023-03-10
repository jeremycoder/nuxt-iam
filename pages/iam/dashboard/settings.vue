<template>
  <div>
    <h1 class="mt-5">Settings</h1>
    <p class="lead">Update your settings here.</p>
    <div class="row">
      <div class="col">
        <div class="card mb-3 mx-10" style="max-width: 25rem">
          <h4 class="card-header">Password</h4>
          <div class="card-body">
            <h5 class="card-title">Update Password</h5>
            <p>Update your password below.</p>
            <!-- Profile errors notification -->
            <div
              v-if="profileError"
              class="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              <strong>{{ profileError.message }}</strong>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                @click="profileError = null"
              ></button>
            </div>
            <!-- Profile success notification -->
            <div
              v-if="updateSuccessful"
              class="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              <strong>Profile updated successfully</strong>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                @click="updateSuccessful = false"
              ></button>
            </div>
            <form>
              <div class="mb-3">
                <label for="current_password" class="form-label"
                  >Current Password</label
                >
                <input
                  v-model="profile.currentPassword"
                  type="password"
                  class="form-control mb-3 iam-password-input"                  
                  id="current_password"                  
                />
                <label for="new_password" class="form-label"
                  >New Password</label
                >
                <input
                  v-model="profile.newPassword"
                  type="password"
                  class="form-control mb-3"
                  id="new_password"                  
                />
                <label for="confirm_password" class="form-label"
                  >Confirm New Password</label
                >
                <input
                  v-model="profile.confirmNewPassword"
                  type="password"
                  class="form-control mb-3"
                  id="confirm_password"                  
                />
              </div>
              <button
                type="submit"
                class="btn btn-primary"
                @click.prevent="updateMyProfileWithPassword()"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card mb-3 mx-10 my-10" style="max-width: 25rem">
          <h4 class="card-header">Account</h4>
          <div class="card-body">
            <h5 class="card-title text-danger">Delete Account</h5>
            <!-- Profile errors notification -->
            <div
              v-if="deleteError"
              class="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              <strong>{{ deleteError.message }}</strong>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                @click="deleteError = null"
              ></button>
            </div>
            <p>
              Deleting your account is a permanent action and cannot be undone.
              If you are sure you want to delete your account, click the button
              below.
            </p>
            <button
              type="submit"
              class="btn btn-danger"
              @click.prevent="deleteMyAccount()"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useIamProfileStore } from '@/stores/useIamProfileStore'

const iamStore = useIamProfileStore()
const { updateProfile, deleteAccount } = useIam();

const updateSuccessful = ref(false);
let profileError = ref(null);
let deleteError = ref(null);

// Some profile values with added ones
const profile = {
  uuid: "",
  firstName: "",
  lastName: "",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  csrfToken: "",
};

// Get profile passed through attributes
const attrs = useAttrs();
profile.uuid = attrs.profile.uuid;
profile.firstName = attrs.profile.firstName;
profile.lastName = attrs.profile.lastName;

// Csrf token should be part of profile
const csrfToken = attrs.profile.csrfToken;

// Attempt to update user profile with password
async function updateMyProfileWithPassword() {
  // Front end password validation
  if (
    !profile.currentPassword ||
    !profile.newPassword ||
    !profile.confirmNewPassword
  ) {
    const allPasswordsError = {
      message: "All passwords must be supplied",
    };
    console.log("error: ", allPasswordsError);
    profileError.value = allPasswordsError;
    return;
  }

  // Confirm password front end validation
  if (profile.newPassword !== profile.confirmNewPassword) {
    const confirmPasswordError = {
      message: "New password does not match confirm password",
    };
    console.log("error: ", confirmPasswordError);
    profileError.value = confirmPasswordError;
    return;
  }

  const { error } = await updateProfile({
    uuid: profile.uuid,
    currentPassword: profile.currentPassword,
    newPassword: profile.newPassword,
    confirmNewPassword: profile.confirmNewPassword,
    csrfToken: csrfToken,
  });

  // If error, display error
  if (error) {
    console.log("error: ", error);
    profileError.value = error;
    return;
  }

  updateSuccessful.value = true;
}

// Attempt to delete user account
async function deleteMyAccount() {
  const { error } = await deleteAccount(profile.uuid, csrfToken);

  // If error, show error
  if (error) {
    deleteError.value = error;
    return;
  }
  
  // Clear store variables
  iamStore.setIsLoggedIn(false)
  iamStore.clearProfile()

  // Navigate to register
  navigateTo("/iam/register");
}
</script>

<style scoped>
.iam-password-input {
  min-width: 180px;
}
</style>
