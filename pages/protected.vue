<template>
  <div v-if="isLoaded && isLoggedIn">
    <h1>Protected page</h1>
    <p>This is a protected page. If you can see it, then you are logged in!</p>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useIam();
const isLoggedIn = ref(false);
const isLoaded = ref(false);

onMounted(async () => {
  isLoggedIn.value = await isAuthenticated();
  if (!isLoggedIn.value) navigateTo("iam/login");
  isLoaded.value = true;
});

useHead({
  title: "Sample protected page",
});
</script>
