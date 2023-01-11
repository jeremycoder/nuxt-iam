/* Users Table Permissions controller
 * Routes all permission requests
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
        // show all permissions
        result = new route("/api/iam/users-table-perms").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await index(event);
        }

        // show a particular permission
        result = new route("/api/iam/users-table-perms(/:id)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await show(event);
        }
        break;

      case "POST":
        // add new permission to database
        result = new route("/api/iam/users-table-perms").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await create(event);
        }
        break;

      case "PUT":
        // update particular permission then redirect
        result = new route("/api/iam/users-table-perms(/:id)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await update(event);
        }
        break;

      case "DELETE":
        // delete particular permission
        result = new route("/api/iam/users-table-perms(/:id)").match(url);
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
