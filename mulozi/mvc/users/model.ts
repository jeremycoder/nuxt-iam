import { H3Event, H3Error } from "h3";
import { getAllUsers, showUser, updateUser, destroyUser } from "./queries";
import { JSONResponse } from "~~/mulozi/misc/types";

/**
 * @desc Shows all users
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse|H3Error>} object returns all users|error
 */
export async function index(event: H3Event): Promise<JSONResponse | H3Error> {
  const result = await getAllUsers(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Creates a new user in database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of storing user or error
 */
export async function create(event: H3Event): Promise<JSONResponse | H3Error> {
  // Return error because all users will be created from /mulozi/authn/register endpoint
  const error = createError({
    statusCode: 422,
    statusMessage:
      "All users must be created from mulozi/authn/register endpoint",
  });

  return error;
}

/**
 * @desc Show a particular user
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} User object or error
 */
export async function show(event: H3Event): Promise<JSONResponse | H3Error> {
  const result = await showUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Update particular user
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of editing user or error
 */
export async function update(event: H3Event): Promise<JSONResponse | H3Error> {
  const result = await updateUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Delete a particular user
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of deleting user or error
 */
export async function destroy(event: H3Event): Promise<JSONResponse | H3Error> {
  const result = await destroyUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}
