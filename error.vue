<template>
  <div>
    <div v-if="props.error.statusCode === 500">
      <h1>Oh, oh, server error</h1>      
    </div>
    <div v-else="props.error.statusCode === 404">
      <h1>Oh, no page does not exist!</h1>      
    </div>
    <div v-else>
      <h1>We have an error!</h1>
    </div>
    <button @click="handleError">Clear errors</button>
  </div>  
</template>


<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>
