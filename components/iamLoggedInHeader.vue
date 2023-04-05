<template>
  <header v-if="iAmLoggedIn" class="mb-3 border-bottom">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <NuxtLink class="text-decoration-none text-center" to="/iam/dashboard">
          <img src="~~/iam/ui/img/nuxt-iam-logo-symbol.png" style="width: 14%; display: inline" />
            <span style="color: #184b81">Nuxt<b>IAM</b></span>
        </NuxtLink>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><NuxtLink class="nav-link px-2 link-secondary" to="/iam/dashboard">Dashboard</NuxtLink></li>                  
          <li v-if="isAdmin"><NuxtLink class="nav-link px-2 link-dark" to="/iam/dashboard/admin">Admin</NuxtLink></li>                                    
        </ul>
      <div>                     
    </div>
    </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useIamProfileStore } from '@/stores/useIamProfileStore'

// Pinia store
const iamStore = useIamProfileStore()
const iAmLoggedIn = ref(false);

// Watch if store if user is logged in
iamStore.$subscribe((mutation, state) => { 
  iAmLoggedIn.value = state.isLoggedIn
})

// Get user profile (will only work if user is logged in)
const { getProfile } = useIam();
let profile = null
let isAdmin = false
const response = await getProfile()

if (response.status === 'success') {
  profile = response.data
  
  if (profile)
    if (profile.role === 'SUPER_ADMIN' && profile.email_verified && profile.permissions && profile.permissions.includes('canAccessAdmin'))
      isAdmin = true  
}
</script>