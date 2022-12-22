import usersController from "~~/mulozi/mvc/users/controller";

export default defineEventHandler(async (event) => {
  return usersController(event);
});
