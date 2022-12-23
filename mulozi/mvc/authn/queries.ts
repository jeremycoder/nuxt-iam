import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  validateUserRegistration,
  makeUuid,
  validateUserLogin,
  login,
  getRefreshTokens,
  createNewTokensFromRefresh,
  logout,
} from "~~/mulozi/misc/helpers";
import { verifyAccessToken } from "~~/mulozi/misc/helpers";
import { ApiResult, Tokens, User } from "~~/mulozi/misc/types";
import { getClientPlatform } from "~~/mulozi/middleware";
import { H3Event, H3Error } from "h3";

const prisma = new PrismaClient();

/**
 * @desc Registers (creates) a new user in database
 * @param event H3Event
 */
export async function registerUser(
  event: H3Event
): Promise<ApiResult | H3Error> {
  const validationError = await validateUserRegistration(event);
  if (validationError) return validationError;

  const body = await readBody(event);

  // Attempt to hash password, if error, return error
  const hashedPasswordOrError = await hashPassword(body.password);
  if (hashedPasswordOrError instanceof H3Error) return hashedPasswordOrError;

  // If no password hash error, get password as string
  const hashedPassword = hashedPasswordOrError as string;

  const result = {} as ApiResult;
  let user = {};

  let registrationError = null;
  await prisma.users
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
      registrationError = e;
      await prisma.$disconnect();
    });

  if (registrationError)
    throw createError({
      statusCode: 500,
      statusMessage: "Server error",
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

  const error = await logout(event);
  if (error instanceof H3Error) return error;

  // Create api result
  result.success = true;
  result.data = { result: `user logged out successfully` };

  return result;
}

/**
 * @desc Log user out
 * @param event H3Event
 */
export async function isAuthenticated(
  event: H3Event
): Promise<ApiResult | H3Error> {
  // Check client platform
  let accessToken = null;

  // Return object if authenticated
  const authenticated = {} as ApiResult;
  authenticated.success = true;
  authenticated.data = {
    isAuthenticated: true,
  };

  // Return object if not authenticated
  const notAuthenticated = {} as ApiResult;
  notAuthenticated.success = false;
  notAuthenticated.data = {
    isAuthenticated: false,
  };

  // Get client platform
  const errorOrPlatform = getClientPlatform(event);
  if (errorOrPlatform instanceof H3Error) return errorOrPlatform;

  // Get access token from authorization header or cookie
  const platform = errorOrPlatform as string;
  if (platform === "app")
    accessToken = event.node.req.headers.authorization as string;
  else if (platform === "browser")
    accessToken = getCookie(event, "access_token") as string;

  // If no token, user is not authenticated
  if (!accessToken) return notAuthenticated;

  // Parse Bearer token (Bearer xxxx)
  const accessTokenArr = accessToken.split(" ");

  // Verify access token
  const errorOrUser = verifyAccessToken(accessTokenArr[1]);
  if (errorOrUser instanceof H3Error) {
    return notAuthenticated;
  }

  const user = errorOrUser as User;
  if (user) {
    authenticated.data.email = user.email;
    return authenticated;
  }

  return notAuthenticated;
}
