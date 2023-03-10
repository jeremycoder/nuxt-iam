<template>
  <div>
    <h1 class="mt-5">Profile</h1>
    <p class="lead">Update your profile</p>
  </div>
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

  <div class="row">
      <div class="col">
        <div class="card mb-3 mx-10" style="max-width: 25rem">
          <h4 class="card-header">Profile</h4>
          <div class="card-body">
            <h5 class="card-title">Update Profile</h5>
            <p>Update your profile below.</p>
            <!-- Data here-->
            <form class="mb-5">
              <div class="mb-3">
                <label for="uuid" class="form-label">Uuid</label>
                <input
                  type="text"
                  class="form-control mb-3"
                  id="uuid"                
                  :value="$attrs.profile.uuid"
                  disabled
                />
                <label for="first_name" class="form-label">First name</label>
                <input
                  v-model="profile.firstName"
                  type="text"
                  class="form-control mb-3"
                  id="first_name"                  
                />
                <label for="last_name" class="form-label">Last name</label>
                <input
                  v-model="profile.lastName"
                  type="text"
                  class="form-control mb-3"
                  id="last_name"                  
                />
                <label for="email" class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control mb-3"
                  id="email"                  
                  :value="$attrs.profile.email"
                  disabled
                />
                <label for="role" class="form-label">Role</label>
                <input
                  type="text"
                  class="form-control mb-3"
                  id="role"                  
                  :value="$attrs.profile.role"
                  disabled
                />
                <label for="is_active" class="form-label">Is Active</label>
                <input
                  type="text"
                  class="form-control mb-3"
                  id="is_active"                  
                  :value="$attrs.profile.isActive"
                  disabled
                />
                <label for="permissions" class="form-label">Permissions</label>
                <textarea
                  type="text"
                  class="form-control mb-3"
                  id="permissions"                  
                  :value="$attrs.profile.permissions"
                  disabled
                ></textarea>               
              </div>
              <button
                type="submit"
                class="btn btn-primary"
                @click.prevent="updateMyProfile()"
              >
                Update My Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>  
</template>

<script setup>
const emit = defineEmits(["profileUpdate"]);

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

// Csrf token should be part of profile
const csrfToken = attrs.profile.csrfToken;

// Attempt to update user profile
async function updateMyProfile() {
  if (
    profile.firstName === attrs.profile.firstName &&
    profile.lastName === attrs.profile.lastName
  )
    return;

  // Object with updatable values
  const values = {
    uuid: profile.uuid,
    firstName: profile.firstName,
    lastName: profile.lastName,
    csrfToken: csrfToken,
  };

  const { error, data } = await updateProfile(values);

  // If error, display error
  if (error) {
    console.log("error: ", error);
    profileError.value = error;
    return;
  }

  updateSuccessful.value = true;

  emit("profileUpdate");
}
</script>
