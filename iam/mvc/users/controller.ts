/* Users controller
 * Routes all user requests
 */

import UrlPattern from "url-pattern";
import { usersMiddleware } from "./middleware";
import { JSONResponse, User } from "~~/iam/misc/types";
import { H3Error } from "h3";
import { index, create, show, update, destroy } from "./model";
import {
  isSuperAdmin,
  hasVerifiedEmail,
  isOwner,
  getUserFromAccessToken,
  getUserUuidFromAccessToken,
} from "~~/iam/authz/permissions";

export default defineEventHandler(async (event) => {
  const route = UrlPattern;
  const url = event.node.req.url;
  const method = event.node.req.method;
  let result = null;
  const response = {} as JSONResponse;

  // Create forbiddenError
  const forbiddenError = {} as JSONResponse;
  forbiddenError.status = "fail";
  forbiddenError.error = createError({
    statusCode: 403,
    statusMessage: "Forbidden",
  });

  // Get user to prepare for permission checks
  const userOrNull = await getUserFromAccessToken(event);
  if (userOrNull === null) return forbiddenError;
  const user = userOrNull as User;

  // Get userUuid to prepare for permission checks
  const userUuidOrNull = getUserUuidFromAccessToken(event);
  if (userUuidOrNull === null) return forbiddenError;
  const userUuid = userUuidOrNull as string;

  // Routes
  if (method && url)
    switch (method) {
      case "GET":
        // show all users
        result = new route("/api/iam/users").match(url);
        if (result) {
          // Permissions
          if (!isSuperAdmin(user)) return forbiddenError;
          if (!hasVerifiedEmail(user)) return forbiddenError;

          event.context.params.fromRoute = result;
          return await index(event);
        }

        // show a particular user
        result = new route("/api/iam/users(/:uuid)").match(url);
        if (result) {
          // Permissions
          if (!isSuperAdmin(user) && !isOwner(userUuid, result.uuid))
            return forbiddenError;

          event.context.params.fromRoute = result;
          return await show(event);
        }
        break;

      case "POST":
        // add new user to database
        result = new route("/api/iam/users/create").match(url);
        if (result) {
          // Permissions
          if (!isSuperAdmin(user)) return forbiddenError;
          if (!hasVerifiedEmail(user)) return forbiddenError;

          event.context.params.fromRoute = result;
          return await create(event);
        }
        break;

      case "PUT":
        // update particular user then redirect
        result = new route("/api/iam/users(/:uuid)").match(url);
        if (result) {
          // Permissions
          if (!isSuperAdmin(user) && !isOwner(userUuid, result.uuid))
            return forbiddenError;

          event.context.params.fromRoute = result;
          return await update(event);
        }
        break;

      case "DELETE":
        // delete particular user
        result = new route("/api/iam/users(/:uuid)").match(url);
        if (result) {
          // Permissions
          if (!isSuperAdmin(user) && !isOwner(userUuid, result.uuid))
            return forbiddenError;

          event.context.params.fromRoute = result;
          return await destroy(event);
        }
        break;
    }

  // Return method not allowed error
  response.status = "fail";
  response.error = createError({
    statusCode: 405,
    statusMessage: "Method not allowed",
  });

  return response;
});
