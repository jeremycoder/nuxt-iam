<template>
  <div class="container">
    <h1>Contact</h1>
    <p>Today's date comes from a plugin: <strong>{{ today }}</strong></p>
  </div>
</template>

<script setup>
// This is how you get data from a plugin
// plugins folder
const nuxtApp = useNuxtApp();
const today = nuxtApp.today;

</script>