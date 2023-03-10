/* Example doodads controller
 * Routes all doodad requests
 */

import UrlPattern from "url-pattern";
import { JSONResponse } from "~~/iam/misc/types";
import { index, create, show, update, destroy } from "./model";

export default defineEventHandler(async (event) => {
  const route = UrlPattern;

  // Get url with query parameters
  let url = event.node.req.url;

  // Remove query parameters because url pattern does not understand them
  if (url && url.includes("?")) url = url.substring(0, url.indexOf("?"));

  const method = event.node.req.method;
  let result = null;
  const response = {} as JSONResponse;

  // Routes
  if (method && url)
    switch (method) {
      case "GET":
        // show all doodads
        result = new route("/api/iam/doodads").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result;
          return await index(event);
        }

        // show a particular doodad
        result = new route("/api/iam/doodads(/:id)").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result;
          return await show(event);
        }
        break;

      case "POST":
        // add new user to database
        result = new route("/api/iam/doodads").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result;
          return await create(event);
        }
        break;

      case "PUT":
        // update particular user then redirect
        result = new route("/api/iam/doodads(/:id)").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result;
          return await update(event);
        }
        break;

      case "DELETE":
        // delete particular doodad
        result = new route("/api/iam/doodads(/:id)").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result;          
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
