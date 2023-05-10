<template>
  <div>
    <h1>Settings</h1>
    <p>Update your settings here.</p>
    <div class="cards">
      <NxCard
        header="Passwords"
        title="Update Password"
        class="password-card"
        theme="primary"
        text="Update your password below."
      >
        <!-- Profile errors alert -->
        <NxAlert
          v-if="profileError !== null"
          theme="danger"
          @click="profileError = null"
        >
          <strong>{{ profileError.message }}</strong>
        </NxAlert>

        <!-- Profile success alert -->
        <NxAlert
          v-if="updateSuccessful"
          theme="success"
          @click="updateSuccessful = false"
        >
          <strong>Profile updated successfully</strong>
        </NxAlert>

        <!-- Password update form -->
        <NxForm
          :data="passwordUpdateForm"
          submit-text="Update Password"
          @submit="updatePassword"
        />
      </NxCard>
      <NxCard
        header="Account"
        title="Delete Account"
        theme="danger"
        text="Deleting your account is a permanent action and cannot be undone.
              If you are sure you want to delete your account, click the button
              below."
        class="account-card"
      >
        <NxAlert v-if="deleteError" theme="danger" @click="deleteError = null">
          <strong>{{ deleteError.message }}</strong>
        </NxAlert>

        <NxButton theme="danger" @click="deleteMyAccount()"
          >Delete Account</NxButton
        >
      </NxCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, NxFormInput } from "~~/iam/misc/types";
import { useIamProfileStore } from "@/stores/useIamProfileStore";

// Type for updating passwords
type Passwords = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

const iamStore = useIamProfileStore();
const { updateProfile, deleteAccount } = useIam();
//const profile = useAttrs().profile as User;
const profile = iamStore.getProfile as User;
// console.log("profileStore: ", profileStore);

const updateSuccessful = ref(false);

// Error variables
const profileError = ref(<Error | null>null);
const deleteError = ref(<Error | null>null);

// Array to create password update form
const passwordUpdateForm = [
  {
    label: "Current Password",
    id: "current_password",
    type: "input:password",
  },
  {
    label: "New Password",
    id: "new_password",
    type: "input:password",
  },
  {
    label: "Confirm New Password",
    id: "confirm_password",
    type: "input:password",
  },
] as Array<NxFormInput>;

// Attempt to update user profile with password
async function updatePassword(passwords: Passwords) {
  // Check if any password is not supplied
  if (
    !passwords.current_password ||
    !passwords.new_password ||
    !passwords.confirm_password
  ) {
    profileError.value = {} as Error;
    profileError.value.message = "All passwords must be supplied";
    return;
  }

  // Check if new password and confirm password are the same
  if (passwords.new_password !== passwords.confirm_password) {
    profileError.value = {} as Error;
    profileError.value.message =
      "New password and confirm password do no match";
    return;
  }

  // Update profile with current password and new password
  profile.current_password = passwords.current_password;
  profile.new_password = passwords.new_password;

  const { error } = await updateProfile(profile);

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
  if (!profile.csrf_token) {
    profileError.value = {} as Error;
    profileError.value.message = "Missing csrf token";
    return;
  }

  const { error } = await deleteAccount(profile.uuid, profile.csrf_token);

  // If error, show error
  if (error) {
    deleteError.value = error;
    return;
  }

  // Clear store variables
  iamStore.setIsLoggedIn(false);
  iamStore.clearProfile();

  // Navigate to register
  navigateTo("/iam/register");
}
</script>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 768px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
