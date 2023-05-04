import { JSONResponse, User } from "~~/iam/misc/types";

// Composable to make authentication tasks easier
export default function useIam() {
  return {
    register,
    login,
    logout,
    isAuthenticated,
    refresh,
    getProfile,
    loginWithGoogle,
    updateProfile,
    deleteAccount,
    resetPassword,
    verifyReset,
    verifyEmail,
    verifyEmailToken,
  };
}

/**
 * @desc Register new user
 * @param user User to register
 * @returns {Promise<JSONResponse>}
 */
async function register(user: User): Promise<JSONResponse> {
  // Attempt register
  const response = await $fetch("/api/iam/authn/register", {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
    body: user,
  });

  return response;
}

/**
 * @desc Register new user
 * @param user User to log in
 * @returns {Promise<JSONResponse>}
 */
async function login(user: User): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/login", {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
    body: user,
  });

  return response;
}

/**
 * @desc Update user profile
 * @returns {Promise<JSONResponse>}
 */

async function updateProfile(user: User): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/update", {
    method: "PUT",
    headers: {
      "client-platform": "browser",
    },
    body: user,
  });

  return response;
}

/**
 * @desc Get user profile
 * @returns {Promise<JSONResponse>}
 */
async function getProfile(): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/profile", {
    headers: {
      "client-platform": "browser",
    },
  });

  return response;
}

/**
 * @desc Attempt to log user out
 * @returns {Promise<JSONResponse>}
 */
async function logout(): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/logout", {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
  });

  return response;
}

/**
 * @desc Receives user token from Google login, and signs user
 * @param token Access token received from Google after login
 * @returns {Promise<JSONResponse>}
 */
async function loginWithGoogle(token: string): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/login-google", {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
    body: {
      token: token,
    },
  });

  return response;
}

/**
 * @desc Returns true/false depending on whether the user is logged in or not
 * @returns {Promise<boolean>}
 */
async function isAuthenticated(): Promise<boolean> {
  // Api response always has status, data, or error
  const { status } = await $fetch("/api/iam/authn/isauthenticated", {
    headers: {
      "client-platform": "browser",
    },
  });

  // If status is success, then user is authenticated, and return true, otherwise return false
  return status === "success";
}

/**
 * @desc Attempts to refresh tokens
 * @returns {Promise<JSONResponse>}
 */
async function refresh(): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/refresh", {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
  });

  return response;
}

/**
 * @desc Delete user account
 * @returns {Promise<JSONResponse>}
 */
async function deleteAccount(
  uuid: string,
  csrfToken: string
): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/delete", {
    method: "DELETE",
    headers: {
      "client-platform": "browser",
    },
    body: {
      uuid: uuid,
      csrf_token: csrfToken,
    },
  });

  return response;
}

/**
 * @desc Reset user's password
 * @returns {Promise<JSONResponse>}
 */
async function resetPassword(email: string): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/reset", {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
    body: {
      email: email,
    },
  });

  return response;
}

/**
 * @desc Verify reset password token sent by user
 * @returns {Promise<JSONResponse>}
 */
async function verifyReset(token: string): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/verifyreset", {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
    body: {
      token: token,
    },
  });

  return response;
}

/**
 * @desc Verify user email after registration
 * @returns {Promise<JSONResponse>}
 */
async function verifyEmail(email: string): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/verifyemail", {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
    body: {
      email: email,
    },
  });

  return response;
}

/**
 * @desc Verify email verification token sent by user
 * @returns {Promise<JSONResponse>}
 */
async function verifyEmailToken(token: string): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/authn/verifyemailtoken", {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
    body: {
      token: token,
    },
  });

  return response;
}
