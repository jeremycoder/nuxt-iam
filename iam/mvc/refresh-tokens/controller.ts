/* Users controller
 * Routes all user requests
 */

import { index, destroy, destroyAll } from "./model";
import { createRouter, defineEventHandler, useBase, H3Error } from 'h3';
import { canAccessAdmin } from "~~/iam/authz/permissions";
import { validateCsrfToken } from "~~/iam/misc/utils/tokens";

// User not found error
const userNotFoundError = createError({
  statusCode: 401,
  statusMessage: "Unauthorized. User not found.",
});

// Forbidden error
const forbiddenError = createError({
  statusCode: 403,
  statusMessage: "Forbidden",
});

// Missing csrf token error
const csrfTokenError = createError({
  statusCode: 403,
  statusMessage: "Missing or invalid csrf token",
});

const router = createRouter();

// Get all refresh tokens
router.get('/', defineEventHandler(async (event) => {  
  // TODO: Change this to one permission like isAdminAuthorized  
  if (!event.context.user) throw userNotFoundError 
  if (!canAccessAdmin(event.context.user)) throw forbiddenError
  return await index(event) 
}));

// Delete a refresh token
router.delete('/:id', defineEventHandler(async (event) => { 
  // Check if csrf token is valid
  const tokenOrError = await validateCsrfToken(event);
  if (tokenOrError instanceof H3Error) throw csrfTokenError;

  // Get user from context
  if (!event.context.user) throw userNotFoundError
  if (!canAccessAdmin(event.context.user)) throw forbiddenError     

  return await destroy(event) 
}));

// Delete all refresh tokens
router.delete('/', defineEventHandler(async (event) => { 
  // Check if csrf token is valid
  const tokenOrError = await validateCsrfToken(event);
  if (tokenOrError instanceof H3Error) throw csrfTokenError;

  // Get user from context  
  if (!event.context.user) throw userNotFoundError
  if (!canAccessAdmin(event.context.user)) throw forbiddenError     

  return await destroyAll(event) 
}));

export default useBase('/api/iam/refresh-tokens', router.handler);




