/* Authentication controller
 * Routes all authentication requests
 */

import UrlPattern from "url-pattern";
import { authnMiddleware } from "./middleware";
import { JSONResponse } from "~~/iam/misc/types";
import { H3Error } from "h3";
import {
  register,
  login,
  profile,
  update,
  refresh,
  logout,
  isauthenticated,
  destroy,
  reset,
  verifyReset,
} from "./model";

export default defineEventHandler(async (event) => {
  const route = UrlPattern;
  const url = event.node.req.url;
  const method = event.node.req.method;
  let result = null;

  // Middleware for all authn routes
  // TODO: This traps reset emai link, reset email link should not require header
  const errorOrPlatform = authnMiddleware(event);
  if (errorOrPlatform instanceof H3Error) throw errorOrPlatform;

  if (method && url)
    switch (method) {
      case "GET":
        // get authenticated user's profile
        result = new route("/api/iam/authn/profile").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await profile(event);
        }

        // determine if user is authenticated
        result = new route("/api/iam/authn/isauthenticated").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await isauthenticated(event);
        }
        break;
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

        // refresh jwt tokens
        result = new route("/api/iam/authn/refresh").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await refresh(event);
        }

        // reset user password
        result = new route("/api/iam/authn/reset").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await reset(event);
        }

        // verifies token sent from reset email
        result = new route("/api/iam/authn/verifyreset(/:token)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await verifyReset(event);
        }

        // log user out
        result = new route("/api/iam/authn/logout").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await logout(event);
        }
        break;
      case "PUT":
        // update user profile
        result = new route("/api/iam/authn/update").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await update(event);
        }
        break;
      case "DELETE":
        // delete user account
        result = new route("/api/iam/authn/delete").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await destroy(event);
        }
        break;
    }

  const response = {} as JSONResponse;
  response.status = "fail";
  response.error = createError({
    statusCode: 405,
    statusMessage: "Method not allowed",
  });

  return response;
});
