<template>
  <div class="container">
    <div class="page-header">
      <h2>Settings</h2>
    </div>
    <p>Update your settings here.</p>
    <!-- Settings errors notification -->
    <div
      v-if="settingsError"
      class="alert alert-danger alert-dismissable"
      role="alert"
    >
      <button
        @click="settingsError = null"
        type="button"
        class="close"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span></button
      >{{ settingsError.message }}
    </div>
    <!-- Settings success notification -->
    <div
      v-if="updateSuccessful"
      class="alert alert-success alert-dismissable"
      role="alert"
    >
      <button
        @click="updateSuccessful = false"
        type="button"
        class="close"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span></button
      >Password updated successfully
    </div>
    <h3>Update your password</h3>
    <form>
      <div class="form-group">
        <label>Current password</label>
        <input
          type="password"
          class="form-control"
          style="display: block; margin: 0 0 15px 0; width: 300px"
        />
        <label>New password</label>
        <input
          type="password"
          class="form-control"
          style="display: block; margin: 0 0 15px 0; width: 300px"
        />
        <label>Confirm password</label>
        <input
          type="password"
          class="form-control"
          style="display: block; margin: 0 0 15px 0; width: 300px"
        />
      </div>
      <button
        class="btn btn-primary"
        style="display: block"
        @click.prevent="updateMyProfile()"
      >
        Update Password
      </button>
    </form>
  </div>
</template>

<script setup>
const { updateProfile } = useIam();
const updateSuccessful = ref(false);
let settingsError = ref(null);

// Some profile values
const profile = {
  uuid: "",
  firstName: "",
  lastName: "",
};

// Get profile passed through attributes
const attrs = useAttrs();
profile.uuid = attrs.profile.uuid;
profile.firstName = attrs.profile.firstName;
profile.lastName = attrs.profile.lastName;

// Attempt to update user profile
async function updateMyProfile() {
  if (
    profile.firstName === attrs.profile.firstName &&
    profile.lastName === attrs.profile.lastName
  )
    return;

  const { error } = await updateProfile(
    profile.uuid,
    profile.firstName,
    profile.lastName
  );

  // If error, display error
  if (error) {
    console.log("error: ", error);
    settingsError.value = error;
    return;
  }

  updateSuccessful.value = true;
}

// Attempt to update user profile with password
async function updateMyProfileWithPassword(profile) {
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

  const { status, data, error } = await updateProfile(
    profile.uuid,
    profile.firstName,
    profile.lastName,
    profile.currentPassword,
    profile.newPassword,
    profile.confirmNewPassword
  );

  // If error, display error
  if (error) {
    console.log("error: ", error);
    profileError.value = error;
    return;
  }

  console.log("status: ", status);
  console.log("data: ", data);
  updateSuccessful.value = true;
}
</script>
