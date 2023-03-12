import authnController from "~~/iam/mvc/authn/controller";

export default defineEventHandler(async (event) => {
  return authnController(event);
});
