<template>
  <div>
    <h1>Admin 2</h1>
    <p class="lead">This is your admin center.</p>
    <iamUsersTable  />
    <hr class="my-4" />
    <iamRefreshTokensTable  />
  </div>
</template>

<script setup lang="ts">

// This page is only viewable by people with admin authorization
// This makes things so much simpler
// definePageMeta({
//   middleware: 'iam-admin-authorized'
// })
</script>
