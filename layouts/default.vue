<template>
  <div class="container">
    <nav class="py-2 bg-light border-bottom">
      <div class="container d-flex flex-wrap">
        <ul class="nav me-auto">          
          <li><NuxtLink to="/" class="nav-link px-2 link-dark" aria-current="page"><strong>LOGO</strong></NuxtLink></li>
          <li><NuxtLink to="/" class="nav-link px-2 link-dark active" aria-current="page">Home</NuxtLink></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" :class="showMenu ? 'show' : ''" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false" @click="toggleDocsMenu">Nuxt IAM</a>
            <ul class="dropdown-menu" :class="showMenu ? 'show' : ''">
              <li><NuxtLink to="/iam/" class="dropdown-item">What is it?</NuxtLink></li>
              <li><NuxtLink to="/iam/docs/" class="dropdown-item">Introduction</NuxtLink></li>
              <li><NuxtLink to="/iam/docs/getting-started" class="dropdown-item">Getting Started</NuxtLink></li>
              <li><NuxtLink to="/iam/docs/concepts" class="dropdown-item">Concepts</NuxtLink></li>
              <li><NuxtLink to="/iam/docs/features" class="dropdown-item">Features</NuxtLink></li>
              <li><NuxtLink to="/iam/docs/frontend" class="dropdown-item">Front end</NuxtLink></li>
              <li><NuxtLink to="/iam/docs/configuration" class="dropdown-item">Configuration</NuxtLink></li>
              <li><NuxtLink to="/iam/docs/backend" class="dropdown-item">Back end</NuxtLink></li>
              <li><NuxtLink to="/iam/docs/files" class="dropdown-item">Files</NuxtLink></li>             
            </ul>
          </li>  
          <li><NuxtLink to="/sample-page" class="nav-link px-2 link-dark">Sample Page</NuxtLink></li>  
          <li><NuxtLink to="/protected-page" class="nav-link px-2 link-dark" title="You must be logged in to view this page">Protected Page</NuxtLink></li>  
          <li><NuxtLink to="/contact" class="nav-link px-2 link-dark">Contact</NuxtLink></li>         
        </ul>
        <iamLoginMenu />    
      </div>
    </nav>      
      <iamLoggedInHeader />
      <slot />
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <p class="col-md-4 mb-0 text-muted">&copy; 2023 My Company, Inc</p>

    <a href="/" class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
      <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"/></svg>
    </a>    
  </footer>
  </div>
</template>

<script setup>
const showMenu = ref(false);

/**
 * @Desc Toggle Nuxt IAM docs menu
 */
 async function toggleDocsMenu() {
  showMenu.value = !showMenu.value;   
}

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

      .b-example-divider {
        height: 3rem;
        background-color: rgba(0, 0, 0, .1);
        border: solid rgba(0, 0, 0, .15);
        border-width: 1px 0;
        box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
      }

      .b-example-vr {
        flex-shrink: 0;
        width: 1.5rem;
        height: 100vh;
      }

      .bi {
        vertical-align: -.125em;
        fill: currentColor;
      }

      .nav-scroller {
        position: relative;
        z-index: 2;
        height: 2.75rem;
        overflow-y: hidden;
      }

      .nav-scroller .nav {
        display: flex;
        flex-wrap: nowrap;
        padding-bottom: 1rem;
        margin-top: -1px;
        overflow-x: auto;
        text-align: center;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
      }
</style>
