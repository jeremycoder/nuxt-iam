/* Users controller
 * Routes all user requests
 */

import UrlPattern from "url-pattern";
import { JSONResponse, User } from "~~/iam/misc/types";
import { index, destroy, destroyAll } from "./model";
import {
  isSuperAdmin,
  hasVerifiedEmail,
  getUserFromAccessToken,
  getUserUuidFromAccessToken,
} from "~~/iam/authz/permissions";
import { H3Error } from "h3";
import { isAuthenticated } from "~~/iam/mvc/authn/queries";
import { validateCsrfToken } from "~~/iam/misc/helpers";

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
        // get all refresh tokens
        result = new route("/api/iam/refresh-tokens").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 

          // Permissions
          if (!isSuperAdmin(user)) return forbiddenError;
          if (!hasVerifiedEmail(user)) return forbiddenError;

          return await index(event);
        }

      case "DELETE":
        // delete a particular refresh token
        result = new route("/api/iam/refresh-tokens(/:id)").match(url);
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
          if (!isSuperAdmin(user)) return forbiddenError;
          if (!hasVerifiedEmail(user)) return forbiddenError;

          return await destroy(event);
        }

        // delete all refresh tokens
        result = new route("/api/iam/refresh-tokens/").match(url);
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
          if (!isSuperAdmin(user)) return forbiddenError;
          if (!hasVerifiedEmail(user)) return forbiddenError;

          return await destroyAll(event);
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
