<template>
  <div class="container">
    <div class="page-header">
      <h2>Profile</h2>
    </div>
    <p>Update your profile here.</p>
    <!-- Profile errors notification -->
    <div
      v-if="profileError"
      class="alert alert-danger alert-dismissable"
      role="alert"
    >
      <button
        @click="profileError = null"
        type="button"
        class="close"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span></button
      >{{ profileError.message }}
    </div>
    <!-- Profile success notification -->
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
      >Profile updated successfully
    </div>
    <form>
      <div class="form-group">
        <label>Uuid</label>
        <input
          type="text"
          class="form-control"
          style="display: block; margin: 0 0 15px 0; width: 300px"
          :value="$attrs.profile.uuid"
          disabled
        />
        <label>Email</label>
        <input
          type="text"
          class="form-control"
          style="display: block; margin: 0 0 15px 0; width: 300px"
          :value="$attrs.profile.email"
          disabled
        />
        <label>Role</label>
        <input
          type="text"
          class="form-control"
          style="display: block; margin: 0 0 15px 0; width: 300px"
          :value="$attrs.profile.role"
          disabled
        />
        <label>First name</label>
        <input
          v-model="profile.firstName"
          type="text"
          class="form-control"
          placeholder="First name"
          style="display: block; margin: 0 0 15px 0; width: 300px"
        />
        <label>Last name</label>
        <input
          v-model="profile.lastName"
          type="text"
          class="form-control"
          placeholder="Last name"
          style="display: block; margin: 0 0 15px 0; width: 300px"
        />
      </div>
      <button
        class="btn btn-primary"
        style="display: block"
        @click.prevent="updateMyProfile()"
      >
        Update Profile
      </button>
    </form>
  </div>
</template>

<script setup>
const { updateProfile } = useIam();
const updateSuccessful = ref(false);
let profileError = ref(null);

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
    profileError.value = error;
    return;
  }

  updateSuccessful.value = true;
}
</script>
