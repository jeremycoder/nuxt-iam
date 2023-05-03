<template>
  <div v-if="iAmLoggedIn">
    <div>
      <NuxtLink to="/iam/dashboard">
        <img src="~~/iam/ui/img/nuxt-iam-logo-symbol.png" style="width: 14%; display: inline" />
          <span style="color: #184b81">Nuxt<b>IAM</b></span>
      </NuxtLink>
      <NxNavbar :menu="loggedInMenu" theme="none" />
      <li>Add Admin link only if user is admin</li>
    </div>    
  </div>
</template>

<script setup lang="ts">
import { NxLink, NxLinks } from "~~/iam/misc/types";
import { useIamProfileStore } from '@/stores/useIamProfileStore'

const iamStore = useIamProfileStore()
const { getProfile } = useIam();
const iAmLoggedIn = ref(false);
const isAdmin = ref(false)

const loggedInMenu = [
  {
    name: 'Dashboard',
    link: '/iam/dashboard'
  },
] as NxLinks

// Watch if store if user is logged in
iamStore.$subscribe(async (mutation, state) => { 
  iAmLoggedIn.value = state.isLoggedIn

  // If user is logged in, check if user has admin authorization
  if (iAmLoggedIn.value)
    await checkAdminAuthorization()
   else 
    isAdmin.value = false
})

/**
 * Checks if user has admin authorization
 */
async function checkAdminAuthorization() {
  const response = await getProfile()
  
  if (response.status === 'success') {
      const profile = response.data     
      
      if (profile)
        if (profile.role === 'SUPER_ADMIN' && profile.email_verified && profile.permissions && profile.permissions.includes('canAccessAdmin'))
          isAdmin.value = true  
    }
}
</script>