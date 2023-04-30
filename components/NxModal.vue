<template>
  <div class="iam-spec-modal" @click.self="close">
    <div class="iam-spec-modal-content" :style="`max-width:${maxWidth}rem`">
      <div class="title-bar">
        <div v-if="title" class="title" :title="title">{{ title }}</div>
        <div class="iam-spec-close" @click="close">&times;</div>
      </div>
      <div v-if="description" :title="description" class="description">{{ description }}</div>      
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);

defineProps({
  title: String,
  description: String,
  maxWidth: {
    type: Number,    
    default: 18,
  },
})

/**
 * @desc Do not display the form and emit 'close' 
 */
function close() {
  emit('close')
}
</script>

<style scoped>
/* The Modal (background) */
.iam-spec-modal {
  display: block;
  /* Hidden by default */
  position: fixed;
  /* Stay in place */
  z-index: 1;
  /* Sit on top */
  left: 0;
  top: 0;
  width: 100%;
  /* Full width */
  height: 100%;
  /* Full height */
  overflow: auto;
  /* Enable scroll if needed */
  background-color: rgb(0, 0, 0);
  /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4);
  /* Black w/ opacity */
}

.title-bar {
  display: flex;
  align-items: center;
}

.title {
  font-size: 120%;
}

.description {
  font-size: 95%;
  margin-bottom: 1rem;
}

/* Modal Content/Box */
.iam-spec-modal-content {
  margin: 15% auto;
  /* 15% from the top and centered */
  max-width: 370px;
  padding: 20px;
  border: 1px solid #888;
  background-color: #fff;
}

/* The Close Button */
.iam-spec-close {
  color: #aaa;
  margin-left:auto;  
  font-size: 280%;
  font-weight: bold;
}

.iam-spec-close:hover,
.iam-spec-close:focus {
  color: red;
  text-decoration: none;
  cursor: pointer;
}
</style>