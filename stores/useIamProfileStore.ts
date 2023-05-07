// Pinia store to store user profile
//! Do not store sensitive data in here.
//! Avoid storing permissions. Rather, always check permissions from backend.

import { User, NxFormInput } from "~~/iam/misc/types";
import { defineStore } from "pinia";

export const useIamProfileStore = defineStore("iamProfile", () => {
  const myProfile = ref(<User | null>null);
  const isLoggedIn = ref(false);
  const updateCount = ref(0);

  // Returns the profile
  const getProfile = computed(() => myProfile.value);

  /**
   * @desc Sets profile
   * @param profile
   */
  function setProfile(profile: User) {
    if (profile) myProfile.value = profile;
  }

  /**
   * @desc Sets whether user is logged in
   */
  function setIsLoggedIn(value: boolean) {
    isLoggedIn.value = value;
  }

  /**
   * @desc Clears profile
   */
  function clearProfile() {
    myProfile.value = null;
  }

  /**
   * @desc Increases updateCount whenever an update is made
   */
  function setUpdateCount() {
    updateCount.value++;
  }

  return {
    setProfile,
    getProfile,
    setIsLoggedIn,
    isLoggedIn,
    clearProfile,
    setUpdateCount,
    updateCount,
  };
});
