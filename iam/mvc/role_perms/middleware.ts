/** Middleware for users routes
 * Feel free to define other middleware
 * Middleware should only return error or void
 */
import { H3Event, H3Error } from "h3";
import { getClientPlatform } from "~~/iam/middleware/";

/**
 * @desc Middleware for all user routes
 * @param event
 * @returns
 */
export function usersMiddleware(event: H3Event): H3Error | string {
  return getClientPlatform(event);
}
