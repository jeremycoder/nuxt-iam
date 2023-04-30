<template>
  <div class="card mb-3 mx-10 my-10" :style="`max-width: ${maxWidth}rem;`">
    <h4 class="card-header">{{ header }}</h4>
    <div class="card-body">
      <h5 class="card-title" :class="[themeClass]">{{ title }}</h5>
      <p>{{ text }}</p>
      <div class="m-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  header: String,
  maxWidth: {
    type: Number,    
    default: 18,
  },
  title: String,
  text: String,
  theme: {
    validator(value: string) {
      return ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark'].includes(value)
    },
    default: 'dark',
  },
})

const themeClasses = [
  {
    name: 'primary',
    class: 'text-primary'
  },
  {
    name: 'secondary',
    class: 'text-secondary'
  },
  {
    name: 'success',
    class: 'text-success'
  },
  {
    name: 'info',
    class: 'text-info'
  },
  {
    name: 'warning',
    class: 'text-warning'
  },
  {
    name: 'danger',
    class: 'text-danger'
  },
  {
    name: 'dark',
    class: ''
  }
]

const themeClass = computed(() => {
  const theme = themeClasses.find(theme => theme.name === props.theme)
  return theme?.class
})
</script>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, .125);
  border-radius: 0.25rem;
}

.mb-3 {
  margin-bottom: 1rem !important;
}

.card-header:first-child {
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
}

.card-header {
  padding: 0.5rem 1rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, .03);
  border-bottom: 1px solid rgba(0, 0, 0, .125);
}

h4 {
  font-size: calc(1.275rem + .3vw);
}

h5 {
  font-size: 1.25rem;
}

h4,
h5 {
  margin-top: 0;
  font-weight: 500;
  line-height: 1.2;
}

.card-title {
  margin-bottom: 0.5rem;
}

.card-body {
  flex: 1 1 auto;
  padding: 1rem 1rem;
}

.text-primary {
  color: #007bff !important;
}

.text-secondary {
  color: #6c757d !important;
}

.text-success {
  color: #28a745 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-info {
  color: #17a2b8 !important;
}

.text-danger {
  color: #dc3545 !important;
}


.m-4 {
  margin: 1rem 0;
}
</style>