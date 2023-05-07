<template>
  <footer class="py-3 my-4">
    <p class="text-muted text-center"><slot /></p>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.py-3 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.my-4 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: #6c757d;
}

footer {
  border-top: 1px solid #dee2e6;
}
</style>
