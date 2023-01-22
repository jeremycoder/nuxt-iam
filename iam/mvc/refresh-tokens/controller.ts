/* Users controller
 * Routes all user requests
 */

import UrlPattern from "url-pattern";
import { JSONResponse } from "~~/iam/misc/types";
import { H3Error } from "h3";
import { index, destroy, destroyAll } from "./model";
import { isSuperAdmin, hasVerifiedEmail } from "~~/iam/authz/permissions";

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

  // Routes
  if (method && url)
    switch (method) {
      case "GET":
        // get all refresh tokens
        result = new route("/api/iam/refresh-tokens").match(url);
        if (result) {
          event.context.params.fromRoute = result;

          return await index(event);
        }

      case "DELETE":
        // delete a particular refresh token
        result = new route("/api/iam/refresh-tokens(/:id)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await destroy(event);
        }

        // delete all refresh tokens
        result = new route("/api/iam/refresh-tokens/").match(url);
        if (result) {
          event.context.params.fromRoute = result;
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
