import usersController from "~~/iam/mvc/users/controller";

export default defineEventHandler(async (event) => {
  // TODO: Add security helmet
  return usersController(event);
});
