
import { PrismaClient } from "@prisma/client";
import { User, TokensSession, Session } from "~~/iam/misc/types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { H3Event, H3Error } from "h3";
import { getClientPlatform } from "../../middleware";
import { makeUuid } from "./../utils/passwords";
import { getUserByEmail } from "./../utils/users";
import { createUserSession, deactivateUserSessions } from "./../utils/sessions";

const config = useRuntimeConfig();
const prisma = new PrismaClient();

/**
 * @desc Suite of checks to validate data before issuing refresh token
 * @param event Event from Api
 */
export async function getNewTokens(
  event: H3Event
): Promise<H3Error | TokensSession> {
  let refreshToken = null;

  // Get client platform
  const errorOrPlatform = getClientPlatform(event);
  if (errorOrPlatform instanceof H3Error) return errorOrPlatform;

  // If app, get token from header
  const platform = errorOrPlatform as string;
  if (platform === "app")
    // If browser, get token from cookies
    refreshToken = event.node.req.headers["iam-refresh-token"] as string;
  else if (["browser", "browser-dev"].includes(platform))
    refreshToken = getCookie(event, "iam-refresh-token") as string;

  // If no token, user is not authenticated
  if (!refreshToken) {
    console.log("Error: No refresh token provided");
    return createError({
      statusCode: 400,
      statusMessage: "No refresh token provided",
    });
  }

  // Get Bearer token
  const bearerToken = refreshToken.split(" ");

  // Check for word "Bearer"
  if (bearerToken[0] !== "Bearer") {
    console.log("Missing word 'Bearer' in token");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Check for token
  if (!bearerToken[1]) {
    console.log("Missing token");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Get user from token
  const errorOrUser = await verifyRefreshToken(bearerToken[1]);

  // Check if user was retrieved from token
  if (errorOrUser instanceof H3Error) {
    console.log("Failed to retrieve user from token");
    return createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const user = errorOrUser as User;

  // Check if user has email attribute
  if (!user.email)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });

  // Check if user exists in the database
  const userInDb = await getUserByEmail(user.email);

  if (userInDb === null) {
    console.log("User not found in database");
    return createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  // Get new tokens
  const errorOrTokens = createNewTokensFromRefresh(bearerToken[1], event);
  if (errorOrTokens instanceof H3Error) return errorOrTokens;

  const tokens = (await errorOrTokens) as TokensSession;
  return tokens;
}

/**
 * @desc Verifies user after token is passed
 * @param token JSON web token
 */
export function verifyAccessToken(token: string): H3Error | JwtPayload {
  let error = null;
  let tokenExpiredError = null;
  let jwtUser = null;

  jwt.verify(token, config.iamAccessTokenSecret, (err, user) => {
    if (err) {
      console.log(err);

      // If access token expired, return for attempt to reauthenticate
      if (err instanceof jwt.TokenExpiredError) {
        console.log("Expired access token");
        console.log("Attempt reauthentication");
        tokenExpiredError = err;
      }

      // If not, just return the error
      error = createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    } else {
      jwtUser = user as JwtPayload;
    }
  });

  // Check token expiration error first
  if (tokenExpiredError) return tokenExpiredError;

  // If other error, return error
  if (error)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });

  // If token was valid and we got back a user, return the user
  if (jwtUser) return jwtUser;

  // Otherwise return the error
  return createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
  });
}

/**
 * @desc Verifies password reset token
 * @param token JSON web token
 */
export function verifyPasswordResetToken(token: string): H3Error | JwtPayload {
  let error = null;
  let tokenExpiredError = null;
  let jwtUser = null;

  jwt.verify(token, config.iamResetTokenSecret, (err, user) => {
    if (err) {
      console.log(err);

      // If reset token expired, return error
      if (err instanceof jwt.TokenExpiredError) {
        console.log("Expired password reset token");
        tokenExpiredError = err;
      }

      // If not, just return the error
      error = createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    } else {
      jwtUser = user as JwtPayload;
    }
  });

  // Check token expiration error first
  if (tokenExpiredError) return tokenExpiredError;

  // If other error, return error
  if (error)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });

  // If token was valid and we got back a user, return the user
  if (jwtUser) return jwtUser;

  // Otherwise return the error
  return createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
  });
}

/**
 * @desc Verifies email verification token
 * @param token JSON web token
 */
export function verifyEmailVerificationToken(
  token: string
): H3Error | JwtPayload {
  let error = null;
  let tokenExpiredError = null;
  let jwtUser = null;

  jwt.verify(token, config.iamVerifyTokenSecret, (err, user) => {
    if (err) {
      console.log(err);

      // If email verification token expired, return error
      if (err instanceof jwt.TokenExpiredError) {
        console.log("Expired email verification token");
        tokenExpiredError = err;
      }

      // If not, just return the error
      error = createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    } else {
      jwtUser = user as JwtPayload;
    }
  });

  // Check token expiration error first
  if (tokenExpiredError) return tokenExpiredError;

  // If other error, return error
  if (error)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });

  // If token was valid and we got back a user, return the user
  if (jwtUser) return jwtUser;

  // Otherwise return the error
  return createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
  });
}

