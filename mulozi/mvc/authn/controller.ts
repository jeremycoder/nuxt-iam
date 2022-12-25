/* Authentication controller
 * Routes all authentication requests
 */

import UrlPattern from "url-pattern";
import { authnMiddleware } from "./middleware";
import { H3Error } from "h3";
import { register, login, refresh, logout, authenticated } from "./model";

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
        result = new route("/api/mulozi/authn/register").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await register(event);
        }

        // log into database
        result = new route("/api/mulozi/authn/login").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await login(event);
        }

        // determine if user is authenticated
        result = new route("/api/mulozi/authn/authenticated").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await authenticated(event);
        }

        // refresh jwt tokens
        result = new route("/api/mulozi/authn/refresh").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await refresh(event);
        }

        // log user out
        result = new route("/api/mulozi/authn/logout").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await logout(event);
        }
        break;
    }

  throw createError({
    statusCode: 405,
    statusMessage: "Method not allowed",
  });
});
