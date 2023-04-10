import { H3Event, H3Error } from "h3";
import { getAllUsers, showUser, updateUser, destroyUser } from "./queries";
import { JSONResponse, User, Session } from "~~/iam/misc/types";
import { getUserSession } from "~~/iam/misc/utils/sessions";
import { hasPermission } from "~~/iam/authz/permissions";

/**
 * @desc Shows all users
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function index(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrUsers = await getAllUsers(event);
  let sessionOrError = {} as Session | H3Error;

  // If error, return error
  if (errorOrUsers instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrUsers;
    return response;
  }

  // Get csrf token from using session id token
  const sessionId = getCookie(event, "iam-sid");
  if (sessionId) sessionOrError = await getUserSession(sessionId);

  // If error, return error
  if (sessionOrError instanceof H3Error) {
    console.log("Error getting user session");
    response.status = "fail";
    response.error = response.error = createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // Otherwise get session and csrf token
  const session = sessionOrError as Session;

  // Otherwise, return users, and add token
  const users = errorOrUsers as Array<User>;
  response.status = "success";
  response.data = {
    users,
    csrf_token: session.csrf_token,
  };

  return response;
}

/**
 * @desc Creates a new user in database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function create(event: H3Event): Promise<JSONResponse> {
  // Return error because all users will be created from /authn/register endpoint
  const response = {} as JSONResponse;
  response.status = "fail";
  response.error = createError({
    statusCode: 422,
    statusMessage: "All users must be created from authn/register endpoint",
  });

  return response;
}

/**
 * @desc Show a particular user
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} 
 */
export async function show(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrUser = await showUser(event);

  // If error, return error
  if (errorOrUser instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrUser;
    return response;
  }

  // Otherwise, return user
  const user = errorOrUser as User;
  response.status = "success";
  response.data = user;

  return response;
}

/**
 * @desc Check if a user has a permission
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function permission(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;

  // Get user and permission
  const user = event.context.user as User
  const permission = event.context.params?.permission  

  // If no user, return error
  if (!user) {
    console.log('Failed to get user for permission check.')
    response.status = "fail"
    response.error = createError({
      statusCode: 401,
      statusMessage: "Failed to get user.",
    });
    return response
  }

  // If no permission given, return error
  if (!permission) {
    console.log('No permission given to check if user has permission')
    response.status = "fail"
    response.error = createError({
      statusCode: 400,
      statusMessage: "No permission given",
    });
    return response
  } 

  const userHasPermission = hasPermission(user, permission);

  // If no user, return error
  if (!userHasPermission) {
    console.log(`User: ${user.uuid} does NOT have permission: ${permission}`);
    response.status = "fail"
    response.error = createError({
      statusCode: 401,
      statusMessage: `User: ${user.uuid} does NOT have permission: ${permission}`,
    });
    return response
  } else {
    response.status = "success"
    response.data = `User: ${user.uuid} has permission: ${permission}`
    return response
  } 
}

/**
 * @desc Update particular user
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>}
 */
export async function update(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrUser = await updateUser(event);

  // If error, return error
  if (errorOrUser instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrUser;
    return response;
  }

  // Otherwise, return user
  const user = errorOrUser as User;
  response.status = "success";
  response.data = user;

  return response;
}

/**
 * @desc Delete a particular user
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} 
 */
export async function destroy(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrBoolean = await destroyUser(event);
  
  // If error, return error
  if (errorOrBoolean instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrBoolean;
    return response;
  }

  // If false is returned, which shouldn't happen
  if (errorOrBoolean === false) {
    response.status = "fail";
    return response;
  }
  // Otherwise user successfully deleted
  else {
    response.status = "success";
    return response;
  }
}
