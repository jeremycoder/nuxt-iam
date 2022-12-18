import { H3Event, H3Error } from "h3";
import {
  getAllUsers,
  registerUser,
  showUser,
  updateUser,
  destroyUser,
  loginUser,
} from "./queries";
import { ApiResult } from "./types";

/**
 * @desc Shows all users
 * @param event H3 Event passed from api
 * @returns {Promise<ApiResult|H3Error>} object returns all users|error
 */
export async function index(event: H3Event): Promise<ApiResult | H3Error> {
  const result = await getAllUsers(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Registers (creates) a new user in database
 * @param event H3 Event passed from api
 * @returns {Promise<ApiResult | H3Error>} Object mentioning success or failure of storing user or error
 */
export async function register(event: H3Event): Promise<ApiResult | H3Error> {
  const result = await registerUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Show a particular user
 * @param event H3 Event passed from api
 * @returns {Promise<ApiResult | H3Error>} User object or error
 */
export async function show(event: H3Event): Promise<ApiResult | H3Error> {
  const result = await showUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Update particular user
 * @param event H3 Event passed from api
 * @returns {Promise<ApiResult | H3Error>} Object mentioning success or failure of editing user or error
 */
export async function update(event: H3Event): Promise<ApiResult | H3Error> {
  const result = await updateUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Delete a particular user
 * @param event H3 Event passed from api
 * @returns {Promise<ApiResult | H3Error>} Object mentioning success or failure of deleting user or error
 */
export async function destroy(event: H3Event): Promise<ApiResult | H3Error> {
  const result = await destroyUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Authenticate user into database
 * @param event H3 Event passed from api
 * @returns {Promise<ApiResult | H3Error>} Object mentioning success or failure of authenticating user or error
 */
export async function login(event: H3Event): Promise<ApiResult | H3Error> {
  const result = await loginUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}
