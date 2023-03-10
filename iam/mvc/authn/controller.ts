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
  loginWithGoogle,
  profile,
  update,
  refresh,
  logout,
  isauthenticated,
  destroy,
  reset,
  verifyReset,
  verifyEmail,
  verifyEmailToken,
} from "./model";

export default defineEventHandler(async (event) => {
  const route = UrlPattern;

  // Get url with query parameters
  let url = event.node.req.url;

  // Remove query parameters because url pattern does not understand them
  if (url && url.includes("?")) url = url.substring(0, url.indexOf("?"));

  const method = event.node.req.method;
  let result = null;

  // Middleware for all authn routes
  const errorOrPlatform = authnMiddleware(event);
  if (errorOrPlatform instanceof H3Error) throw errorOrPlatform;

  if (method && url)
    switch (method) {
      case "GET":
        // get authenticated user's profile
        result = new route("/api/iam/authn/profile").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await profile(event);
        }

        // determine if user is authenticated
        result = new route("/api/iam/authn/isauthenticated").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await isauthenticated(event);
        }
        break;
      case "POST":
        // add new user to database
        result = new route("/api/iam/authn/register").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await register(event);
        }

        // log into database
        result = new route("/api/iam/authn/login").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await login(event);
        }

        // log into database with Google
        result = new route("/api/iam/authn/login-google").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await loginWithGoogle(event);
        }

        // refresh jwt tokens
        result = new route("/api/iam/authn/refresh").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await refresh(event);
        }

        // reset user password
        result = new route("/api/iam/authn/reset").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await reset(event);
        }

        // verifies token sent from reset email
        result = new route("/api/iam/authn/verifyreset(/:token)").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await verifyReset(event);
        }

        // send email to verify user email
        result = new route("/api/iam/authn/verifyemail").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await verifyEmail(event);
        }

        // verify token sent from user's email verification link
        result = new route("/api/iam/authn/verifyemailtoken").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await verifyEmailToken(event);
        }

        // log user out
        result = new route("/api/iam/authn/logout").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await logout(event);
        }
        break;
      case "PUT":
        // update user profile
        result = new route("/api/iam/authn/update").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await update(event);
        }
        break;
      case "DELETE":
        // delete user account
        result = new route("/api/iam/authn/delete").match(url);
        if (result) {
          if (event.context.params) event.context.params.fromRoute = result; 
          return await destroy(event);
        }
        break;
    }

  // If the wrong method
  const response = {} as JSONResponse;
  response.status = "fail";
  response.error = createError({
    statusCode: 405,
    statusMessage: "Method not allowed",
  });

  return response;
});
