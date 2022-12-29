import { PrismaClient } from "@prisma/client";
import { validateUserUpdate, validateUserDelete } from "~~/iam/misc/helpers";
import { User } from "~~/iam/misc/types";
import { H3Event, H3Error } from "h3";

const prisma = new PrismaClient();
const rowLimit = 100;

/**
 * @desc Gets all users
 * @param event H3Event
 */
export async function getAllUsers(
  event: H3Event
): Promise<Array<any> | H3Error> {
  let users = [] as Array<User>;
  let error = null;

  await prisma.users
    .findMany({
      take: rowLimit,
    })
    .then(async (result) => {
      users = result;

      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
      await prisma.$disconnect();
    });

  // Return error or users
  if (error) return error;
  else return users;
}

/**
 * @desc Gets one user
 * @param event H3Event
 */
export async function showUser(event: H3Event): Promise<User | H3Error> {
  const { uuid } = event.context.params.fromRoute;
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
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
      await prisma.$disconnect();
    });

  // If error, return error
  if (error) return error;

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
  else return user;
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
  const { fromRoute } = event.context.params;
  let user = {} as User;
  let error = null;

  await prisma.users
    .update({
      where: {
        uuid: fromRoute.uuid,
      },
      data: {
        // TODO: Determine what can be edited or not
        first_name: body.first_name,
        last_name: body.last_name,
      },
    })
    .then(async (response) => {
      user = response;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
      await prisma.$disconnect();
    });

  // If error, return error
  if (error) return error;

  return user;
}

/**
 * @desc Removes user from database
 * @param event H3Event
 */
export async function destroyUser(event: H3Event): Promise<boolean | H3Error> {
  const errorOrVoid = await validateUserDelete(event);
  if (errorOrVoid instanceof H3Error) return errorOrVoid;

  // Get uuid from route
  const { uuid } = event.context.params.fromRoute;

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
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
      await prisma.$disconnect();
    });

  // If we encounter an error, return error
  if (error) return error;

  // If we have a user, return the boolean
  if (user) return true;
  // otherwise return false (which shouldn't happen)
  else return false;
}
