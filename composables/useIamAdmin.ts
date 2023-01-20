import { JSONResponse, UsersTableEditable } from "~~/iam/misc/types";

// Composable to make user management tasks easier
export default function useIamAdmin() {
  return {
    getUsers,
    updateUser,
    deleteUser,
  };
}

/**
 * @desc Get users
 * @returns {Promise<JSONResponse>}
 */
async function getUsers(): Promise<JSONResponse> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;

  const response = await $fetch("/api/iam/users", {
    headers: {
      "client-platform": clientPlatform,
    },
  });

  return response;
}

/**
 * @desc Update a user
 * @returns {Promise<JSONResponse>}
 */
async function updateUser(
  uuid: string,
  values: UsersTableEditable
): Promise<JSONResponse> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;

  const response = await $fetch(`/api/iam/users/${uuid}`, {
    method: "PUT",
    headers: {
      "client-platform": clientPlatform,
    },
    body: values,
  });

  return response;
}

/**
 * @desc Delete a user
 * @returns {Promise<JSONResponse>}
 */
async function deleteUser(uuid: string): Promise<JSONResponse> {
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;

  const response = await $fetch(`/api/iam/users/${uuid}`, {
    method: "DELETE",
    headers: {
      "client-platform": clientPlatform,
    },
  });

  return response;
}
