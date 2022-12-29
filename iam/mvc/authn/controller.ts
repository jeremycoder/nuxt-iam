/* Authentication controller
 * Routes all authentication requests
 */

import UrlPattern from "url-pattern";
import { authnMiddleware } from "./middleware";
import { JSONResponse } from "~~/iam/misc/types";
import { H3Error } from "h3";
import { register, login, refresh, logout, isauthenticated } from "./model";

export default defineEventHandler(async (event) => {
  const route = UrlPattern;
  const url = event.node.req.url;
  const method = event.node.req.method;
  let result = null;

  // Middleware for all authn routes
  const errorOrPlatform = authnMiddleware(event);
  if (errorOrPlatform instanceof H3Error) throw errorOrPlatform;

  if (method && url)
    switch (method) {
      case "POST":
        // add new user to database
        result = new route("/api/iam/authn/register").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await register(event);
        }

        // log into database
        result = new route("/api/iam/authn/login").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await login(event);
        }

        // determine if user is authenticated
        result = new route("/api/iam/authn/isauthenticated").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await isauthenticated(event);
        }

        // refresh jwt tokens
        result = new route("/api/iam/authn/refresh").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await refresh(event);
        }

        // log user out
        result = new route("/api/iam/authn/logout").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await logout(event);
        }
        break;
    }

  // Return method not allowed error
  const response = {} as JSONResponse;
  response.status = "fail";
  response.data = createError({
    statusCode: 405,
    statusMessage: "Method not allowed",
  });

  return response;
});
