/* Example doodads controller
 * Routes all doodad requests
 */

// Definitely much cleaner and neater

import { index, create, show, update, destroy } from "./model";
import { createRouter, defineEventHandler, useBase } from 'h3';

const router = createRouter();

// Routes /api/iam/doodads

// Get all doodads
router.get('/', defineEventHandler(async (event) => { 
  return await index(event) 
}));

// Create a doodad
router.post('/', defineEventHandler(async (event) => { 
  return await create(event) 
}));

// Get a single doodad
router.get('/:id', defineEventHandler(async (event) => { 
  return await show(event) 
}));

// Edit a doodad
router.put('/:id', defineEventHandler(async (event) => { 
  return await update(event) 
}));

// Delete a doodad
router.delete('/:id', defineEventHandler(async (event) => { 
  return await destroy(event) 
}));

// Example complex route
router.get('/:id/abc/:author-id', defineEventHandler((event) => { 
  const headers = getHeaders(event);
  return {
    params: event.context.params,
    headers: headers,
  }
}));

export default useBase('/api/iam/doodads', router.handler);
