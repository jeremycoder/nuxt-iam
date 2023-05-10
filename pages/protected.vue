<template>
  <div v-if="isLoggedIn">
    <h1>Protected page</h1>
    <p>This is a protected page. If you can see it, then you are logged in!</p>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useIam();
const isLoggedIn = await isAuthenticated();

if (!isLoggedIn) navigateTo("iam/login");

useHead({
  title: "Sample protected page",
});
</script>
