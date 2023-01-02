import { H3Event, H3Error } from "h3";
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  isAuthenticated,
  getProfile,
  updateProfile,
  deleteAccount,
  resetPassword,
} from "./queries";
import { getClientPlatform } from "~~/iam/middleware";
import { JSONResponse, User, Tokens } from "~~/iam/misc/types";
import dayjs from "dayjs";
import { verifyResetToken } from "~~/iam/misc/helpers";

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
    // Delete access and refresh tokens
    deleteCookie(event, "access-token");
    deleteCookie(event, "refresh-token");

    response.status = "fail";
    response.error = errorOrPlatform;
    return response;
  }

  // Otherwise get platform
  const platform = errorOrPlatform as string;

  const errorOrTokens = await loginUser(event);

  // If error, return error
  if (errorOrTokens instanceof H3Error) {
    // Delete access and refresh tokens
    deleteCookie(event, "access-token");
    deleteCookie(event, "refresh-token");

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
    setCookie(event, "access-token", "Bearer " + tokens.accessToken, {
      // Access tokens themselves expire in 15 mins
      expires: dayjs().add(1, "day").toDate(),
    });
    setCookie(event, "refresh-token", "Bearer " + tokens.refreshToken, {
      expires: dayjs().add(1, "day").toDate(),
    });
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
    setCookie(event, "access-token", "Bearer " + tokens.accessToken, {
      // Access tokens themselves expire in 15 mins
      expires: dayjs().add(1, "day").toDate(),
    });
    setCookie(event, "refresh-token", "Bearer " + tokens.refreshToken, {
      expires: dayjs().add(1, "day").toDate(),
    });
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

/**
 * @desc Returns profile of authenticated user
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function profile(event: H3Event): Promise<JSONResponse> {
  const profileOrError = await getProfile(event);
  const response = {} as JSONResponse;

  if (profileOrError instanceof H3Error) {
    response.status = "fail";
    response.error = profileOrError;
    return response;
  }

  const profile = profileOrError as User;

  response.status = "success";
  response.data = profile;

  return response;
}

/**
 * @desc Updates and returns updated profile of authenticated user
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function update(event: H3Event): Promise<JSONResponse> {
  const profileOrError = await updateProfile(event);
  const response = {} as JSONResponse;

  if (profileOrError instanceof H3Error) {
    response.status = "fail";
    response.error = profileOrError;
    return response;
  }

  const profile = profileOrError as User;

  response.status = "success";
  response.data = profile;

  return response;
}

/**
 * @desc Deletes user's account
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function destroy(event: H3Event): Promise<JSONResponse> {
  const deleteOrError = await deleteAccount(event);
  const response = {} as JSONResponse;

  // If error in deleting user account, return error
  if (deleteOrError instanceof H3Error) {
    response.status = "fail";
    response.error = deleteOrError;
    return response;
  }

  const userDeleted = deleteOrError as boolean;

  // If false result, which shouldn't happen, return error
  if (userDeleted === false) {
    response.status = "fail";
    response.error = createError({
      statusCode: 500,
      statusMessage: "Error deleting user account",
    });
    return response;
  }

  // Otherwise delete was successful
  response.status = "success";

  return response;
}

/**
 * @desc Reset user's password
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Object mentioning success or failure of authenticating user or error
 */
export async function reset(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;

  // Delete access and refresh tokens
  deleteCookie(event, "access-token");
  deleteCookie(event, "refresh-token");

  await resetPassword(event);

  // For security purposes, response is always successful
  response.status = "success";

  return response;
}

/**
 * @desc Verifies token sent from user's reset email password
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Object mentioning success or failure of authenticating user or error
 */
export async function resetVerify(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;

  // Delete access and refresh tokens
  deleteCookie(event, "access-token");
  deleteCookie(event, "refresh-token");

  // Get token from route. Token comes split
  const { fromRoute } = event.context.params;

  // Get split parts of token
  const tokenHeader = fromRoute.jwtheader;
  const tokenPayload = fromRoute.jwtpayload;
  const tokenSignature = fromRoute.jwtsignature;

  // Put token together
  const resetToken = `${tokenHeader}.${tokenPayload}.${tokenSignature}`;
  console.log("reset token from email: ", resetToken);

  // TODO: Verify token
  const userOrError = verifyResetToken(resetToken);
  console.log("userOrError: ", userOrError);

  // If link expired, say link is expired

  // If other error, say unauthorized

  // If verification successful, navigate to /updatepassword route

  // Update password should have a check to make sure it's coming only from this route

  // Will reject any requests from anywhere else

  // Response is always successful
  response.status = "success";

  return response;
}
