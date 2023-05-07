<template>
  <div>
    <h3>Your temporary password is</h3>
    <code>{{ tempPassword }}</code>
    <h3>
      Copy it, <NuxtLink to="/iam/login">log in</NuxtLink>, and change it.
    </h3>
  </div>
</template>

<script setup>
// Get token from route/
// This assumes route is [host]/iam/verifysuccessful?pass=[password]
const route = useRoute();
const tempPassword = route.fullPath.split("/iam/verifysuccessful?pass=")[1];
</script>

<style scoped>
code {
  font-size: 200%;
}
</style>
