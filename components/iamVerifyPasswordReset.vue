<template>
  <div>
    <NxAlert v-if="resetError" :show-close="false">
      <strong>{{ resetError.message }}</strong>
    </NxAlert>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { verifyReset } = useIam();

const resetError = ref(<Error | null>null);

// Get token from url parameters
const token = route.query.token as string;

// If verification fails
if (!token) navigateTo("/iam/verifyfailed");

// Attempt to reset password
try {
  const { data, error } = await verifyReset(token);

  // If a normal error occurs
  if (error) navigateTo(`/iam/verifyfailed`);

  // If successful
  if (data) navigateTo(`/iam/verifysuccessful?pass=${data.pass}`);
} catch (e) {
  // If some other error, like a server error, occurs
  // It's not wise to show server errors in the front end so console.log(e) below is commented out
  // console.log(e);
  resetError.value = {} as Error;
  resetError.value.message = "Error. Please contact an administrator.";
}
</script>
