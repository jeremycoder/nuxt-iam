import authnController from "~~/iam/mvc/authn/controller";

export default defineEventHandler(async (event) => {
  // TODO: Add security helmet
  const response = authnController(event);
  return response;
});
