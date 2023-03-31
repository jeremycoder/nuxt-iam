<template>
  <div>
    <h1>Admin 2</h1>
    <iamUsersTable  />
  </div>
</template>

<script setup lang="ts">

// This page is only viewable by people with admin authorization
// This makes things so much simpler
// definePageMeta({
//   middleware: 'iam-admin-authorized'
// })
</script>
