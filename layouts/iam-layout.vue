<template>
  <div>
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <NuxtLink to="/" class="nav-link px-2 link-dark"><span>Logged in header</span></NuxtLink>

      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">               
        <li><NuxtLink to="/" class="nav-link px-2 link-dark">Home</NuxtLink></li>        
        <li><NuxtLink to="/iam/" class="nav-link px-2 link-dark">IAM</NuxtLink></li>        
        <li><NuxtLink to="/sample-page" class="nav-link px-2 link-dark">Sample Page</NuxtLink></li>        
        <li><NuxtLink to="/contact" class="nav-link px-2 link-dark">Contact</NuxtLink></li>       
        
      </ul>

      <div class="col-md-3 text-end">
        <NuxtLink to="/iam/login"><button type="button" class="btn btn-outline-primary me-2">Login</button></NuxtLink>
        <NuxtLink to="/iam/register"><button type="button" class="btn btn-primary">Register</button></NuxtLink>
      </div>
    </header>    
    <slot />
  </div>
</template>