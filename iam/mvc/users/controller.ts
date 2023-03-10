/* Users controller
 * Routes all user requests
 */

import UrlPattern from "url-pattern";
import { JSONResponse, User } from "~~/iam/misc/types";
import { index, create, show, update, destroy } from "./model";
import {
  isSuperAdmin,
  hasVerifiedEmail,
  isOwner,
  getUserFromAccessToken,
  getUserUuidFromAccessToken,
} from "~~/iam/authz/permissions";
import { H3Error } from "h3";
import { validateCsrfToken } from "~~/iam/misc/helpers";
import { isAuthenticated } from "~~/iam/mvc/authn/queries";

export default defineEventHandler(async (event) => {
  const route = UrlPattern;

  // Get url with query parameters
  let url = event.node.req.url;

  // Remove query parameters because url pattern does not understand them
  if (url && url.includes("?")) url = url.substring(0, url.indexOf("?"));

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

  // Check if user is authenticated
  const authenticated = await isAuthenticated(event);

  if (authenticated instanceof H3Error) {
    response.status = "fail";
    response.error = authenticated;
    return response;
  }

  if (authenticated === false) {
    response.status = "fail";
    return forbiddenError;
  }

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
          if (event.context.params) event.context.params.fromRoute = result; 

          // Permissions
          if (!isSuperAdmin(user)) return forbiddenError;
          if (!hasVerifiedEmail(user)) return forbiddenError;

          return await index(event);
        }

        // show a particular user
        result = new route("/api/iam/users(/:uuid)").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 

          // Permissions
          if (!isSuperAdmin(user) && !isOwner(userUuid, result.uuid))
            return forbiddenError;

          return await show(event);
        }
        break;

      case "POST":
        // add new user to database
        result = new route("/api/iam/users").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await create(event);
        }
        break;

      case "PUT":
        // update particular user then redirect
        result = new route("/api/iam/users(/:uuid)").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 

          // Check if csrf token is valid
          const csrfTokenError = await validateCsrfToken(event);

          if (csrfTokenError instanceof H3Error) {
            console.log("Csrf token error");
            response.status = "fail";
            response.error = createError({
              statusCode: 403,
              statusMessage: "Missing or invalid csrf token",
            });
            return response;
          }

          // Permissions
          if (!isSuperAdmin(user) && !isOwner(userUuid, result.uuid))
            return forbiddenError;

          return await update(event);
        }
        break;

      case "DELETE":
        // delete particular user
        result = new route("/api/iam/users(/:uuid)").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 

          // Check if csrf token is valid
          const csrfTokenError = await validateCsrfToken(event);

          if (csrfTokenError instanceof H3Error) {
            console.log("Csrf token error");
            response.status = "fail";
            response.error = createError({
              statusCode: 403,
              statusMessage: "Missing or invalid csrf token",
            });
            return response;
          }

          // Permissions
          if (!isSuperAdmin(user) && !isOwner(userUuid, result.uuid))
            return forbiddenError;

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
