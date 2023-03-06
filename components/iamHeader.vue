<template>
  <header class="mb-3 border-bottom">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <NuxtLink class="navbar-brand" to="/iam/dashboard">
          <img src="~~/iam/ui/img/nuxt-iam-logo-symbol.png" style="width: 17%; display: inline" />
            <span style="color: #184b81">Nuxt<b>IAM</b></span>
          </NuxtLink>

          <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><a href="#" class="nav-link px-2 link-secondary">Dashboard</a></li>
            <li><a href="#" class="nav-link px-2 link-dark">Admin</a></li>
            <li><a href="#" class="nav-link px-2 link-dark">Profile</a></li>
            <li><a href="#" class="nav-link px-2 link-dark">Settings</a></li>
            <li><a href="#" class="nav-link px-2 link-dark">Products</a></li>          
          </ul>
        <div>
          
          <button class="btn btn-small btn-primary my-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Menu</button>
          <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasRightLabel">Offcanvas right</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              ...
            </div>
          </div>          
        </div>        
        
      </div>
    </div>
  </header>
</template>