/* Users controller
 * Routes all user requests
 */

import { index, create, show, update, destroy } from "./model";
import { createRouter, defineEventHandler, useBase } from 'h3';

const router = createRouter();

// Get all users
router.get('/', defineEventHandler(async (event) => { 
  return await index(event) 
}));

// Create a user
router.post('/', defineEventHandler(async (event) => { 
  return await create(event) 
}));

// Get a single user
router.get('/:uuid', defineEventHandler(async (event) => { 
  return await show(event) 
}));

// Edit a user
router.put('/:uuid', defineEventHandler(async (event) => { 
  return await update(event) 
}));

// Delete a user
router.delete('/:uuid', defineEventHandler(async (event) => { 
  return await destroy(event) 
}));

export default useBase('/api/iam/users', router.handler);



