<template>
  <div>
    <div class="container my-5">      
      <div
        class="row p-4 pb-0 pe-lg-0 align-items-center rounded-3 border shadow-lg"
      >           
        <div class="px-4 mb-5 text-center">
          <NuxtLink to="/iam/"><img class="d-block mx-auto" src="~~/iam/ui/img/nuxt-iam-logo.png/" alt="Nuxt IAM logo" width="200px" /></NuxtLink>
          <h1 class="display-5 fw-bold">Nuxt IAM Documentation</h1>
          <div class="col-lg-6 mx-auto">
            <p class="lead mb-4">The first Nuxt authentication framework.</p>
            <ul class="nav justify-content-center">              
              <li class="nav-item">                
                <NuxtLink to="/iam/" class="nav-link">IAM</NuxtLink>
              </li>
              <li class="nav-item">                
                <NuxtLink to="/iam/docs" class="nav-link">Docs</NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink to="/iam/docs/getting-started" class="nav-link">Getting Started</NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink to="/iam/docs/concepts" class="nav-link">Concepts</NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink to="/iam/docs/features" class="nav-link">Features</NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink to="/iam/docs/frontend" class="nav-link">Frontend</NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink to="/iam/docs/configuration" class="nav-link">Configuration</NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink to="/iam/docs/backend" class="nav-link">Backend</NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink to="/iam/docs/files" class="nav-link">Files</NuxtLink>
              </li>              
            </ul>        
          </div>
        </div>            
      </div>
    </div>
    <NuxtPage />    
  </div>
</template>

<script setup>
useHead({
  title: "Nuxt IAM - Identity and Access Management for Nuxt",
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

<style scoped>
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}
</style>
