<template>
  <div>
    <NuxtLink to="/iam/"
      ><img src="~~/iam/ui/img/nuxt-iam-logo.png/" style="width: 200px"
    /></NuxtLink>
    <h1 class="text-danger">
      Verification failed. Link expired or other error. &#128542;
    </h1>
  </div>
</template>

<style scoped>
.text-danger {
  color: #dc3545;
}
</style>
