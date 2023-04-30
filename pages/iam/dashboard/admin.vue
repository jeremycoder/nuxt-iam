<template>
  <div>
    <h1>Admin</h1>
    <p>This is your admin center.</p>
    <iamUsersTable  />
    <hr />
    <iamRefreshTokensTable  />
  </div>
</template>

<script setup lang="ts">
// This page is only viewable by people with admin authorization
definePageMeta({
  middleware: 'iam-can-access-admin'
})
</script>
