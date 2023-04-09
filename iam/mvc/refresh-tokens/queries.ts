import { PrismaClient } from "@prisma/client";
import { RefreshTokens } from "~~/iam/misc/types";
import { H3Event, H3Error } from "h3";

const prisma = new PrismaClient();

/**
 * @desc Gets all users
 * @param event H3Event
 */
export async function getAllRefreshTokens(
  event: H3Event
): Promise<RefreshTokens | H3Error> {
  let refreshTokens = [] as RefreshTokens;
  let error = null;

  // Get query parameters from url
  const queryParams = getQuery(event)

  // Pagination variables
  let skip = queryParams.skip as string;
  let take = queryParams.take as string;

  await prisma.refresh_tokens
    .findMany({
      skip: parseInt(skip) ?? 0,
      take: parseInt(take) ?? 100,
    })
    .then(async (result) => {
      refreshTokens = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Return error or tokens
  if (error) {
    console.log("Error retrieving refresh tokens");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  return refreshTokens;
}

/**
 * @desc Removes a paticular refresh token from database
 * @param event H3Event
 */
export async function destroyRefreshToken(
  event: H3Event
): Promise<boolean | H3Error> {
  // Get id from route
  const id = event.context.params?.id;  
  
  if (!id) {
    console.log("Refresh token id is missing for delete");
    return createError({
      statusCode: 400,
      statusMessage: "Refresh token id is missing for delete",
    });
  }

  let token = null;
  let error = null;

  await prisma.refresh_tokens
    .delete({
      where: {
        id: parseInt(id),
      },
    })
    .then(async (result) => {
      token = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If we encounter an error, return error
  if (error) {
    console.log("Error deleting refresh token");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a token, return the boolean
  if (token) return true;
  // otherwise return false (which shouldn't happen)
  else {
    console.log("Should not return false here");
    return false;
  }
}

/**
 * @desc Removes all refresh tokens from database
 * @param event H3Event
 */
export async function destroyRefreshTokens(
  event: H3Event
): Promise<boolean | H3Error> {
  // Get id from route

  let tokens = null;
  let error = null;

  await prisma.refresh_tokens
    .deleteMany({
      where: {
        id: {
          gt: 0,
        },
      },
    })
    .then(async (result) => {
      tokens = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If we encounter an error, return error
  if (error) {
    console.log("Error deleting refresh tokens");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a user, return the boolean
  if (tokens) {
    console.log(tokens);
    return true;
  }
  // otherwise return false (which shouldn't happen)
  else {
    console.log("We should not return false here");
    return false;
  }
}
