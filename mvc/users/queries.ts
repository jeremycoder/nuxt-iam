import { PrismaClient } from "@prisma/client";
import {
  userExists,
  hashPassword,
  validateUserRegistration,
  makeUuid,
} from "./helpers";
import { User, RegisteredUser, ApiResult } from "./types";
import { H3Event, H3Error } from "h3";

const prisma = new PrismaClient();
const rowLimit = 100;

/**
 * @desc Gets all users
 * @param event H3Event
 */
export async function getAllUsers(
  event: H3Event
): Promise<ApiResult | H3Error> {
  const result = {} as ApiResult;
  let users = {};

  await prisma.user
    .findMany({
      take: rowLimit,
    })
    .then(async (result) => {
      users = result;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
    });

  // Create api result
  result.success = true;
  result.data = users;

  return result;
}

/**
 * @desc Stores a user in database
 * @param event H3Event
 */
export async function storeUser(event: H3Event): Promise<ApiResult | H3Error> {
  const error = await validateUserRegistration(event);
  if (error) return error;

  const body = await readBody(event);

  // Attempt to hash password, if error, return error
  const hashedPasswordOrError = await hashPassword(body.password);
  if (hashedPasswordOrError instanceof H3Error) return hashedPasswordOrError;

  // If no password hash error, get password as string
  const hashedPassword = hashedPasswordOrError as string;

  const result = {} as ApiResult;
  let user = {};

  await prisma.user
    .create({
      data: {
        first_name: body.first_name,
        last_name: body.last_name,
        uuid: makeUuid(),
        email: body.email,
        password: hashedPassword,
      },
    })
    .then(async (response) => {
      user = response;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
    });

  // Create api result
  result.success = true;
  if ("email" in user) {
    result.data = { email: user.email };
  }

  return result;
}

/**
 * @desc Gets one user
 * @param event H3Event
 */
export async function showUser(event: H3Event): Promise<ApiResult | H3Error> {
  const { uuid } = event.context.params.fromRoute;
  const result = {} as ApiResult;
  let user = {};

  await prisma.user
    .findUnique({
      where: {
        uuid: uuid,
      },
    })
    .then(async (result) => {
      if (result) user = result;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
    });

  // Create api result
  result.success = true;
  result.data = user;

  return result;
}

/**
 * @desc Update a user
 * @param event H3Event
 */
export async function updateUser(event: H3Event): Promise<ApiResult | H3Error> {
  const result = {} as ApiResult;
  const body = await readBody(event);
  const { fromRoute } = event.context.params;
  let registeredUser = {} as RegisteredUser;

  // If no uuid given
  if (!fromRoute.uuid)
    throw createError({
      statusCode: 400,
      statusMessage: "Uuid not supplied",
    });

  // If uuid exists, but user does not exist
  if (!(await userExists(fromRoute.uuid)))
    throw createError({
      statusCode: 400,
      statusMessage: "User not found",
    });

  // If first name and last name do not exist in body
  if ("first_name" in body === false && "last_name" in body === false)
    return createError({
      statusCode: 400,
      statusMessage: "No updatable properties supplied",
    });

  // If first_name empty
  if (!body.first_name)
    return createError({
      statusCode: 400,
      statusMessage: "first_name must have data",
    });

  // If last_name empty
  if (!body.last_name)
    return createError({
      statusCode: 400,
      statusMessage: "last_name must have data",
    });

  await prisma.user
    .update({
      where: {
        uuid: fromRoute.uuid,
      },
      data: {
        first_name: body.first_name,
        last_name: body.last_name,
      },
    })
    .then(async (result) => {
      registeredUser = result;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  // Prepare api result
  result.success = true;
  result.data = { email: registeredUser.email };

  return result;
}
