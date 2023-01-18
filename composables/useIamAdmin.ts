import { JSONResponse } from "~~/iam/misc/types";

// Composable to make user management tasks easier
export default function useIamAdmin() {
  return {
    getUsers,
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
