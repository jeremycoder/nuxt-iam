import usersController from "~~/mvc/users/controller";

export default defineEventHandler(async (event) => {
  return usersController(event);
});
