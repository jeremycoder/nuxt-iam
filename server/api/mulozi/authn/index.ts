import authnController from "~~/mulozi/mvc/authn/controller";

export default defineEventHandler(async (event) => {
  return authnController(event);
});
