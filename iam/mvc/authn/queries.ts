import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokensSession, User } from "~~/iam/misc/types";
import { getClientPlatform } from "~~/iam/middleware";
import { H3Event, H3Error } from "h3";
import dayjs from "dayjs";
import { validateUserRegistration, validateUserLogin, validateEmail } from "~~/iam/misc/utils/validators";
import { hashPassword, makeUuid } from "~~/iam/misc/utils/passwords";
import { getUserByEmail, getUserByUuid, updateUserProfile } from "~~/iam/misc/utils/users";
import { login, logout } from "~~/iam/misc/utils/logins";
import { getNewTokens, deactivateRefreshTokens, verifyAccessToken } from "~~/iam/misc/utils/tokens";
import { sendVerifyEmail, sendResetEmail } from "~~/iam/misc/utils/emails";
import { deactivateUserSessions } from "~~/iam/misc/utils/sessions";

const config = useRuntimeConfig();

const prisma = new PrismaClient();

/**
 * @desc Registers (creates) a new user in database
 * @param event H3Event
 * @return {Promise<string>} Returns user if successful and error if not successful
 */
export async function registerUser(event: H3Event): Promise<User | H3Error> {
  const validationError = await validateUserRegistration(event);  
  if (validationError) return validationError; 

  const body = await readBody(event);

  // Attempt to hash password, if error, return error
  const hashedPasswordOrError = await hashPassword(body.password);
  if (hashedPasswordOrError instanceof H3Error) return hashedPasswordOrError;

  // If no password hash error, get password as string
  const hashedPassword = hashedPasswordOrError as string;

  let user = {};

  let registrationError = null;
  await prisma.users
    .create({
      data: {
        first_name: body.first_name.trim(),
        last_name: body.last_name.trim(),
        uuid: makeUuid(),
        email: body.email,
        password: hashedPassword,
      },
    })
    .then(async (response) => {
      user = response;
    })
    .catch(async (e) => {
      console.error(e);
      registrationError = e;
    });

  if (registrationError)
    throw createError({
      statusCode: 500,
      statusMessage: "Server error",
    });

  // Create api result
  const newUser = user as User;
  return newUser;
}

/**
 * @desc Authenticate user into database
 * @param event H3Event
 */
export async function loginUser(
  event: H3Event
): Promise<TokensSession | H3Error> {
  const validateError = await validateUserLogin(event);
  if (validateError instanceof H3Error) return validateError;

  const loginErrorOrTokens = await login(event);
  if (loginErrorOrTokens instanceof H3Error) return loginErrorOrTokens;

  const tokens = loginErrorOrTokens as TokensSession;

  return tokens;
}

/**
 * @desc Refresh user tokens
 * @param event H3Event
 */
export async function refreshTokens(
  event: H3Event
): Promise<TokensSession | H3Error> {
  const errorOrTokens = await getNewTokens(event);
  if (errorOrTokens instanceof H3Error) return errorOrTokens;

  const tokens = errorOrTokens as TokensSession;
  return tokens;
}

/**
 * @desc Log user out
 * @param event H3Event
 */
export async function logoutUser(event: H3Event): Promise<boolean | H3Error> {
  const error = await logout(event);
  if (error instanceof H3Error) return error;

  // Create api result
  return true;
}

/**
 * @desc Checks if user is authenticated (checks if access token is still valid)
 * @param event
 * @returns {Promise<boolean | H3Error>} Returns true or false or error
 */
