import usersController from "../../../controllers/users";

export default defineEventHandler(async (event) => {
  return usersController(event);
});
