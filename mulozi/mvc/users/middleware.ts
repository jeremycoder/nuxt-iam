/** Middleware for users routes
 * Feel free to define other middleware
 * Middleware should only return error or void
 */
import { H3Event, H3Error } from "h3";
import { checkClientPlatform } from "~~/mulozi/middleware/";

/**
 * @desc Middleware for all user routes
 * @param event
 * @returns
 */
export function usersMiddleware(event: H3Event): H3Error | void {
  let error = null;

  // Check if 'client-platform' header is present
  error = checkClientPlatform(event);
  if (error) return error;
}
