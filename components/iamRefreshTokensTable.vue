<template>
  <div>
    <h3>Refresh Tokens Table</h3>
    <button
        type="button"
        class="btn btn-danger btn-sm mb-2 mt-2"
        @click="myProfile && myProfile.csrf_token ? deleteAllTokens(myProfile.csrf_token) : null"
      >
        Delete All
      </button>
      <p>
        <small
          >Deleting all will force every user to reauthenticate after their
          access tokens expire.</small
        >
      </p>       
    
    <!-- Error alert -->
    <div 
      v-if="refreshTokensError" 
      class="alert alert-danger alert-dismissible fade show" 
      role="alert">
      <strong>{{ refreshTokensError.message }}</strong>
      <button 
        type="button" 
        class="btn-close" 
        data-bs-dismiss="alert" 
        aria-label="Close" 
        @click="refreshTokensError = null">
      </button>
    </div>

    <!-- Success alert -->
    <div 
      v-if="refreshTokensSuccess" 
      class="alert alert-success alert-dismissible fade show" 
      role="alert">
      <strong>Success</strong>
      <button 
        type="button" 
        class="btn-close" 
        data-bs-dismiss="alert" 
        aria-label="Close" 
        @click="refreshTokensSuccess = false">
      </button>
    </div>         
      
    <!-- Display refresh tokens object as an HTML table -->
    <iamObjectsAsTable v-if="displayedTokens.length" 
      :data=displayedTokens
      :remove-edit="true"       
      @delete="deleteThisToken($event)" 
    />
  </div>
</template>

<script setup lang="ts">
import { RefreshToken, User } from "~~/iam/misc/types";

const { getRefreshTokens, deleteRefreshToken, deleteRefreshTokens, } = useIamAdmin();
const { getProfile  } = useIam()

const refreshTokensError = ref(<Error|null>(null))
const refreshTokensSuccess = ref(false)
const displayedTokens = ref([])
const myProfile = ref(<User|null>(null))

onMounted(async () => {
  await getAllRefreshTokens();  
  await getMyProfile();  
});

/**
 * @desc Get all refresh tokens
 */
async function getAllRefreshTokens() {
  const { status, error, data } = await getRefreshTokens()
  if (status === 'success') {
    displayedTokens.value = []
    displayedTokens.value = data    
  } else {    
    refreshTokensError.value = error
  }
}

/**
 * @desc Get logged in user's profile
 */
 async function getMyProfile() {
  const { status, error, data } = await getProfile()
  if (status === 'success') {
    myProfile.value = data       
  } else {    
    refreshTokensError.value = error
  }
}

/**
 * @desc Receive token to delete and send to back end
 * @param token Refresh token to delete
 */
async function deleteThisToken(token: RefreshToken){
  // Check for csrf token
  const csrfToken = myProfile.value?.csrf_token

  if (!csrfToken) {
    const error = {} as Error
    error.message = 'Missing csrf token'
    refreshTokensError.value = error
    return
  }

  // Attempt to delete refresh token
  const { status, error } = await deleteRefreshToken(token.id, csrfToken)

  if (status === 'success') {
    refreshTokensSuccess.value = true
    setTimeout(() => { refreshTokensSuccess.value = false; }, 2000);
    await getAllRefreshTokens()
  } else {    
    refreshTokensError.value = error
  }    
}

/**
 * @desc Deletes all refresh tokens
 * @param csrfToken The logged in user's csrf token
 */
async function deleteAllTokens(csrfToken: string) {
  const { status, error } = await deleteRefreshTokens(csrfToken)

  if (status === 'success') {
    refreshTokensSuccess.value = true
    setTimeout(() => { refreshTokensSuccess.value = false; }, 2000);
    await getAllRefreshTokens()
  } else {    
    refreshTokensError.value = error
  }  
}
</script>
