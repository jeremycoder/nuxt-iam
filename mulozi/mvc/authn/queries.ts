import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  validateUserRegistration,
  makeUuid,
  validateUserLogin,
  login,
  getRefreshTokens,
  createNewTokensFromRefresh,
} from "~~/mulozi/misc/helpers";
import { ApiResult, Tokens } from "~~/mulozi/misc/types";
import { H3Event, H3Error } from "h3";

const prisma = new PrismaClient();

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

/**
 * @desc Log user out
 * @param event H3Event
 */
export async function logoutUser(event: H3Event): Promise<ApiResult | H3Error> {
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