export async function isAuthenticated(
  event: H3Event
): Promise<boolean | H3Error> {
  // Check client platform
  let accessToken = null;

  // Get client platform
  const errorOrPlatform = getClientPlatform(event);
  if (errorOrPlatform instanceof H3Error) return errorOrPlatform;

  // If app, get token from header
  const platform = errorOrPlatform as string;
  if (platform === "app")
    // If browser, get token from cookies
    accessToken = event.node.req.headers["iam-access-token"] as string;
  else if (["browser", "browser-dev"].includes(platform)) {
    accessToken = getCookie(event, "iam-access-token") as string;
  }

  // If no token, user is not authenticated
  if (!accessToken) {
    console.log("Error: No access token provided");
    return createError({
      statusCode: 400,
      statusMessage: "No access token provided",
    });
  }

  // Parse Bearer token (Bearer xxxx)
  const accessTokenArr = accessToken.split(" ");

  // Verify access token
  const errorOrUser = verifyAccessToken(accessTokenArr[1]);

  // If error is an expired access token, attempt to reauthenticate
  if (errorOrUser instanceof jwt.TokenExpiredError) {
    console.log("Yes, attempt to reauthenticate");
    const errorOrTokens = await getNewTokens(event);

    // If get an error, reauthentication failed
    if (errorOrTokens instanceof H3Error) {
      console.log("Reauthentication failed");
      return createError({
        statusCode: 500,
        statusMessage: "Reauthentication failed. Login required.",
      });
    }

    // Otherwise, get tokens
    const tokens = errorOrTokens as TokensSession;

    const errorOrPlatform = getClientPlatform(event);
    if (errorOrPlatform instanceof H3Error) return errorOrPlatform;

    // Get access token from header or cookie
    const platform = errorOrPlatform as string;

    // If platform is app dev/production, set tokens in header
    if (platform === "app") {
      setHeader(event, "iam-access-token", "Bearer " + tokens.accessToken);
      setHeader(event, "iam-refresh-token", "Bearer " + tokens.refreshToken);
      if (tokens.sid) setHeader(event, "iam-sid", tokens.sid);
    }

    // If platform is browser production, set tokens in secure, httpOnly cookies
    if (platform === "browser") {
      setCookie(event, "iam-access-token", "Bearer " + tokens.accessToken, {
        httpOnly: true,
        secure: true,
      });

      // Cookies containing refresh tokens expire in 14 days, unless refreshed and new tokens obtained
      // Refresh tokens themselves expire in 14 days, unless new tokens are obtained
      setCookie(event, "iam-refresh-token", "Bearer " + tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        expires: dayjs().add(14, "day").toDate(),
      });

      // Set session id
      if (tokens.sid) setCookie(event, "iam-sid", tokens.sid);
    }

    // Development cookies are not secure. Use only in development
    if (platform === "browser-dev") {
      setCookie(event, "iam-access-token", "Bearer " + tokens.accessToken, {
        // Access tokens themselves expire in 15 mins
        expires: dayjs().add(1, "day").toDate(),
      });
      setCookie(event, "iam-refresh-token", "Bearer " + tokens.refreshToken, {
        expires: dayjs().add(1, "day").toDate(),
      });
      // Set session id
      if (tokens.sid) setCookie(event, "iam-sid", tokens.sid);
    }

    // Return authenticated
    console.log("Reauthentication successful");
    return true;
  }

  // If other error, return error
  if (errorOrUser instanceof H3Error) {
    console.log("Error: ", errorOrUser);
    return false;
  } else {
    // Otherwise, we have the user so return true
    return true;
  }
}

/**
 * @desc Attempts to return authenticated user's profile
 * @param event
 * @returns {Promise<User | H3Error>} Returns user profile or returns error
 */
