import refreshTokensController from "~~/iam/mvc/refresh-tokens/controller";

export default defineEventHandler(async (event) => {
  // TODO: Add security helmet
  return refreshTokensController(event);
});
