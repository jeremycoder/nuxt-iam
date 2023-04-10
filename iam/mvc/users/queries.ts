import { PrismaClient } from "@prisma/client";
import { validateUserUpdate, validateUserDelete } from "~~/iam/misc/utils/validators";
import { User } from "~~/iam/misc/types";
import { H3Event, H3Error } from "h3";

const prisma = new PrismaClient();

/**
 * @desc Gets all users
 * @param event H3Event
 */
export async function getAllUsers(
  event: H3Event
): Promise<Array<User> | H3Error> {
  let users = [] as Array<User>;
  let error = null;

  // Get query parameters from url
  const queryParams = getQuery(event)

  // Pagination variables
  let skip = queryParams.skip as string;
  let take = queryParams.take as string;

  await prisma.users
    .findMany({
      skip: parseInt(skip) ?? 0,
      take: parseInt(take) ?? 100,
    })
    .then(async (result) => {
      users = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Return error or users
  if (error) {
    console.log("Error retrieving users");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  return users;
}

/**
 * @desc Gets one user
 * @param event H3Event
 */
export async function showUser(event: H3Event): Promise<User | H3Error> {
  const uuid  = event.context.params?.uuid;

  if (!uuid) {
    console.log('Missing user uuid')
    return createError({
      statusCode: 400,
      statusMessage: "Missing user uuid",
    });
  }

  let error = null;
  let user = {} as User | null;

  await prisma.users
    .findUnique({
      where: {
        uuid: uuid,
      },
    })
    .then(async (result) => {
      user = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) {
    console.log("Error getting one user");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // Prisma returns empty object if user not found, so check if user has email
  if (user && "email" in user === false) {
    return createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  // Because Prisma can return null for user, we have to check for null before returning user
  if (user === null)
    return createError({
      statusCode: 404,
      statusMessage: "User not found",
    });

  return user;
}

/**
 * @desc Update a user
 * @param event H3Event
 */
export async function updateUser(event: H3Event): Promise<User | H3Error> {
  const errorOrVoid = await validateUserUpdate(event);
  if (errorOrVoid instanceof H3Error) return errorOrVoid;

  // Get parameters
  const body = await readBody(event);

  const uuid  = event.context.params?.uuid;

  if (!uuid) {
    console.log('Missing user uuid')
    return createError({
      statusCode: 400,
      statusMessage: "Missing user uuid",
    });
  }

  let user = {} as User;
  let error = null;

  await prisma.users
    .update({
      where: {
        uuid: uuid,
      },
      data: {
        first_name: body.first_name,
        last_name: body.last_name,
        role: body.role,
        permissions: body.permissions,
        is_active: body.is_active,
      },
    })
    .then(async (response) => {
      user = response;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error)
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });

  return user;
}

/**
 * @desc Removes user from database
 * @param event H3Event
 */
export async function destroyUser(event: H3Event): Promise<boolean | H3Error> {
  console.log('Got in destroyUser')
  const errorOrVoid = await validateUserDelete(event);
  if (errorOrVoid instanceof H3Error) return errorOrVoid;

  const uuid  = event.context.params?.uuid;

  if (!uuid) {
    console.log('Missing user uuid')
    return createError({
      statusCode: 400,
      statusMessage: "Missing user uuid",
    });
  }

  let user = {} as User;
  let error = null;

  await prisma.users
    .delete({
      where: {
        uuid: uuid,
      },
    })
    .then(async (result) => {
      user = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If we encounter an error, return error
  if (error) {
    console.log("Error deleting user");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a user, return the boolean
  if (user) return true;
  // otherwise return false (which shouldn't happen)
  else return false;
}
