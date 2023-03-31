// Add user from request to context
import { getUserFromAccessToken, } from "~~/iam/authz/permissions";

export default defineEventHandler(async (event) => {       
    const userOrNull = await getUserFromAccessToken(event);
    event.context.user = userOrNull
})