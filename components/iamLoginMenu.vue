<template>
  <div v-if="!iAmLoggedIn">   
      <ul class="nav">      
        <li><NuxtLink to="/iam/login" class="nav-link px-2 link-dark">Login</NuxtLink></li> 
        <li><NuxtLink to="/iam/register" class="nav-link px-2 link-dark">Register</NuxtLink></li>           
      </ul>      
  </div>
  <div v-else>   
    <ul class="nav">      
      <li @click="logMeOut"><span class="nav-link px-2 link-dark">Logout</span></li>          
    </ul>      
  </div>        
</template>

<script setup lang="ts">
const { isAuthenticated, logout } = useIam();

const isLoaded = ref(false);
const iAmLoggedIn = ref(false);

onMounted(async () => {  
  await isLoggedIn();  
  isLoaded.value = true;
});

/**
 * @Desc Check if user is logged
 */
async function isLoggedIn() {
  iAmLoggedIn.value = await isAuthenticated();  
}

/**
 * @Desc Log user out
 */
async function logMeOut() {
  const { status } = await logout();
  if (status === "success") {
    navigateTo("/iam/login");
  }
}

</script>