import refreshTokensController from "~~/iam/mvc/refresh-tokens/controller";

export default defineEventHandler(async (event) => {
  return refreshTokensController(event);
});
