<template>
  <footer>
    <div class="text-muted text-center"><slot /></div>
  </footer>
</template>

<style scoped>
footer {
  padding-top: 1rem;
  padding-bottom: 1rem;
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