/**
 * @desc Creates new tokens given a valid refresh token
 * @param token JSON web token
 */
export async function createNewTokensFromRefresh(
  token: string,
  event: H3Event
): Promise<TokensSession | H3Error> {
  const errorOrUser = await verifyRefreshToken(token);
  if (errorOrUser instanceof H3Error) return errorOrUser;

  const user = errorOrUser as User;

  const publicUser = {
    uuid: user?.uuid,
    email: user?.email,
  };

  if (user) {
    // Create access and refresh tokens
    const accessToken = jwt.sign(publicUser, config.iamAccessTokenSecret, {
      expiresIn: "15m",
    });

    const refreshTokenId = makeUuid();
    const refreshToken = jwt.sign(publicUser, config.iamRefreshTokenSecret, {
      expiresIn: "14d",
      issuer: "NuxtIam",
      jwtid: refreshTokenId,
    });

    // Deactivate current refresh token
    const deactivateTokenError = await deactivateRefreshTokens(user.id);
    if (deactivateTokenError) return deactivateTokenError;

    // Store tokens
    const storeTokenError = await storeRefreshToken(refreshTokenId, user.id);
    if (storeTokenError) return storeTokenError;

    // Deactivate current session
    const deactivateSessionsError = await deactivateUserSessions(user.id);
    if (deactivateSessionsError instanceof H3Error)
      return deactivateSessionsError;

    // Create new user session
    const sessionOrError = await createUserSession(user.id, accessToken, event);

    // Get session and session id
    if (sessionOrError instanceof H3Error) return sessionOrError;
    const session = sessionOrError as Session;

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      sid: session.sid,
    };
  }

  console.log("Error creating tokens");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @desc Checks if refresh token is active
 * @param tokenId Token's id
 */
export async function refreshTokenActive(tokenId: string): Promise<H3Error | void> {
  let error = null;

  await prisma.refresh_tokens
    .findFirstOrThrow({
      where: {
        token_id: tokenId,
        is_active: true,
      },
    })
    .then(async () => {})
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  if (error)
    return createError({ statusCode: 500, statusMessage: "Server error" });
}

/**
 * @desc Verifies refresh token
 * @param token JSON web token
 */
