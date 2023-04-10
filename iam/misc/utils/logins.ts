import { User, TokensSession, Session } from "~~/iam/misc/types";
import jwt from "jsonwebtoken";
import { H3Event, H3Error } from "h3";
import { OAuth2Client } from "google-auth-library";
import { makeUuid, verifyPassword } from "./passwords";
import { getUserByEmail, getUserById, updateLastLogin } from "./users";
import { storeRefreshToken, deactivateRefreshTokens, } from "./tokens";
import { createUserSession, deactivateUserSessions, getUserSession, endUserSession } from "./sessions";

const config = useRuntimeConfig();

/**
 * @desc Authenticates user
 * @param event Event from Api
 */
export async function login(event: H3Event): Promise<H3Error | TokensSession> {
  const tokens = {} as TokensSession;
  const body = await readBody(event);

  if (!body)
    return createError({
      statusCode: 401,
      statusMessage: "No email or password provided",
    });

  const user = await getUserByEmail(body.email);

  if (user === null) {
    return createError({ statusCode: 401, statusMessage: "Invalid login" });
  }

  if (await verifyPassword(user.password, body.password)) {
    // Update last login time
    await updateLastLogin(user.email);

    const publicUser = {
      uuid: user.uuid,
      email: user.email,
    };

    // Create access token
    const accessToken = jwt.sign(publicUser, config.iamAccessTokenSecret, {
      expiresIn: "15m",
      issuer: "NuxtIam",
      jwtid: makeUuid(),
    });

    // Create refresh token
    const tokenId = makeUuid();
    const refreshToken = jwt.sign(publicUser, config.iamRefreshTokenSecret, {
      expiresIn: "14d",
      issuer: "NuxtIam",
      jwtid: tokenId,
    });

    // Deactivate any other tokens
    const deactivateTokenError = await deactivateRefreshTokens(user.id);
    if (deactivateTokenError) return deactivateTokenError;

    // Store tokens
    const storeTokenError = await storeRefreshToken(tokenId, user.id);
    if (storeTokenError) return storeTokenError;

    // Assign tokens
    tokens.accessToken = accessToken;
    tokens.refreshToken = refreshToken;

    // Create user session, if error, return error
    const sessionOrTokenError = await createUserSession(
      user.id,
      accessToken,
      event
    );

    // If session error, return error
    if (sessionOrTokenError instanceof H3Error) {
      console.log("Trouble creating session");
      return createError({ statusCode: 500, statusMessage: "Server error" });
    }

    // Get session and session id
    const session = sessionOrTokenError as Session;
    tokens.sid = session.sid;

    return tokens;
  }

  return createError({ statusCode: 401, statusMessage: "Invalid login" });
}

/**
 * @desc Logs a user out
 * @param event Event from Api
 */
export async function logout(event: H3Event): Promise<H3Error | void> {
  let sessionOrError = {} as H3Error | Session;

  // Get session id and session
  const sessionId = getCookie(event, "iam-sid");
  if (sessionId) sessionOrError = await getUserSession(sessionId);

  // If error, log error but delete all cookies anyway
  if (sessionOrError instanceof H3Error) {
    console.log(
      "Error with logout. Sessions might not be disabled. Security risk."
    );
    console.log("Proceeding with removing all cookies");
    deleteCookie(event, "iam-access-token");
    deleteCookie(event, "iam-refresh-token");
    deleteCookie(event, "iam-sid");
  }
  // Otherwise deactivate refresh tokens and all other user's sessions
  else {
    const session = sessionOrError as Session;
    const userOrNull = await getUserById(session.user_id);

    console.log("Cookies and session id removed.");
    deleteCookie(event, "iam-access-token");
    deleteCookie(event, "iam-refresh-token");
    deleteCookie(event, "iam-sid");

    // If no user, log error, but delete all cookies anyway
    if (userOrNull === null) {
      console.log("Error with logout. User not found");      
    } else {
      // Otherwise get user
      const user = userOrNull as User;
      // Deactivate all refresh tokens
      const deactivateError = await deactivateRefreshTokens(user.id);
      if (deactivateError) {
        console.log(`Failed to deactivate user:${user.email}'s refresh tokens`);
        return createError({
          statusCode: 500,
          statusMessage: "Logout error.",
        });
      }

      // Deactivate user sessions
      const deactivateSessionsError = await deactivateUserSessions(user.id);
      if (deactivateSessionsError instanceof H3Error)
        return deactivateSessionsError;

      // End user session
      let endUserSessionOrError = {} as H3Error | Session;
      if (sessionId) endUserSessionOrError = await endUserSession(sessionId);

      // If error, log error
      if (endUserSessionOrError instanceof H3Error) {
        console.log("Error ending user session in logout. Security risk");
      }
    }
  }
}

/**
 * @Desc Get tokens after Google login
 * @param user Get Google
 * @param event H3 Event
 * @returns {Promise<H3Error|User>} Returns error or the given uuid
 */
export async function getTokensAfterGoogleLogin(
  user: User,
  event: H3Event
): Promise<H3Error | TokensSession> {
  const tokens = {} as TokensSession;

  if (user === null) {
    return createError({
      statusCode: 401,
      statusMessage: "Invalid login. User not found.",
    });
  }

  // Update last login time
  await updateLastLogin(user.email);

  const publicUser = {
    uuid: user.uuid,
    email: user.email,
  };

  // Create access token
  const accessToken = jwt.sign(publicUser, config.iamAccessTokenSecret, {
    expiresIn: "15m",
    issuer: "NuxtIam",
    jwtid: makeUuid(),
  });

  // Create refresh token
  const tokenId = makeUuid();
  const refreshToken = jwt.sign(publicUser, config.iamRefreshTokenSecret, {
    expiresIn: "14d",
    issuer: "NuxtIam",
    jwtid: tokenId,
  });

  // Deactivate any other tokens
  const deactivateTokenError = await deactivateRefreshTokens(user.id);
  if (deactivateTokenError) return deactivateTokenError;

  // Store tokens
  const storeTokenError = await storeRefreshToken(tokenId, user.id);
  if (storeTokenError) return storeTokenError;

  // Assign tokens
  tokens.accessToken = accessToken;
  tokens.refreshToken = refreshToken;

  // Create user session, if error, return error
  const sessionOrTokenError = await createUserSession(
    user.id,
    accessToken,
    event
  );

  // If session error, return error
  if (sessionOrTokenError instanceof H3Error) {
    console.log("Trouble creating session");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Get session and session id
  const session = sessionOrTokenError as Session;
  tokens.sid = session.sid;

  return tokens;
}

/**
 * @Desc Verifies Google access token after sign in
 * @param token Google access token
 * @info Code obtained from https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
 * @returns { H3Error|jwt.JwtPayload } Returns error or the given uuid
 */
export async function verifyGoogleToken(
  token: string
): Promise<H3Error | jwt.JwtPayload> {
  let tokenPayload = null;

  const clientId = useRuntimeConfig().iamGoogleClientId;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    tokenPayload = ticket.getPayload();

    // if (payload) tokenPayload = payload["sub"];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  await verify().catch(console.error);

  if (tokenPayload) return tokenPayload;
  else {
    console.log("Error verifying Google access token");
    return createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
}

/**
 * @desc Returns a list of all authenticated route based that need an authenticated user
*/
export function getAuthenticatedRoutes(): Array<string> {
  return [
    '/api/iam/users',   
    '/api/iam/refresh-tokens',    
  ];
}