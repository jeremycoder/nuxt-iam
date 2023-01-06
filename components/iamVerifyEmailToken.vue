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
const { verifyEmailToken } = useIam();
const { status, data, error } = await verifyEmailToken(token);

// If verification fails, navigate to a verify failed page
if (error) router.push(`/iam/verifyfailed`);

// If successful, navigate to login page
if (data) router.push(`/iam/login?email_verify=true`);
</script>
