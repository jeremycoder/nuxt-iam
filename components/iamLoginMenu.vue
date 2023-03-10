<template>
  <div v-if="!iAmLoggedIn">   
      <ul class="nav">      
        <li><NuxtLink to="/iam/login" class="nav-link px-2 link-dark">Login</NuxtLink></li> 
        <li><NuxtLink to="/iam/register" class="nav-link px-2 link-dark">Register</NuxtLink></li>           
      </ul>      
  </div>
  <div v-else>         
    <div class="dropdown text-end" @click="toggleMenu">
      <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <span v-if="firstName && lastName">
          <strong>{{ firstName }} {{ lastName }}</strong>
        </span>
        <span v-if="avatar">
          <img :src="avatar" alt="profile picture" width="32" height="32" class="ms-2 rounded-circle">
        </span>
        <span v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            class="bi bi-person-circle ms-2"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path
              fill-rule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
            />
          </svg>
        </span>       
      </a>
      <ul 
        class="dropdown-menu text-small"
        :class="showMenu ? 'show' : ''"
      > 
        <li><NuxtLink class="dropdown-item" to="/iam/dashboard">Dashboard</NuxtLink></li>  
        <li><NuxtLink class="dropdown-item" to="/iam/dashboard/profile">Profile</NuxtLink></li>
        <li><NuxtLink class="dropdown-item" to="/iam/dashboard/settings">Settings</NuxtLink></li>        
        <li><hr class="dropdown-divider"></li>
        <li @click="logMeOut"><span class="dropdown-item">Logout</span></li>
      </ul>
    </div>            
  </div>        
</template>

<script setup lang="ts">
import { useIamProfileStore } from '@/stores/useIamProfileStore'

// Pinia store for iamProfile
const iamStore = useIamProfileStore()
const { logout } = useIam();

const iAmLoggedIn = ref(false);
const showMenu = ref(false);

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
 * @Desc Toggle profile menu
 */
 async function toggleMenu() {
  showMenu.value = !showMenu.value;  
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