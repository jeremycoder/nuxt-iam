<template>
  <div>
    <div class="text-center">
      <IamLogo />
    </div>
    <h1 class="text-center">Your Nuxt Authentication Starter App!</h1>
    <div class="text-center">
      <p>
        Quickly build an amazing app with the Nuxt IAM starter kit. It comes
        with Nuxt IAM auth framework to help you get started quickly.
      </p>
      <div class="more-buttons">
        <NxButton
          class="learn-more-button"
          theme="warning"
          size="large"
          @click="navigateTo('/iam/')"
          >Learn More</NxButton
        >
        <NxButton theme="primary" size="large" @click="navigateTo('/iam/')"
          >Docs</NxButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Home Page - Nuxt IAM Sample app",
});
</script>

<style scoped>
.text-center {
  text-align: center;
}

.more-buttons {
  display: flex;
  justify-content: center;
}

.learn-more-button {
  margin-right: 1rem;
}
</style>
