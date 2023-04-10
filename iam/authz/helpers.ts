// Helper functions for authorization

import { H3Event, H3Error } from "h3";
import { verifyAccessToken } from "../misc/utils/tokens";
import { getUserByUuid } from "../misc/utils/users";
import { JwtPayload } from "jsonwebtoken";
import { User } from "~~/iam/misc/types";

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

  console.log('Attempt to get user from access token')

  // Client platform if not using Nuxt front end
  let clientPlatform = event.node.req.headers["client-platform"] as string;

  // If no client platform, upgrade to browser
  if (!clientPlatform) clientPlatform = "browser"  

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
    console.log("No access token provided. Cannot get user from access token");
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