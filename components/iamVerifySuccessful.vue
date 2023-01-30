<template>
  <div class="container">
    <div>
      <NuxtLink to="/iam/"
        ><img src="~~/iam/ui/img/nuxt-iam-logo.png/" style="width: 200px"
      /></NuxtLink>
    </div>
    <h3>Your temporary password is {{ tempPassword }}</h3>
    <h3>Copy it, log in, and change it.</h3>
  </div>
</template>

<script setup>
// Get token from route/
// This assumes route is [host]/iam/verifysuccessful?pass=[password]
const route = useRoute();
const tempPassword = route.fullPath.split("/iam/verifysuccessful?pass=")[1];
console.log(tempPassword.split("/iam/verifysuccessful?pass="));
</script>
