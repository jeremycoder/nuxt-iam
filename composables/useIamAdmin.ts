import { JSONResponse, User } from "~~/iam/misc/types";

// Composable to make user management tasks easier
export default function useIamAdmin() {
  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    userHasPermission,
    getRefreshTokens,
    deleteRefreshToken,
    deleteRefreshTokens,
  };
}

/**
 * @desc Get users
 * @returns {Promise<JSONResponse>}
 */
async function getUsers(): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/users", {
    headers: {
      "client-platform": "browser",
    },
  }); 

  return response;
}

/**
 * @desc Create a user
 * @param user User to create
 * @returns {Promise<JSONResponse>}
 */
async function createUser(user: User): Promise<JSONResponse> {  
  const response = await $fetch(`/api/iam/authn/register`, {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
    body: user,
  });
  
  return response;
}

/**
 * @desc Update a user
 * @param uuid User's uuid
 * @param values User record's editable values
 * @returns {Promise<JSONResponse>}
 */
async function updateUser(user: User): Promise<JSONResponse> {
  const response = await $fetch(`/api/iam/users/${user.uuid}`, {
    method: "PUT",
    headers: {
      "client-platform": "browser",
    },
    body: user,
  });

  console.log('Response: ', response)
  return response;
}

/**
 * @desc Delete a user
 * @uuid User uuid
 * @csrfToken Cross-site request forgery prevention token
 * @returns {Promise<JSONResponse>}
 */
async function deleteUser(user: User): Promise<JSONResponse> {
  const response = await $fetch(`/api/iam/users/${user.uuid}`, {
    method: "DELETE",
    headers: {
      "client-platform": "browser",
    },
    body: {
      csrf_token: user.csrf_token,
    },
  });

  return response;
}

/**
 * @desc Check user permission
 * @returns {Promise<JSONResponse>}
 */
async function userHasPermission(user: User, permission: string): Promise<JSONResponse> {
  const response = await $fetch(`/api/iam/users/${user.uuid}/permission/${permission}`, {
    headers: {
      "client-platform": "browser",
    },
  }); 

  return response;
}

/**
 * @desc Get all refresh tokens
 * @returns {Promise<JSONResponse>}
 */
async function getRefreshTokens(): Promise<JSONResponse> {
  const response = await $fetch("/api/iam/refresh-tokens", {
    headers: {
      "client-platform": "browser",
    },
  });

  return response;
}

/**
 * @desc Delete a refresh token
 * @returns {Promise<JSONResponse>}
 */
async function deleteRefreshToken(
  id: number,
  csrfToken: string
): Promise<JSONResponse> {
  const response = await $fetch(`/api/iam/refresh-tokens/${id}`, {
    method: "DELETE",
    headers: {
      "client-platform": "browser",
    },
    body: {
      csrf_token: csrfToken,
    },
  });

  return response;
}

/**
 * @desc Deletes all refresh token
 * @returns {Promise<JSONResponse>}
 */
async function deleteRefreshTokens(csrfToken: string): Promise<JSONResponse> {
  const response = await $fetch(`/api/iam/refresh-tokens/`, {
    method: "DELETE",
    headers: {
      "client-platform": "browser",
    },
    body: {
      csrf_token: csrfToken,
    },
  });

  return response;
}
