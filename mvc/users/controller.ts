/* Users controller
 * The users controller routes requests to the model
 */

import UrlPattern from "url-pattern";
import { index, create, store, show, edit, update, destroy } from "./model";

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

        // show form to create all users
        result = new route("/api/users/new").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await create(event);
        }

        // show a particular user
        result = new route("/api/users(/:uuid)").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await show(event);
        }

        // show edit form for one user
        result = new route("/api/users(/:uuid)/edit").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await edit(event);
        }

      case "POST":
        // add new user to database
        result = new route("/api/users").match(url);
        if (result) {
          event.context.params.fromRoute = result;
          return await store(event);
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
