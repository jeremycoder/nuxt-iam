/* Users controller
 * Routes all user requests
 */

import UrlPattern from "url-pattern";
import { usersMiddleware } from "./middleware";
import { JSONResponse } from "~~/iam/misc/types";
import { H3Error } from "h3";
import { index, create, show, update, destroy } from "./model";

export default defineEventHandler(async (event) => {
  const route = UrlPattern;
  const url = event.node.req.url;
  const method = event.node.req.method;
  let result = null;
  const response = {} as JSONResponse;

  // Middleware for all user routes
  const errorOrPlatform = usersMiddleware(event);
  if (errorOrPlatform instanceof H3Error) throw errorOrPlatform;

  // Routes
  if (method && url)
    switch (method) {
      case "GET":
        // show all users
        result = new route("/api/iam/users").match(url);
        if (result) {
          event.context.params.fromRoute = result;

          // Potential - get access token, check user credentials for this route
          // if (!hasPermissions("get", "/api/iam/users", event)) {
          //   response.status = "fail";
          //   response.error = createError({
          //     statusCode: 405,
          //     statusMessage: "Method not allowed",
          //   });

          //   return response;
          // }

          return await index(event);
        }

        // show a particular user
        result = new route("/api/iam/users(/:uuid)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await show(event);
        }
        break;

      case "POST":
        // add new user to database
        result = new route("/api/iam/users/create").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await create(event);
        }
        break;

      case "PUT":
        // update particular user then redirect
        result = new route("/api/iam/users(/:uuid)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await update(event);
        }
        break;

      case "DELETE":
        // delete particular user
        result = new route("/api/iam/users(/:uuid)").match(url);
        if (result) {
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
