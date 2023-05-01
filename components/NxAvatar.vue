<template>
  <span @click="avatarClicked" class="avatar">
    <span v-if="name" class="inline-block font-300">{{ name }}</span>
    <span v-if="src" class="inline-flex">
      <img :src="src" :alt="alt" :title="title" width="32" height="32">
    </span>
    <span v-else>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path fill-rule="evenodd"
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
      </svg>
    </span>
    <div v-if="showArrow" class="arrow">&#9660;</div>
  </span>
</template>

<script setup lang="ts">
defineProps({
  src: String,
  alt: String,
  title: String,
  name: String,
  showArrow: Boolean,
})

const emit = defineEmits(['click'])

/**
 * @desc Send event to parent when component is clicked
 */
function avatarClicked() {
  emit('click')
}
</script>

<style scoped>
img {
  border-radius: 50%;
  margin-left: 0.5em;
}

.inline-flex {
  display: inline-flex;
}

.inline-block {
  margin-top: 0.5em;
  display: inline-block;
}

.font-300 {
  font-weight: 300;
}

.arrow {
  margin-top: 0.5rem;
  margin-left: 0.5rem
}

.avatar {
  cursor: pointer;
  display: flex;
}

.ms-2 {
  margin-left: 0.50em;
}
</style>