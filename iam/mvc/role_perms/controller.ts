/* Users controller
 * Routes all role requests
 */

import UrlPattern from "url-pattern";
import { JSONResponse } from "~~/iam/misc/types";
import { index, create, show, update, destroy } from "./model";

export default defineEventHandler(async (event) => {
  const route = UrlPattern;
  const url = event.node.req.url;
  const method = event.node.req.method;
  let result = null;

  // Routes
  if (method && url)
    switch (method) {
      case "GET":
        // show all roles
        result = new route("/api/iam/role-perms").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await index(event);
        }

        // show a particular role
        result = new route("/api/iam/role-perms(/:id)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await show(event);
        }
        break;

      case "POST":
        // add new role to database
        result = new route("/api/iam/role-perms/create").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await create(event);
        }
        break;

      case "PUT":
        // update particular role then redirect
        result = new route("/api/iam/role-perms(/:id)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await update(event);
        }
        break;

      case "DELETE":
        // delete particular role
        result = new route("/api/iam/role-perms(/:id)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await destroy(event);
        }
        break;
    }

  // Return method not allowed error
  const response = {} as JSONResponse;
  response.status = "fail";
  response.error = createError({
    statusCode: 405,
    statusMessage: "Method not allowed",
  });

  return response;
});
