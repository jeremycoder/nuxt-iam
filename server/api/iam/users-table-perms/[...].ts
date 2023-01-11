import usersTablePermsController from "~~/iam/mvc/users-table-perms/controller";

export default defineEventHandler(async (event) => {
  // TODO: Add security helmet
  return usersTablePermsController(event);
});
