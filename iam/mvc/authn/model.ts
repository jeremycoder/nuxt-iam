import { H3Event, H3Error } from "h3";
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  isAuthenticated,
} from "./queries";
import { getClientPlatform } from "~~/iam/middleware";
import { JSONResponse, User, Tokens } from "~~/iam/misc/types";
import dayjs from "dayjs";

/**
 * @desc Registers (creates) a new user in database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Object mentioning success or failure of registering user or error
 */
export async function register(event: H3Event): Promise<JSONResponse> {
  let response = {} as JSONResponse;
  const userOrError = await registerUser(event);

  // If error is returned
  if (userOrError instanceof H3Error) {
    response.status = "fail";
    response.error = userOrError;
    return response;
  }

  // Otherwise return user email
  const user = userOrError as User;
  response.status = "success";
  response.data = {
    email: user.email,
  };

  return response;
}

/**
 * @desc Authenticate user into database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Object mentioning success or failure of authenticating user or error
 */
export async function login(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;

  // Check client platform first
  const errorOrPlatform = getClientPlatform(event);

  // If error, return error
  if (errorOrPlatform instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrPlatform;
    return response;
  }

  // Otherwise get platform
  const platform = errorOrPlatform as string;

  const errorOrTokens = await loginUser(event);

  // If error, return error
  if (errorOrTokens instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrTokens;
    return response;
  }

  //Otherwise get tokens
  const tokens = errorOrTokens as Tokens;

  // If platform is app dev/production, set tokens in header
  if (platform === "app") {
    setHeader(event, "access-token", "Bearer " + tokens.accessToken);
    setHeader(event, "refresh-token", "Bearer " + tokens.refreshToken);
  }

  // If platform is browser production, set tokens in secure, httpOnly cookies
  if (platform === "browser") {
    setCookie(event, "access-token", "Bearer " + tokens.accessToken, {
      httpOnly: true,
      secure: true,
    });

    // Cookies containing refresh tokens expire in 14 days, unless refreshed and new tokens obtained
    // Refresh tokens themselves expire in 14 days, unless new tokens are obtained
    setCookie(event, "refresh-token", "Bearer " + tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: dayjs().add(14, "day").toDate(),
    });
  }

  // Development cookies are not secure. Use only in development
  if (platform === "browser-dev") {
    setCookie(event, "access-token", "Bearer " + tokens.accessToken);
    setCookie(event, "refresh-token", "Bearer " + tokens.refreshToken);
  }

  // Create api result
  const body = await readBody(event);

  // If all is successful
  response.status = "success";
  response.data = {
    email: body.email,
  };

  return response;
}

/**
 * @desc Refresh user's tokens
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Object mentioning success or failure of refreshing user's tokens
 */
export async function refresh(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;

  // Check client platform first
  const errorOrPlatform = getClientPlatform(event);

  // If error, return error
  if (errorOrPlatform instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrPlatform;
    return response;
  }

  // Otherwise get platform
  const platform = errorOrPlatform as string;

  // Attempt to refresh tokens
  const errorOrTokens = await refreshTokens(event);

  // If error, return error
  if (errorOrTokens instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrTokens;
    return response;
  }

  //Otherwise get tokens
  const tokens = errorOrTokens as Tokens;

  // If platform is app dev/production, set tokens in header
  if (platform === "app") {
    setHeader(event, "access-token", "Bearer " + tokens.accessToken);
    setHeader(event, "refresh-token", "Bearer " + tokens.refreshToken);
  }

  // If platform is browser production, set tokens in secure, httpOnly cookies
  if (platform === "browser") {
    setCookie(event, "access-token", "Bearer " + tokens.accessToken, {
      httpOnly: true,
      secure: true,
    });

    // Cookies containing refresh tokens expire in 14 days, unless refreshed and new tokens obtained
    // Refresh tokens themselves expire in 14 days, unless new tokens are obtained
    setCookie(event, "refresh-token", "Bearer " + tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: dayjs().add(14, "day").toDate(),
    });
  }

  // Development cookies are not secure. Use only in development
  if (platform === "browser-dev") {
    setCookie(event, "access-token", "Bearer " + tokens.accessToken);
    setCookie(event, "refresh-token", "Bearer " + tokens.refreshToken);
  }

  // If all is successful
  response.status = "success";

  return response;
}

/**
 * @desc Log user out
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Object mentioning success or failure of logging user out
 */
export async function logout(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrTrue = await logoutUser(event);

  // If error, return error
  if (errorOrTrue instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrTrue;
    return response;
  }

  // Otherwise return successful logout response
  response.status = "success";
  return response;
}

/**
 * @desc Checks if user is authenticated
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function isauthenticated(event: H3Event): Promise<JSONResponse> {
  const authenticated = await isAuthenticated(event);
  const response = {} as JSONResponse;

  if (authenticated instanceof H3Error) {
    response.status = "fail";
    response.error = authenticated;
  }

  if (authenticated === false) {
    response.status = "fail";
  }

  if (authenticated === true) {
    response.status = "success";
  }

  return response;
}
