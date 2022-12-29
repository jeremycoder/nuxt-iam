/** Middleware for all authn routes
 * Middleware should only return error or void
 */
import { H3Event, H3Error } from "h3";
import { getClientPlatform } from "~~/iam/middleware/";

export function authnMiddleware(event: H3Event): H3Error | string {
  return getClientPlatform(event);
}
