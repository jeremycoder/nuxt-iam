/* Variables to help with authorization */
import { H3Event, H3Error } from "h3";
import { verifyAccessToken, getUserByUuid } from "../misc/helpers";
import { JwtPayload } from "jsonwebtoken";
import { User } from "~~/iam/misc/types";

export default function permissionVariables(event: H3Event) {
  return {
    getAuthorizedUser,
  };
}

async function getAuthorizedUser(event: H3Event): Promise<User | null> {
  // Get client platform
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
