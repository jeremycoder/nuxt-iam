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
// TODO: This is being called twice or something. Please fix. User cannot get to updated password
// TODO: Maybe send response directly to api
const { status, data, error } = await verifyReset(token);

// If verification fails, navigate to a verify failed page
if (error) router.push(`/iam/verifyfailed`);

// If navigate to verify successful page
if (data) router.push(`/iam/verifysuccessful?pass=${data.pass}`);
</script>
