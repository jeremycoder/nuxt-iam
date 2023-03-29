import usersController from "~~/iam/mvc/users/controller";

export default defineEventHandler(async (event) => {
  return await usersController(event);
});
