/* Users controller
 * The users controller routes requests to the model
 */

import UrlPattern from "url-pattern";
import {
  index,
  register,
  login,
  refresh,
  show,
  update,
  destroy,
} from "./model";

export default defineEventHandler(async (event) => {
  const route = UrlPattern;
  const url = event.node.req.url;
  const method = event.node.req.method;
  let result = null;

  // Middleware for all user routes could go here

  if (method && url)
    switch (method) {
      case "GET":
        // show all users
        result = new route("/api/users").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await index(event);
        }

        // show a particular user
        result = new route("/api/users(/:uuid)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await show(event);
        }

      case "POST":
        // add new user to database
        result = new route("/api/users/register").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await register(event);
        }

        // log into database
        result = new route("/api/users/login").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await login(event);
        }

        // refresh jwt tokens
        result = new route("/api/users/refresh").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await refresh(event);
        }
        break;

      case "PUT":
        // update particular user then redirect
        result = new route("/api/users(/:uuid)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await update(event);
        }
        break;

      case "DELETE":
        // delete particular user
        result = new route("/api/users(/:uuid)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await destroy(event);
        }
        break;
    }

  throw createError({
    statusCode: 405,
    statusMessage: "Method not allowed",
  });
});
