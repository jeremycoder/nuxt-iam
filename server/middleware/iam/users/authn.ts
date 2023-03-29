// Nuxt IAM Authentication policy
// Inspect every request url for users url and check is user is authenticated

import { isAuthenticated } from "~~/iam/mvc/authn/queries";
import { H3Error } from "h3";

const forbiddenError = createError({
  statusCode: 403,
  statusMessage: "Forbidden",
});

export default defineEventHandler(async (event) => {

  if ((event.node.req.url)?.includes('/api/iam/users')) {
   
    const authenticated = await isAuthenticated(event);

    if (authenticated instanceof H3Error) 
      throw forbiddenError  

    if (authenticated === false) 
      throw forbiddenError
  }  
  
})
