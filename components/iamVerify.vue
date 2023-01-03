<template>
  <div />
</template>

<script setup>
// Get token from route
const route = useRoute();
const router = useRouter();

// Get token from url parameters
const token = route.query.token;

// If verification fails
if (!token) router.push(`/iam/verifyfailed`);

// Verify token
const { verifyReset } = useIam();
const { status, data, error } = await verifyReset(token);

// If verification fails, navigate to a verify failed page
if (error) router.push(`/iam/verifyfailed`);

// If successful, route to a page to input new password and pass user uuid
// Could have used 'success' here, but kept saying deprecated
if (data) router.push(`/iam/password?uuid=${data.uuid}`);
</script>