export async function getProfile(event: H3Event): Promise<User | H3Error> {
  let accessToken = null;

  // Get client platform
  const errorOrPlatform = getClientPlatform(event);
  if (errorOrPlatform instanceof H3Error) return errorOrPlatform;

  // If app, get token from header
  const platform = errorOrPlatform as string;
  if (platform === "app")
    // If browser, get token from cookies
    accessToken = event.node.req.headers["iam-access-token"] as string;
  else if (["browser", "browser-dev"].includes(platform))
    accessToken = getCookie(event, "iam-access-token") as string;

  // If no token, user is not authenticated
  if (!accessToken) {
    console.log("Error: No access token provided");
    return createError({
      statusCode: 400,
      statusMessage: "No access token provided",
    });
  }

  // Parse Bearer token (Bearer xxxx)
  const accessTokenArr = accessToken.split(" ");

  // Verify access token
  const errorOrJwtPayload = verifyAccessToken(accessTokenArr[1]);

  // If error is an expired access token, attempt to reauthenticate
  if (errorOrJwtPayload instanceof jwt.TokenExpiredError) {
    console.log("Yes, attempt to reauthenticate");
    const errorOrTokens = await getNewTokens(event);

    // If get an error, reauthentication failed
    if (errorOrTokens instanceof H3Error) {
      console.log("Reauthentication failed");
      return createError({
        statusCode: 500,
        statusMessage: "Reauthentication failed. Login required.",
      });
    }

    // Otherwise, get tokens
    const tokens = errorOrTokens as TokensSession;

    // If platform is app dev/production, set tokens in header
    if (platform === "app") {
      setHeader(event, "iam-access-token", "Bearer " + tokens.accessToken);
      setHeader(event, "iam-refresh-token", "Bearer " + tokens.refreshToken);
      if (tokens.sid) setHeader(event, "iam-sid", tokens.sid);
    }

    // If platform is browser production, set tokens in secure, httpOnly cookies
    if (platform === "browser") {
      setCookie(event, "iam-access-token", "Bearer " + tokens.accessToken, {
        httpOnly: true,
        secure: true,
      });

      // Cookies containing refresh tokens expire in 14 days, unless refreshed and new tokens obtained
      // Refresh tokens themselves expire in 14 days, unless new tokens are obtained
      setCookie(event, "iam-refresh-token", "Bearer " + tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        expires: dayjs().add(14, "day").toDate(),
      });

      // Set session id
      if (tokens.sid) setCookie(event, "iam-sid", tokens.sid);
    }

    // Development cookies are not secure. Use only in development
    if (platform === "browser-dev") {
      setCookie(event, "iam-access-token", "Bearer " + tokens.accessToken, {
        // Access tokens themselves expire in 15 mins
        expires: dayjs().add(1, "day").toDate(),
      });

      setCookie(event, "iam-refresh-token", "Bearer " + tokens.refreshToken, {
        expires: dayjs().add(1, "day").toDate(),
      });

      // Set session id
      if (tokens.sid) setCookie(event, "iam-sid", tokens.sid);
    }
  }

  // If other error, return error
  if (errorOrJwtPayload instanceof H3Error) {
    console.log("Error: ", errorOrJwtPayload);
    return errorOrJwtPayload;
  } else {
    // Otherwise, return the user
    const jwtUser = errorOrJwtPayload as JwtPayload;
    const user = await getUserByEmail(jwtUser.email);

    // If no user
    if (!user) {
      console.log("Failed obtaining user from getUserByEmail");
      return createError({
        statusCode: 500,
        statusMessage: "Failed to obtain user profile",
      });
    }

    // If we have the user, but user is not active, return error
    if (!user.is_active)
      return createError({
        statusCode: 403,
        statusMessage:
          "Forbidden. Account has been deactivated. Please contact your administrator.",
      });

    // Otherwise, hide password (password is one-way hashed and cannot be retrieved from hash anyway, it just looks nicer) return the user
    user.password = "[hidden]";
    return user;
  }
}

/**
 * @desc Attempts to update and return authenticated user's profile
 * @param event
 * @returns {Promise<User | H3Error>} Returns user profile or returns error
 */
