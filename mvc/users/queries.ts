import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  validateUserRegistration,
  makeUuid,
  validateUserUpdate,
  validateUserDelete,
  validateUserLogin,
  login,
  getRefreshTokens,
  createNewTokensFromRefresh,
} from "./helpers";
import { ApiResult, Tokens } from "./types";
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
 * @desc Registers (creates) a new user in database
 * @param event H3Event
 */
export async function registerUser(
  event: H3Event
): Promise<ApiResult | H3Error> {
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
    result.data = { result: `user with email '${user.email}' created` };
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

  // Prisma returns empty object if user not found, so check if user has email
  if ("email" in user === false) {
    return createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  return result;
}

/**
 * @desc Update a user
 * @param event H3Event
 */
export async function updateUser(event: H3Event): Promise<ApiResult | H3Error> {
  const error = await validateUserUpdate(event);
  if (error instanceof H3Error) return error;

  const result = {} as ApiResult;
  const body = await readBody(event);
  const { fromRoute } = event.context.params;
  let user = {};

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
    .then(async (response) => {
      user = response;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  // Prepare api result
  result.success = true;
  if ("email" in user) {
    result.data = { result: `user with email '${user.email}' updated` };
  }

  return result;
}

/**
 * @desc Removes user from database
 * @param event H3Event
 */
export async function destroyUser(
  event: H3Event
): Promise<ApiResult | H3Error> {
  const error = await validateUserDelete(event);
  if (error instanceof H3Error) return error;

  const result = {} as ApiResult;
  const { uuid } = event.context.params.fromRoute;

  let user = {};
  await prisma.user
    .delete({
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
  if ("email" in user) {
    result.data = { result: `user with email '${user.email}' deleted` };
  }

  return result;
}

/**
 * @desc Authenticate user into database
 * @param event H3Event
 */
export async function loginUser(event: H3Event): Promise<ApiResult | H3Error> {
  const result = {} as ApiResult;

  const validateError = await validateUserLogin(event);
  if (validateError instanceof H3Error) return validateError;

  const loginErrorOrTokens = await login(event);
  if (loginErrorOrTokens instanceof H3Error) return loginErrorOrTokens;

  const tokens = loginErrorOrTokens as Tokens;

  // Create api result
  result.success = true;

  result.data = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };

  return result;
}

/**
 * @desc Refresh user tokens
 * @param event H3Event
 */
export async function refreshTokens(
  event: H3Event
): Promise<ApiResult | H3Error> {
  const result = {} as ApiResult;

  const errorOrTokens = await getRefreshTokens(event);
  if (errorOrTokens instanceof H3Error) return errorOrTokens;

  // Get new access and refresh tokens
  const newTokens = createNewTokensFromRefresh(event.context.refreshToken);

  if (newTokens === null) {
    console.log("Failed to get user from refresh token");
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const loginErrorOrTokens = await login(event);
  if (loginErrorOrTokens instanceof H3Error) return loginErrorOrTokens;

  const tokens = loginErrorOrTokens as Tokens;

  // Create api result
  result.success = true;

  result.data = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };

  return result;
}
