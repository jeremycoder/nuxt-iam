<template>
  <div>
    <h1>Admin</h1>
    <p class="lead">This is your admin center.</p>
    <iamUsersTable  />
    <hr class="my-4" />
    <iamRefreshTokensTable  />
  </div>
</template>

<script setup lang="ts">

// This page is only viewable by people with admin authorization
definePageMeta({
  middleware: 'iam-can-access-admin'
})
</script>
