<template>
  <div>
    <div style="margin-left: 64px">
      <img src="~~/iam/ui/img/nuxt-iam-logo.png/" />
    </div>
    <code>Your temporary password is {{ tempPassword }}</code>
    <p v-html="tempPassword"></p>
  </div>
</template>

<script setup>
// Get token from route
// current password for jeremynizamedia@gmail: 'J>1`&!k}_i[#-35#dej0'
// TODO: Figure out why not displaying all characters in html
const route = useRoute();

// Get temporary password
const tempPassword = route.query.pass;
</script>
