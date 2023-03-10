// Store to store part of user profile for Nuxt IAM
//! Do not store sensitive data in here. Only store data that can be made public.

import { defineStore } from 'pinia'

interface SmallProfile {
  firstName: string,
  lastName: string,
  avatar?: string,  
}

export const useIamProfileStore = defineStore('iamProfile', () => {
  const myProfile = ref(<SmallProfile|null>(null))  
  const isLoggedIn = ref(false)
  const updateCount = ref(0)  
  
  // Returns the profile
  const getProfile = computed(() => myProfile.value)

  /**
   * @desc Sets profile
   * @param profile
   */
  function setProfile(profile: SmallProfile) {    
    if (profile) myProfile.value = profile    
  }

  /**
   * @desc Sets whether user is logged in  
   */
  function setIsLoggedIn(value: boolean) {    
    isLoggedIn.value = value    
  }

  /**
   * @desc Clears profile
   */
  function clearProfile() {
    myProfile.value = null
  }

  /**
   * @desc Increases updateCount whenever an update is made
   */
  function setUpdateCount() {
    updateCount.value++
  }


  return { setProfile, getProfile, clearProfile, setIsLoggedIn, isLoggedIn, setUpdateCount, updateCount }
})