export async function updateProfile(event: H3Event): Promise<User | H3Error> {
  // Check client platform
  let accessToken = null;

  // Get client platform
  const errorOrPlatform = getClientPlatform(event);
  if (errorOrPlatform instanceof H3Error) return errorOrPlatform;

  // If app, get token from header
  const platform = errorOrPlatform as string;
  if (platform === "app")
    // If browser, get token from cookies
    accessToken = event.node.req.headers["iam-access-token"] as string;
  else if (["browser", "browser-dev"].includes(platform))
    accessToken = getCookie(event, "iam-access-token") as string;

  // If no token, user is not authenticated
  if (!accessToken) {
    console.log("Error: No access token provided");
    return createError({
      statusCode: 400,
      statusMessage: "No access token provided",
    });
  }

  // Parse Bearer token (Bearer xxxx)
  const accessTokenArr = accessToken.split(" ");

  // Verify access token
  const errorOrJwtPayload = verifyAccessToken(accessTokenArr[1]);

  // If error is an expired access token, attempt to reauthenticate
  if (errorOrJwtPayload instanceof jwt.TokenExpiredError) {
    console.log("Yes, attempt to reauthenticate");
    const errorOrTokens = await getNewTokens(event);

    // If get an error, reauthentication failed
    if (errorOrTokens instanceof H3Error) {
      console.log("Reauthentication failed");
      return createError({
        statusCode: 500,
        statusMessage: "Reauthentication failed. Login required.",
      });
    }

    // Otherwise, get tokens
    const tokens = errorOrTokens as TokensSession;

    // If platform is app dev/production, set tokens in header
    if (platform === "app") {
      setHeader(event, "iam-access-token", "Bearer " + tokens.accessToken);
      setHeader(event, "iam-refresh-token", "Bearer " + tokens.refreshToken);
      if (tokens.sid) setHeader(event, "iam-sid", tokens.sid);
    }

    // If platform is browser production, set tokens in secure, httpOnly cookies
    if (platform === "browser") {
      setCookie(event, "iam-access-token", "Bearer " + tokens.accessToken, {
        httpOnly: true,
        secure: true,
      });

      // Cookies containing refresh tokens expire in 14 days, unless refreshed and new tokens obtained
      // Refresh tokens themselves expire in 14 days, unless new tokens are obtained
      setCookie(event, "iam-refresh-token", "Bearer " + tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        expires: dayjs().add(14, "day").toDate(),
      });

      // Set session id
      if (tokens.sid) setCookie(event, "iam-sid", tokens.sid);
    }

    // Development cookies are not secure. Use only in development
    if (platform === "browser-dev") {
      setCookie(event, "iam-access-token", "Bearer " + tokens.accessToken, {
        // Access tokens themselves expire in 15 mins
        expires: dayjs().add(1, "day").toDate(),
      });

      setCookie(event, "iam-refresh-token", "Bearer " + tokens.refreshToken, {
        expires: dayjs().add(1, "day").toDate(),
      });

      // Set session id
      if (tokens.sid) setCookie(event, "iam-sid", tokens.sid);
    }
  }

  // If other error, return error
  if (errorOrJwtPayload instanceof H3Error) {
    console.log("Error: ", errorOrJwtPayload);
    return errorOrJwtPayload;
  } else {
    // Otherwise, return the user
    // const jwtUser = errorOrJwtPayload as JwtPayload;
    const errorOrUser = await updateUserProfile(event);
    if (errorOrUser instanceof H3Error) return errorOrUser;

    const user = errorOrUser as User;

    // Password hash is hidden
    user.password = "[hidden]";
    return user;
  }
}

/**
 * @desc Removes user from database
 * @param event H3Event
 */
