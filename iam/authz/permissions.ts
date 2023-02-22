/* Permissions should always return true or false. Any error that occurs, should print to the console and return false */
/* They are designed to be independent checks. However because they may do very similar things, they can become expensive*/

import { H3Event, H3Error } from "h3";
import { verifyAccessToken, getUserByUuid } from "../misc/helpers";
import { JwtPayload } from "jsonwebtoken";
import { User } from "~~/iam/misc/types";

/**
 * @desc Determines if user has role of SUPER_ADMIN
 * @param user User object
 */
export function isSuperAdmin(user: User): boolean {
  if ("role" in user === false) return false;

  if (user.role !== "SUPER_ADMIN") {
    console.log("Authorization failed. User is not a SUPER_ADMIN");
    return false;
  }
  return true;
}

/**
 * @desc Determines if user has a verified email
 * @param user User object
 */
export function hasVerifiedEmail(user: User): boolean {
  if (user.email_verified === false) {
    console.log("Authorization failed. User email is not verified");
    return false;
  }

  return true;
}

/**
 * @desc Determines if user can read their own user record
 * @param userUuid User uuid
 * @param routeUuid User uuid from the route
 */
export function isOwner(userUuid: string, routeUuid: string): boolean {
  if (userUuid !== routeUuid) {
    console.log("Authorization failed. User is not owner of record.");
    return false;
  }

  return true;
}

/**
 * @desc Gets user from access token
 * @param event Event from api
 */

export async function getUserFromAccessToken(
  event: H3Event
): Promise<User | null> {
  let accessToken = null;
  let tokenPayload = null;

  // Client platform if not using Nuxt front end
  const clientPlatform = event.node.req.headers["client-platform"] as string;

  // If client platform is app, get access token from headers
  if (clientPlatform === "app")
    accessToken = event.node.req.headers["iam-access-token"] as string;
  // Otherwise, get it from cookies
  else if (["browser", "browser-dev"].includes(clientPlatform)) {
    accessToken = getCookie(event, "iam-access-token") as string;
  }
  // If that fails, value is invalid
  else {
    console.log("Invalid client platform: ", clientPlatform);
    return null;
  }

  // If no token, display error and return false
  if (!accessToken) {
    console.log("No access token provided. Cannot verify user is SUPER_ADMIN");
    return null;
  }

  // Verify access token
  const accessTokenArr = accessToken.split(" ");
  const errorOrToken = verifyAccessToken(accessTokenArr[1]);

  // If error, print to console and return false
  if (errorOrToken instanceof H3Error) {
    console.log(errorOrToken);
    console.log("Error verifying access token");
    return null;
  }

  // Otherwise, get token payload
  tokenPayload = errorOrToken as JwtPayload;

  // Get user by uuid
  const userOrNull = await getUserByUuid(tokenPayload.uuid);

  // If no user, show error, return false
  if (userOrNull === null) {
    console.log("Failed to get user to check for isSuperAdmin");
    return null;
  }

  // Otherwise get  and return
  const user = userOrNull as User;
  return user;
}

/**
 * @desc Gets user uuid
 * @param event Event from api
 */
export function getUserUuidFromAccessToken(event: H3Event): string | null {
  let accessToken = null;
  let tokenPayload = null;

  // Client platform if not using Nuxt front end
  const clientPlatform = event.node.req.headers["client-platform"] as string;

  // If client platform is app, get access token from headers
  if (clientPlatform === "app")
    accessToken = event.node.req.headers["iam-access-token"] as string;
  // Otherwise, get it from cookies
  else if (["browser", "browser-dev"].includes(clientPlatform)) {
    accessToken = getCookie(event, "iam-access-token") as string;
  }
  // If that fails, value is invalid
  else {
    console.log("Invalid client platform: ", clientPlatform);
    return null;
  }

  // If no token, display error and return false
  if (!accessToken) {
    console.log("No access token provided. Cannot verify user is SUPER_ADMIN");
    return null;
  }

  // Verify access token
  const accessTokenArr = accessToken.split(" ");
  const errorOrToken = verifyAccessToken(accessTokenArr[1]);

  // If error, print to console and return false
  if (errorOrToken instanceof H3Error) {
    console.log(errorOrToken);
    console.log("Error verifying access token");
    return null;
  }

  // Otherwise, get token payload and return uuid
  tokenPayload = errorOrToken as JwtPayload;
  return tokenPayload.uuid;
}
