import { H3Event, H3Error } from "h3";
import { getAllUsers, showUser, updateUser, destroyUser } from "./queries";
import { JSONResponse, User } from "~~/iam/misc/types";

/**
 * @desc Shows all users
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns users or error
 */
export async function index(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrUsers = await getAllUsers(event);

  // If error, return error
  if (errorOrUsers instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrUsers;
    return response;
  }

  // Otherwise, return users
  const users = errorOrUsers as Array<User>;
  response.status = "success";
  response.data = users;

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
 * @returns {Promise<JSONResponse>} User object or error
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
 * @desc Update particular user
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of editing user or error
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
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of deleting user or error
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
