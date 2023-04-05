/* Users controller
 * Routes all user requests
 */

import { index, create, show, update, destroy } from "./model";
import { createRouter, defineEventHandler, useBase, H3Error } from 'h3';
import { isSuperAdmin, hasVerifiedEmail, isOwner } from "~~/iam/authz/permissions";
import { validateCsrfToken } from "~~/iam/misc/helpers";

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

// Get all users
router.get('/', defineEventHandler(async (event) => {  
  // Permissions: to see all users, user must be super admin and have their email verified
  // TODO: Change this to one permission like isAdminAuthorized
  if (!event.context.user) throw userNotFoundError
  if (!isSuperAdmin(event.context.user)) throw forbiddenError
  if (!hasVerifiedEmail(event.context.user)) throw forbiddenError
  return await index(event) 
}));

// Create a user
router.post('/', defineEventHandler(async (event) => { 
  return await create(event) 
}));

// Get a single user
router.get('/:uuid', defineEventHandler(async (event) => { 
  // Get user uuid from request
  if (!event.context.user) throw userNotFoundError  
  const uuid = event.context.params?.uuid

  // Permissions: to see record, user must be either super admin or be the owner
  if (uuid)
    if (event.context.user.uuid && !isSuperAdmin(event.context.user) && !isOwner(event.context.user.uuid, uuid))
        throw forbiddenError;

  return await show(event) 
}));

// Edit a user
router.put('/:uuid', defineEventHandler(async (event) => { 
  // Check if csrf token is valid
  const tokenOrError = await validateCsrfToken(event);
  if (tokenOrError instanceof H3Error) throw csrfTokenError;

  // Get user uuid from request
  if (!event.context.user) throw userNotFoundError  
  const uuid = event.context.params?.uuid      

  // To edit record, user must be either super admin or be the owner
  if (uuid)
    if (event.context.user.uuid && !isSuperAdmin(event.context.user) && !isOwner(event.context.user.uuid, uuid))
        throw forbiddenError;

  return await update(event) 
}));

// Delete a user
router.delete('/:uuid', defineEventHandler(async (event) => { 
  // Check if csrf token is valid
  const tokenOrError = await validateCsrfToken(event);
  if (tokenOrError instanceof H3Error) throw csrfTokenError;

  // Get user uuid from request
  if (!event.context.user) throw userNotFoundError  
  const uuid = event.context.params?.uuid      

  // To delete record, user must be either super admin or be the owner
  if (uuid)
    if (event.context.user.uuid && !isSuperAdmin(event.context.user) && !isOwner(event.context.user.uuid, uuid))
        throw forbiddenError;

  return await destroy(event) 
}));

export default useBase('/api/iam/users', router.handler);



