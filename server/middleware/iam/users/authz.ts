// Nuxt IAM Users API Authorization policy
// Add permissions for every request as needed

import { createRouter, H3Error } from "h3";
import { User } from "~~/iam/misc/types";
import {
  isSuperAdmin,
  hasVerifiedEmail,
  isOwner,
  getUserFromAccessToken,
  getUserUuidFromAccessToken,
} from "~~/iam/authz/permissions";
import { validateCsrfToken } from "~~/iam/misc/helpers";


export default defineEventHandler(async (event) => {

  // Forbidden error variables
  const forbiddenError = createError({
    statusCode: 403,
    statusMessage: "Forbidden",
  });

  let showForbiddenError = false;

  // Csrf token error variables
  const csrfTokenError = createError({
    statusCode: 403,
    statusMessage: "Missing or invalid csrf token",
  });

  let showCsrfTokenError = false;
  
  // Missing uuid error variables
  const missingUuidError = createError({
    statusCode: 403,
    statusMessage: "Missing uuid",
  });

  let showMissingUuidError = false; 

  // Get user to prepare for permission checks
  const userOrNull = await getUserFromAccessToken(event);
  if (userOrNull === null) throw forbiddenError;
  const user = userOrNull as User;

  // Get userUuid to prepare for permission checks
  const userUuidOrNull = getUserUuidFromAccessToken(event);
  if (userUuidOrNull === null) throw forbiddenError;
  const userUuid = userUuidOrNull as string;

  const router = createRouter();

  // Get all users
  router.get('/api/iam/users', defineEventHandler(async (event) => { 
    // Permissions
    if (!isSuperAdmin(user)) showForbiddenError = true;
    if (!hasVerifiedEmail(user)) showForbiddenError = true;;
  }));   

  // Get a single user
  router.get('/api/iam/users/:uuid', defineEventHandler(async (event) => {
    const uuid = event.context.params?.uuid    
    if (!uuid) {
      console.log('Missing uuid on route: ' + event.node.req.url)
      showMissingUuidError = true;
    } 
    
    // Permissions
    if (uuid && !isSuperAdmin(user) && !isOwner(userUuid, uuid))
        showForbiddenError = true; 
  }));

  // Edit a user
  router.put('/api/iam/users/:uuid', defineEventHandler(async (event) => { 
    const uuid = event.context.params?.uuid    
    if (!uuid) {
      console.log('Missing uuid on route: ' + event.node.req.url)
      showMissingUuidError = true;
    } 
    
    // Check if csrf token is valid
    const csrfTokenError = await validateCsrfToken(event);

    if (csrfTokenError instanceof H3Error) {
      console.log('Csrf token error on route: ' + event.node.req.url);
      showCsrfTokenError = true;
    }

    // Permissions
    if (uuid && !isSuperAdmin(user) && !isOwner(userUuid, uuid))
      showForbiddenError = true;

  }));

  // Delete a user
  router.delete('/:uuid', defineEventHandler(async (event) => { 
    const uuid = event.context.params?.uuid    
    if (!uuid) {
      console.log('Missing uuid on route: ' + event.node.req.url)
      showMissingUuidError = true;
    } 
    
    // Check if csrf token is valid
    const csrfTokenError = await validateCsrfToken(event);

    if (csrfTokenError instanceof H3Error) {
      console.log('Csrf token error on route: ' + event.node.req.url);
      showCsrfTokenError = true;
    }

    // Permissions
    if (uuid && !isSuperAdmin(user) && !isOwner(userUuid, uuid))
      showForbiddenError = true; 
  }));
    

  // Handle all the routes added. Needs to be at the end of all routes.
  router.handler(event) 

  // If errors, throw errors. Important, if errors are not thrown here, policy will not work
  if (showMissingUuidError) throw missingUuidError;
  if (showForbiddenError) throw forbiddenError;
  if (showCsrfTokenError) throw csrfTokenError;
  
  
})
