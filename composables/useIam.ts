import { JSONResponse } from "~~/iam/misc/types";

// Composable to make authentication tasks easier
export default function useIam() {
  return {
    register,
    login,
    logout,
    isAuthenticated,
    refresh,
    getProfile,
    updateProfile,
    deleteAccount,
  };
}

/**
 * @desc Register new user
 * @param firstName User's first name
 * @param lastName User's last name
 * @param email User's email address
 * @param password User's password
 * @returns {Promise<JSONResponse>}
 */
async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<JSONResponse> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;

  // Attempt register
  const response = await $fetch("/api/iam/authn/register", {
    method: "POST",
    headers: {
      "client-platform": clientPlatform,
    },
    body: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    },
  });

  return response;
}

/**
 * @desc Register new user
 * @param firstName User's first name
 * @param lastName User's last name
 * @param email User's email address
 * @param password User's password
 * @returns {Promise<JSONResponse>}
 */
async function login(email: string, password: string): Promise<JSONResponse> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;

  // Attempt login
  const response = await $fetch("/api/iam/authn/login", {
    method: "POST",
    headers: {
      "client-platform": clientPlatform,
    },
    body: {
      email: email,
      password: password,
    },
  });

  return response;
}

/**
 * @desc Returns user profile if successful
 * @returns {Promise<JSONResponse>}
 */
async function updateProfile(
  uuid: string,
  firstName: string,
  lastName: string,
  currentPassword?: string,
  newPassword?: string
): Promise<JSONResponse> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;

  const response = await $fetch("/api/iam/authn/update", {
    method: "PUT",
    headers: {
      "client-platform": clientPlatform,
    },
    body: {
      uuid: uuid,
      first_name: firstName,
      last_name: lastName,
      current_password: currentPassword,
      new_password: newPassword,
    },
  });

  return response;
}

/**
 * @desc Get user profile
 * @returns {Promise<JSONResponse>}
 */
async function getProfile(): Promise<JSONResponse> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;

  const response = await $fetch("/api/iam/authn/profile", {
    headers: {
      "client-platform": clientPlatform,
    },
  });

  return response;
}

/**
 * @desc Attempt to log user out
 * @returns {Promise<JSONResponse>}
 */
async function logout(): Promise<JSONResponse> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;

  // Attempt logout
  const response = await $fetch("/api/iam/authn/logout", {
    method: "POST",
    headers: {
      "client-platform": clientPlatform,
    },
  });

  return response;
}

/**
 * @desc Returns true/false depending on whether the user is logged in or not
 * @returns {Promise<boolean>}
 */
async function isAuthenticated(): Promise<boolean> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;
  let isAuthenticated = false;

  // Api response always has status, data, or error
  const { status, error } = await $fetch("/api/iam/authn/isauthenticated", {
    headers: {
      "client-platform": clientPlatform,
    },
  });

  // If status is 'fail', not authenticated
  if (status === "fail") {
    if (error) console.log("error: ", error);
    isAuthenticated = false;
  }

  // If status is 'success', not authenticated
  if (status === "success") {
    isAuthenticated = true;
  }

  return isAuthenticated;
}

/**
 * @desc Attempts to refresh tokens
 * @returns {Promise<JSONResponse>}
 */
async function refresh(): Promise<JSONResponse> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;
  // Attempt login
  const response = await $fetch("/api/iam/authn/refresh", {
    method: "POST",
    headers: {
      "client-platform": clientPlatform,
    },
  });

  return response;
}

/**
 * @desc Delete user account
 * @returns {Promise<JSONResponse>}
 */
async function deleteAccount(uuid: string): Promise<JSONResponse> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;

  const response = await $fetch("/api/iam/authn/delete", {
    method: "DELETE",
    headers: {
      "client-platform": clientPlatform,
    },
    body: {
      uuid: uuid,
    },
  });

  return response;
}
