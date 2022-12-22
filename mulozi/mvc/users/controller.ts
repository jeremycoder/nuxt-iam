/* Users controller
 * Routes all user requests
 */

import UrlPattern from "url-pattern";
import { usersMiddleware } from "./middleware";
import { index, create, show, update, destroy } from "./model";

export default defineEventHandler(async (event) => {
  const route = UrlPattern;
  const url = event.node.req.url;
  const method = event.node.req.method;
  let result = null;

  // Middleware for all user routes
  const middlewareError = usersMiddleware(event);
  if (middlewareError) throw middlewareError;

  // Routes
  if (method && url)
    switch (method) {
      case "GET":
        // show all users
        result = new route("/api/mulozi/users").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await index(event);
        }

        // show a particular user
        result = new route("/api/mulozi/users(/:uuid)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await show(event);
        }
        break;

      case "POST":
        // add new user to database
        result = new route("/api/mulozi/users/create").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await create(event);
        }
        break;

      case "PUT":
        // update particular user then redirect
        result = new route("/api/mulozi/users(/:uuid)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await update(event);
        }
        break;

      case "DELETE":
        // delete particular user
        result = new route("/api/mulozi/users(/:uuid)").match(url);
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
