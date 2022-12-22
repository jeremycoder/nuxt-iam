/** Middleware for all authn routes
 * Middleware should only return error or void
 */
import { H3Event, H3Error } from "h3";
import { checkClientPlatform } from "~~/mulozi/middleware/";

export function authnMiddleware(event: H3Event): H3Error | void {
  let error = null;

  error = checkClientPlatform(event);
  if (error) return error;
}
