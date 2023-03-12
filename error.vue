<template>
  <div class="container my-5 text-center">
    <div class="text-danger"><h1>ERROR</h1></div>
    <div v-if="props.error.statusCode === 500">
      <h2>Oh, oh, server error</h2>
      <p>This is a problem on our end. Contact customer service.</p>      
    </div>
    <div v-else-if="props.error.statusCode === 404">
      <h2>Oh, no page does not exist!</h2>
      <p>We don't have the page you're looking for.</p>      
    </div>
    <div v-else>
      <h1>We have an error!</h1>
      <p>Contact us to fix it.</p>
    </div>
    <button @click="handleError">Go to home page</button>
  </div>  
</template>


<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })

useHead({  
  link: {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    type: "text/css",
  },
  script: {
    src: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
  },
});
</script>
