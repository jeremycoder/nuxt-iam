/* Users controller
 * Routes all user requests
 */

import { index, create, show, update, destroy } from "./model";
import { createRouter, defineEventHandler, useBase, H3Error } from 'h3';

// TODO: Probably only need getUserFromAccessToken and not getUuidFromAccessToken
// TODO: In server/middleware add user from access token to context, if no user, throw error
// TODO: Move front end authentication to front end middleware like here: 

import { User } from "~~/iam/misc/types";
import {
  isSuperAdmin,
  hasVerifiedEmail,
  isOwner,
  getUserFromAccessToken,
  getUserUuidFromAccessToken,
} from "~~/iam/authz/permissions";
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
  // Permissions: to see all users, user must be superadmin and have their email verified
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

  // Permissions: to see record, user must be either superadmin or be the owner
  if (uuid)
    if (event.context.user.uuid && !isSuperAdmin(event.context.user) && !isOwner(event.context.user.uuid, uuid))
        throw forbiddenError;

  return await show(event) 
}));

// Edit a user
router.put('/:uuid', defineEventHandler(async (event) => { 
  // Check if csrf token is valid
  const csrfTokenError = await validateCsrfToken(event);
  if (csrfTokenError instanceof H3Error) throw csrfTokenError;

  // Get user uuid from request
  if (!event.context.user) throw userNotFoundError  
  const uuid = event.context.params?.uuid      

  // To edit record, user must be either superadmin or be the owner
  if (uuid)
    if (event.context.user.uuid && !isSuperAdmin(event.context.user) && !isOwner(event.context.user.uuid, uuid))
        throw forbiddenError;

  return await update(event) 
}));

// Delete a user
router.delete('/:uuid', defineEventHandler(async (event) => { 
  // Check if csrf token is valid
  const csrfTokenError = await validateCsrfToken(event);
  if (csrfTokenError instanceof H3Error) throw csrfTokenError;

  // Get user uuid from request
  if (!event.context.user) throw userNotFoundError  
  const uuid = event.context.params?.uuid      

  // To delete record, user must be either superadmin or be the owner
  if (uuid)
    if (event.context.user.uuid && !isSuperAdmin(event.context.user) && !isOwner(event.context.user.uuid, uuid))
        throw forbiddenError;

  return await destroy(event) 
}));

export default useBase('/api/iam/users', router.handler);



