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
  verifyUserEmail,
} from "./queries";
import { getClientPlatform } from "~~/iam/middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JSONResponse, User, Tokens, Session } from "~~/iam/misc/types";
import dayjs from "dayjs";
import {
  verifyPasswordResetToken,
  verifyEmailVerificationToken,
  generateNewPassword,
  addOneTimeToken,
  getTokenPayload,
  updateEmailVerifiedTrue,
  getSession,
} from "~~/iam/misc/helpers";

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
  let sessionId = null;

  // Check client platform first
  const errorOrPlatform = getClientPlatform(event);

  // If error, return error
  if (errorOrPlatform instanceof H3Error) {
    // Delete tokens
    deleteCookie(event, "access-token");
    deleteCookie(event, "refresh-token");
    deleteCookie(event, "csrf-token");

    response.status = "fail";
    response.error = errorOrPlatform;
    return response;
  }

  // Otherwise get platform
  const platform = errorOrPlatform as string;

  const errorOrTokens = await loginUser(event);

  // If error, return error
  if (errorOrTokens instanceof H3Error) {
    // Delete tokens
    deleteCookie(event, "access-token");
    deleteCookie(event, "refresh-token");
    deleteCookie(event, "csrf-token");

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
    if (tokens.csrfToken) setHeader(event, "csrf-token", tokens.csrfToken);
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

    // Set csrf token in cookie
    if (tokens.csrfToken) setCookie(event, "csrf-token", tokens.csrfToken);
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

    // Set csrf token in cookie
    if (tokens.csrfToken) setCookie(event, "csrf-token", tokens.csrfToken);
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
    if (tokens.csrfToken) setHeader(event, "csrf-token", tokens.csrfToken);
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

    // Set csrf token
    if (tokens.csrfToken) setCookie(event, "csrf-token", tokens.csrfToken);
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

    // Set csrf token
    if (tokens.csrfToken) setCookie(event, "csrf-token", tokens.csrfToken);
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
 * @desc Returns user's csrf token
 * @info expects body to contain user id
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function getCsrfToken(event: H3Event): Promise<JSONResponse> {
  const body = await readBody(event);
  const response = {} as JSONResponse;
  let sessionId = null;
  let sessionOrError = null;

  // Get client platform
  const clientPlatform = useRuntimeConfig().public.iamClientPlatform;

  // Client platform if not using Nuxt front end
  const appClientPlatform = event.node.req.headers["client-platform"] as string;

  // If client platform is app, get access token from headers
  if (appClientPlatform === "app")
    sessionId = event.node.req.headers["session-id"] as string;
  // Otherwise, get it from cookies
  else if (["browser", "browser-dev"].includes(clientPlatform)) {
    sessionId = getCookie(event, "session-id") as string;
  }
  // If that fails, value is invalid
  else {
    console.log("Invalid client platform: ", clientPlatform);
    response.error = createError({
      statusCode: 400,
      statusMessage:
        "Invalid client platform. Client platform in header must be 'app', 'browser', or 'browser-dev'",
    });
  }

  console.log("SESSION ID: " + sessionId);

  // Return error if no session id provided
  if (sessionId === null) {
    console.log("Invalid session id");
    response.error = createError({
      statusCode: 400,
      statusMessage: "No session id provided",
    });
  }

  //Get session from db
  if (sessionId) sessionOrError = await getSession(parseInt(sessionId));

  // If error, return error
  if (sessionOrError instanceof H3Error) {
    console.log("Error retrieving user session");
    response.error = createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // Get session and get csrf
  const session = sessionOrError as Session;
  const csrf = session.csrf_token;

  // Create response
  response.status = "success";
  response.data = {
    csrfToken: csrf,
  };

  return response;
}

/**
 * @desc Updates and returns updated profile of authenticated user
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function update(event: H3Event): Promise<JSONResponse> {
  // TODO: Check for valid csrf token in body, if none, return error

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
 * @info For security purposes always returns success
 * @returns {Promise<JSONResponse>} Success of failure
 */
export async function reset(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;

  // Delete tokens
  deleteCookie(event, "access-token");
  deleteCookie(event, "refresh-token");
  deleteCookie(event, "csrf-token");

  // Send user an email to reset their password
  const errorOrReset = await resetPassword(event);

  // For security purposes, do not throw errors
  if (errorOrReset instanceof H3Error) {
    console.log("Error: Failed to reset user password");
  }

  // For security purposes, response is always successful
  response.status = "success";

  return response;
}

/**
 * @desc Verifies token sent from user's reset email password
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Success of failure
 */
export async function verifyReset(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;

  // Delete access and refresh tokens
  deleteCookie(event, "access-token");
  deleteCookie(event, "refresh-token");
  deleteCookie(event, "csrf-token");

  // Get token from body
  const body = await readBody(event);
  const token = body.token;

  if (!token) {
    response.status = "fail";
    response.error = createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
    return response;
  }

  // Verify token
  const userOrError = verifyPasswordResetToken(token);

  // If password reset token is expired, return error
  if (userOrError instanceof jwt.TokenExpiredError) {
    console.log("Expired password reset token");
    response.status = "fail";
    response.error = createError({
      statusCode: 401,
      statusMessage: "Link has expired",
    });
    return response;
  }

  // If other error coccured, return error
  if (userOrError instanceof H3Error) {
    console.log("Other error with password reset token");
    response.status = "fail";
    response.error = createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
    return response;
  }

  // Get token payload. Check if error
  const errorOrTokenPayload = getTokenPayload(token, "reset");
  if (errorOrTokenPayload instanceof H3Error) {
    console.log("Get token payload error");
    response.status = "fail";
    response.error = createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
    return response;
  }

  // If no error, get token payload
  const tokenPayload = errorOrTokenPayload as JwtPayload;

  // If token has no id, return error
  if (!tokenPayload.jti) {
    console.log("Token payload has no id (jwt.jti)");
    response.status = "fail";
    response.error = createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
    return response;
  }

  // Attempt to add token, if token already exists, it's used
  if (
    tokenPayload.jti !== (await addOneTimeToken(tokenPayload.jti, new Date()))
  ) {
    console.log("Adding one time token failed. Token is probably already used");
    response.status = "fail";
    response.error = createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
    return response;
  }

  // Otherwise generate new password for user
  const user = userOrError as User;
  const errorOrPassword = await generateNewPassword(user.uuid);

  // If error, return error
  if (errorOrPassword instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrPassword;
    return response;
  }

  // Otherwise, get newly generated password
  const password = errorOrPassword as string;

  // Return password
  response.status = "success";
  response.data = {
    pass: password,
  };

  return response;
}

/**
 * @desc Verifies user's email
 * @param event H3 Event passed from api
 * @info Always returns success
 * @returns {Promise<JSONResponse>} Success of failure
 */
export async function verifyEmail(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;

  // Send user an email to verify their email
  const errorOrReset = await verifyUserEmail(event);

  // Always returns success because user must click link in email to verify it
  if (errorOrReset instanceof H3Error) {
    console.log("Error: Failed to send email to verify user email");
  }

  // For security purposes, response is always successful
  response.status = "success";

  return response;
}

/**
 * @desc Verifies token sent from user's email to verify their email
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Success of failure
 */
export async function verifyEmailToken(
  event: H3Event
): Promise<JSONResponse | void> {
  const response = {} as JSONResponse;

  // Get token from body
  const body = await readBody(event);
  const token = body.token;

  if (!token) {
    response.status = "fail";
    response.error = createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
    return response;
  }

  // Verify token
  const jwtPayloadOrError = verifyEmailVerificationToken(token);

  // If email verification token is expired, return error
  if (jwtPayloadOrError instanceof jwt.TokenExpiredError) {
    console.log("Expired email verification reset token");
    response.status = "fail";
    response.error = createError({
      statusCode: 401,
      statusMessage: "Link has expired",
    });
    return response;
  }

  // If other error coccured, return error
  if (jwtPayloadOrError instanceof H3Error) {
    console.log("Other error with email reset token");
    response.status = "fail";
    response.error = createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
    return response;
  }

  // Otherwise update user email to verified
  const jwtPayload = jwtPayloadOrError as jwt.JwtPayload;
  const updateError = await updateEmailVerifiedTrue(jwtPayload.email);

  if (updateError) {
    console.log("Error updating verified email to true");
    response.status = "fail";
    response.error = createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
    return response;
  }

  // Return password
  response.status = "success";
  response.data = {
    email: jwtPayload.email,
  };

  return response;
}
