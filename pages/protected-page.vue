<template>
  <div class="container">
    <h1>Protected page</h1>
    <p>This is a protected page. If you can see it, then you are logged in!</p>
  </div>
</template>

<script setup>

definePageMeta({
  middleware: 'iam-authenticated'
})

useHead({
  title: "Sample protected page",  
});
</script>