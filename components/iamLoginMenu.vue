<template>
  <div v-if="!iAmLoggedIn">   
      <ul>      
        <li><NuxtLink to="/iam/login">Login</NuxtLink></li> 
        <li><NuxtLink to="/iam/register">Register</NuxtLink></li>           
      </ul>      
  </div>
  <div v-else>         
    <div>      
      <NxDropdown :menu="loggedInMenu" @clicked="menuClicked">
        <NxAvatar 
          :src="avatar ? avatar : ''" 
          :name="`${firstName} ${lastName}`" 
          :title="`${firstName} ${lastName}`"
          :show-arrow="true" 
        />
      </NxDropdown>      
    </div> 
    
    <!---->
  </div>        
</template>

<script setup lang="ts">
import { useIamProfileStore } from '@/stores/useIamProfileStore'
import { NxLink, NxLinks } from "~~/iam/misc/types";

// Pinia store for iamProfile
const iamStore = useIamProfileStore()
const { logout } = useIam();

const iAmLoggedIn = ref(false);

// Menu when user is logged in
const loggedInMenu = [
  {
    name: 'Dashboard',
    link: '/iam/dashboard'
  },
  {
    name: 'Profile',
    link: '/iam/dashboard/profile'
  },
  {
    name: 'Settings',
    link: '/iam/dashboard/settings',
    hasBorder: true,
  },
  {
    name: 'Logout',
  },
] as NxLinks

// Profile variables
const firstName = ref(<string|undefined>(undefined))
const lastName = ref(<string|undefined>(undefined))
const avatar = ref(<string|undefined>(undefined))

// Watch the iamProfile store
iamStore.$subscribe((mutation, state) => { 
  iAmLoggedIn.value = state.isLoggedIn
 
  // If profile values
  if (iAmLoggedIn.value) {
    const temp = iamStore.getProfile
    if (temp) {
      firstName.value = temp.firstName
      lastName.value = temp.lastName
      avatar.value = temp.avatar
    }
  }
})

/**
 * @desc Processes clicked menu item
 * @param link Clicked menu item
 */
function menuClicked(menuItem: NxLink) {
  if (menuItem.name === 'Logout')
    logMeOut()
  else
    navigateTo(menuItem.link)  
}

/**
 * @Desc Log user out
 */
async function logMeOut() {
  const { status } = await logout();
  if (status === "success") {
    
    // Clear store variables
    iamStore.setIsLoggedIn(false)
    iamStore.clearProfile()

    navigateTo("/iam/login");
  }
}

</script>