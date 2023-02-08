import authnController from "~~/iam/mvc/authn/controller";

export default defineEventHandler(async (event) => {
  const response = authnController(event);
  return response;
});
