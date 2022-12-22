import { H3Event, H3Error } from "h3";
import { registerUser, loginUser, refreshTokens, logoutUser } from "./queries";
import { ApiResult } from "~~/mulozi/misc/types";

/**
 * @desc Registers (creates) a new user in database
 * @param event H3 Event passed from api
 * @returns {Promise<ApiResult | H3Error>} Object mentioning success or failure of registering user or error
 */
export async function register(event: H3Event): Promise<ApiResult | H3Error> {
  const result = await registerUser(event);
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

/**
 * @desc Refresh user's tokens
 * @param event H3 Event passed from api
 * @returns {Promise<ApiResult | H3Error>} Object mentioning success or failure of refreshing user's tokens
 */
export async function refresh(event: H3Event): Promise<ApiResult | H3Error> {
  const result = await refreshTokens(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Log user out
 * @param event H3 Event passed from api
 * @returns {Promise<ApiResult | H3Error>} Object mentioning success or failure of logging user out
 */
export async function logout(event: H3Event): Promise<ApiResult | H3Error> {
  const result = await logoutUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Checks if user is authenticated
 * @param event H3 Event passed from api
 * @returns {Promise<ApiResult | H3Error>} Object mentioning success or failure of logging user out
 */
export async function authenticated(
  event: H3Event
): Promise<ApiResult | H3Error> {
  // const result = await isAuthenticated(event);
  // if (result instanceof H3Error) throw result;
  const result = {} as ApiResult;
  result.success = false;
  result.data = {
    isAuthenticated: false,
  };

  return result;
}