export async function deleteAccount(
  event: H3Event
): Promise<boolean | H3Error> {
  const body = await readBody(event);
  const uuid = body.uuid;

  // If uuid not provided
  if (!uuid)
    return createError({
      statusCode: 400,
      statusMessage: "User uuid not provided",
    });

  // Get current user
  const nullOrUser = await getUserByUuid(uuid);
  if (!nullOrUser) {
    console.log(
      "User to delete from useIam not found. This should not happen."
    );
    return createError({
      statusCode: 500,
      statusMessage: "User not found",
    });
  }

  const user = nullOrUser as User;
  let deletedUser = null;
  let error = null;

  // First remove all user's refresh tokens
  await prisma.refresh_tokens
    .deleteMany({
      where: {
        user_id: user.id,
      },
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error deleting refresh tokens, return error
  if (error)
    return createError({
      statusCode: 500,
      statusMessage: "Server error. Failed to delete account.",
    });

  // Then remove user
  await prisma.users
    .delete({
      where: {
        uuid: uuid,
      },
    })
    .then(async (result) => {
      deletedUser = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If we encounter an error, return error
  if (error)
    return createError({
      statusCode: 500,
      statusMessage: "Server error with deleting account",
    });

  // Delete access and refresh cookies
  deleteCookie(event, "iam-access-token");
  deleteCookie(event, "iam-refresh-token");
  deleteCookie(event, "iam-sid");

  // Deactivate user's sessions
  const deactivateSessionsError = await deactivateUserSessions(user.id);
  if (deactivateSessionsError instanceof H3Error)
    return deactivateSessionsError;

  // If we have a user, return the boolean
  if (deletedUser) return true;
  // otherwise return false (which shouldn't happen)
  else {
    console.log(
      "This shouldn't happen: Returning false in deleting user from profile"
    );
    return false;
  }
}

/**
 * @desc Reset user's password
 * @param event H3Event
 */
export async function resetPassword(event: H3Event): Promise<H3Error | true> {
  const body = await readBody(event);

  // If no email in body, log error
  if ("email" in body === false) {
    console.log("Email missing from body for password reset");
    return createError({
      statusCode: 400,
      statusMessage: "Email missing from body for password reset",
    });
  }

  // If email is in bad form, log error
  if (!validateEmail(body.email)) {
    console.log("Bad email format for password reset");
    return createError({
      statusCode: 400,
      statusMessage: "Bad email format for password reset",
    });
  }

  // Get user from email
  const nullOrUser = await getUserByEmail(body.email);
  if (!nullOrUser) {
    console.log("Could not get user from email for password reset");
    return createError({
      statusCode: 400,
      statusMessage: "Could not get user from email for password reset",
    });
  }

  // Deactivate user's refresh tokens
  const user = nullOrUser as User;
  const voidOrError = await deactivateRefreshTokens(user.id);

  if (voidOrError instanceof H3Error) return voidOrError;

  // Create an object for user reset
  const resetUser = {
    uuid: user.uuid,
  };

  // Create reset jwt token
  const resetToken = jwt.sign(resetUser, config.iamResetTokenSecret, {
    expiresIn: "1h",
    issuer: "NuxtIam",
    jwtid: makeUuid(),
  });

  // Send email to user
  const errorOrSent = await sendResetEmail(user, resetToken);

  if (errorOrSent instanceof H3Error) return errorOrSent;

  return true;
}

/**
 * @desc Send email to verify user's email address
 * @param event H3Event
 */
export async function verifyUserEmail(event: H3Event): Promise<H3Error | true> {
  const body = await readBody(event);

  // If no email in body, log error
  if ("email" in body === false) {
    console.log("Email missing from body for email verification");
    return createError({
      statusCode: 400,
      statusMessage: "Email missing from body for email verification",
    });
  }

  // If email is in bad form, log error
  if (!validateEmail(body.email)) {
    console.log("Bad email format for email verification");
    return createError({
      statusCode: 400,
      statusMessage: "Bad email format for email verification",
    });
  }

  // Get user from email
  const nullOrUser = await getUserByEmail(body.email);
  if (!nullOrUser) {
    console.log("Could not get user from email for email verification");
    return createError({
      statusCode: 400,
      statusMessage: "Could not get user from email for email verification",
    });
  }

  // Create an object for email verification token
  const user = nullOrUser as User;
  const verifyUser = {
    email: user.email,
  };

  // Create email verification jwt good for one day
  const emailVerifyToken = jwt.sign(verifyUser, config.iamVerifyTokenSecret, {
    expiresIn: "24h",
    issuer: "NuxtIam",
    jwtid: makeUuid(),
  });

  // Send email to user
  const errorOrSent = await sendVerifyEmail(user, emailVerifyToken);

  if (errorOrSent instanceof H3Error) return errorOrSent;

  return true;
}
