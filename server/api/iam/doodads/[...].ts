/** This is an example endpoint and can be deleted.
 * If you delete it, also delete ~~iam/mvc/doodads directory
 */

import doodadsController from "~~/iam/mvc/doodads/controller";

export default defineEventHandler(async (event) => {
  return doodadsController(event);
});
