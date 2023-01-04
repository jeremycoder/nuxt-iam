<template>
  <div>
    <div style="margin-left: 64px">
      <img src="~~/iam/ui/img/nuxt-iam-logo.png/" />
    </div>
    <h3>Your temporary password is {{ tempPassword }}</h3>
    <h3>Make sure you change it soon</h3>
  </div>
</template>

<script setup>
// Get token from route/
// This assumes route is [host]/iam/verifysuccessful?pass=[password]
const route = useRoute();
const tempPassword = route.fullPath.split("/iam/verifysuccessful?pass=")[1];
console.log(tempPassword.split("/iam/verifysuccessful?pass="));
</script>
