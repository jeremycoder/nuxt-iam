<template>  
  <div v-if="iAmLoggedIn" class="is-logged-in">
    <div class="logged-in-logo-menu">      
      <NxNavbar :menu="isLoggedInMenu" theme="none" @clicked="menuClicked" />
    </div>
    <div class="avatar-block">
      <div class="avatar-dropdown">
        <NxDropdown :menu="profileMenu" @clicked="menuClicked">
          <NxAvatar 
            :src="avatar ? avatar : ''" 
            :name="`${firstName} ${lastName}`" 
            :title="`${firstName} ${lastName}`"
            :show-arrow="true" 
          />
        </NxDropdown> 
      </div>          
    </div>     
  </div>  
  <div v-else class="is-not-logged-in">      
    <NxNavbar
      :menu="isNotLoggedInMenu" 
      theme="none"
      class="login-register-menu"
      @clicked="menuClicked"
    /> 
  </div>
</template>

<script setup lang="ts">
import { useIamProfileStore } from '@/stores/useIamProfileStore'
import { NxLink, NxLinks, User } from "~~/iam/misc/types";

const iamStore = useIamProfileStore()
const { getProfile, logout } = useIam();

const iAmLoggedIn = ref(false);
const isAdmin = ref(false)

// Menu when user is not logged in
const isNotLoggedInMenu = [
  {
    name: 'Login',
    link: '/iam/login'
  },
  {
    name: 'Register',
    link: '/iam/register'
  },
]

// Menu when user is logged in
const isLoggedInMenu = [
  {
    name: 'Dashboard',
    link: '/iam/dashboard'
  },  
] as NxLinks

// User profile menu
const profileMenu = [
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

// Logged in user variables
const firstName = ref(<string|undefined>(undefined))
const lastName = ref(<string|undefined>(undefined))
const avatar = ref(<string|undefined>(undefined))

// TODO: Computed property isAdmin to check if user is admin,
// TODO: If isAdmin push Admin object link into isLoggedIn Menu

// Watch if store if user is logged in
iamStore.$subscribe(async (mutation, state) => { 
  iAmLoggedIn.value = state.isLoggedIn

  // Once logged in, get a few user attributes
  if (iAmLoggedIn.value) {
    const profile = iamStore.getProfile
    if (profile) {
      firstName.value = profile.firstName
      lastName.value = profile.lastName
      avatar.value = profile.avatar
    }
  }

  // If user is logged in, check if user has admin authorization
  // if (iAmLoggedIn.value)
  //   await checkAdminAuthorization()
  //  else 
  //   isAdmin.value = false
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

<style scoped>
.is-logged-in, .is-not-logged-in {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.login-register-menu {
  margin-left: auto;
}

.logged-in-logo-menu {
  display: flex;
  align-items: center;
}

.avatar-block {
  margin-left: auto;
  display: flex;
}

.avatar-dropdown {
  display: flex;
  align-items: center;
}
</style>