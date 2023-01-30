import authnController from "~~/iam/mvc/authn/controller";

export default defineEventHandler(async (event) => {
  // TODO: Add security helmet

  const response = authnController(event);
  // Get response headers

  const ip = getRequestHeader(event, "x-forwarded-for");
  console.log("ip: ", ip);

  return response;
});