export async function verifyRefreshToken(
  token: string
): Promise<H3Error | User> {
  let error = null;
  let verifiedUser = null;
  let verifiedTokenPayload = null as JwtPayload | null;

  jwt.verify(token, config.iamRefreshTokenSecret, async (err, token) => {
    if (err) {
      console.log(err);
      error = createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    // Get verified token
    verifiedTokenPayload = token as JwtPayload;
  });

  if (error) return error;

  if (verifiedTokenPayload) {
    // Checks for token issuer
    if (verifiedTokenPayload.iss !== "NuxtIam") {
      console.log("Token issuer unknown");
      return createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    // Get token id
    const tokenId = verifiedTokenPayload.jti;

    // Checks for token id
    if (!tokenId) {
      console.log("Token id not found");
      return createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    // Checks if refresh token is active
    const tokenNotActiveError = await refreshTokenActive(tokenId);
    if (tokenNotActiveError) {
      console.log("Token not active");

      // This indicates a stolen token therefore deactivate all refresh tokens
      console.log("Detecting a stolen refresh token");
      const user = await getUserByEmail(verifiedTokenPayload.email);

      if (!user) {
        console.log("User not found from verified refresh token");
        console.log("This should not happen. Please check system integrity.");
        return createError({
          statusCode: 403,
          statusMessage: "Forbidden",
        });
      }

      // Deactivate all user's refresh tokens
      console.log(
        `Attempt to deactivate all user:${user.email}'s refresh tokens`
      );
      const deactivateError = await deactivateRefreshTokens(user.id);

      if (deactivateError) {
        console.log(
          `Deactivate all user:${user.email}'s refresh tokens failed`
        );
        console.log(
          `Should attempt to lock user's account if feature is available`
        );

        return deactivateError;
      }
      console.log(
        `All user:${user.email}'s refresh tokens deactivated. User must login`
      );
      return tokenNotActiveError;
    }

    // Try to get user by email
    const user = await getUserByEmail(verifiedTokenPayload.email);
    if (!user) {
      console.log("Failed to return user by email");
      return createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    verifiedUser = user;
  }

  if (verifiedUser) return verifiedUser;

  return createError({
    statusCode: 403,
    statusMessage: "Forbidden",
  });
}

/**
 * @desc Stores refresh token in database
 * @param tokenId Token's id
 * @param userId User's id
 */
export async function storeRefreshToken(
  tokenId: string,
  userId: number
): Promise<H3Error | void> {
  let error = null;
  await prisma.refresh_tokens
    .create({
      data: {
        token_id: tokenId,
        user_id: userId,
        is_active: true,
      },
    })
    .then(async () => {})
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  if (error)
    return createError({ statusCode: 500, statusMessage: "Server error" });
}

/**
 * @desc Deactivates a user's refresh tokens in database
 * @param userId User's id
 */
export async function deactivateRefreshTokens(
  userId: number
): Promise<H3Error | void> {
  let error = null;
  await prisma.refresh_tokens
    .updateMany({
      where: {
        user_id: userId,
      },
      data: {
        is_active: false,
      },
    })
    .then(async () => {})
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  if (error)
    return createError({ statusCode: 500, statusMessage: "Server error" });
}

/**
 * @Desc Attempts to add one time token to table, if successful returns the same token id
 * @param tokenId Token's uuid
 * @param expiresAt Date and time when token expires
 * @returns {Promise<H3Error|string>} Returns error or the given uuid
 */
export async function addOneTimeToken(
  tokenId: string,
  expiresAt: Date
): Promise<H3Error | string> {
  let error = null;

  // Update database
  await prisma.one_time_tokens
    .create({
      data: {
        token_id: tokenId,
        expires_at: expiresAt,
      },
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error adding one time token");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  console.log("One time token added successfully");
  return tokenId;
}

/**
 * @desc Returns JWT payload if token is valid, otherwise returns an error
 * @param token JSON web token
 * @param type Assigned token types
 */
export function getTokenPayload(
  token: string,
  type: "access" | "refresh" | "reset"
): H3Error | JwtPayload {
  let error = null;
  const tokenTypes = ["access", "refresh", "reset"];
  let tokenSecret = "";
  let tempPayload = null;
  let payload = null;

  // If incorrect token type, return error
  if (!tokenTypes.includes(type)) {
    console.log("Invalid token type");
    return (error = createError({
      statusCode: 500,
      statusMessage: "Serve error",
    }));
  }

  // Check token type
  switch (type) {
    case "access":
      tokenSecret = config.iamAccessTokenSecret;
      break;
    case "refresh":
      tokenSecret = config.iamRefreshTokenSecret;
      break;
    case "reset":
      tokenSecret = config.iamResetTokenSecret;
      break;
  }

  // Get token payload
  jwt.verify(token, tokenSecret, (err, jwtPayload) => {
    if (err) {
      console.log(err);

      // If not, just return the error
      error = createError({
        statusCode: 500,
        statusMessage: "Server error",
      });
    } else {
      tempPayload = jwtPayload;
    }
  });

  // Check for errors
  if (error) return error;

  // Otherwise return Jwt payload
  if (tempPayload) {
    console.log("Jwt payload obtained successfully");
    payload = tempPayload as JwtPayload;
    return payload;
  }

  // Return error (to satisfy Typescript demannds)
  console.log("We should never reach here");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @desc Checks for valid csrf (prevention) token
 * @param event H3 event
 */
export async function validateCsrfToken(
  event: H3Event
): Promise<H3Error | void> {
  const body = await readBody(event);
  const csrfToken = body.csrf_token;
  const sessionId = getCookie(event, "iam-sid");

  // If missing session id, should be part of validateCsrf() or validateSession() or validateTokenSession()
  if (!sessionId) {
    console.log("Missing session id cookie");
    return createError({
      statusCode: 403,
      statusMessage: "Invalid session",
    });
  }

  // If csrf token is missing should be part of validateCsrf() or validateSession() or validateTokenSession()
  if (!csrfToken) {
    console.log("Missing csrf token");
    return createError({
      statusCode: 403,
      statusMessage: "Missing csrf token",
    });
  }

  // Check if session and token are valid (check if a session with session)
  const sessionOrError = await validateCsrfSessionToken(sessionId, csrfToken);

  // If error, return error, otherwise session and csrftoken are good, we return nothing
  if (sessionOrError instanceof H3Error) return sessionOrError;
}

/**
 * @Desc Check if session and token are valid
 * @param sessionId User session id
 * @param csrfToken User's given csrf token
 * @returns {Promise<H3Error|Session>} Returns error or the given uuid
 */
export async function validateCsrfSessionToken(
  sessionId: string,
  csrfToken: string
): Promise<H3Error | Session> {
  let error = null;
  let session = null;

  // Deactivate session
  await prisma.sessions
    .findFirst({
      where: {
        sid: sessionId,
        csrf_token: csrfToken,
        is_active: true,
      },
    })
    .then(async (result) => {
      session = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error validating user session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a session, return it
  if (session) return session;

  // Otherwise, return an error
  console.log(
    "We should not be getting this validate csrf session token error"
  );
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}
