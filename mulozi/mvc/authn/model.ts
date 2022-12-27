import { H3Event, H3Error } from "h3";
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  isAuthenticated,
} from "./queries";
import { JSONResponse, JSONResponseStatus } from "~~/mulozi/misc/types";

/**
 * @desc Registers (creates) a new user in database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of registering user or error
 */
export async function register(
  event: H3Event
): Promise<JSONResponse | H3Error> {
  const result = await registerUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Authenticate user into database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of authenticating user or error
 */
export async function login(event: H3Event): Promise<JSONResponse | H3Error> {
  const result = await loginUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Refresh user's tokens
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of refreshing user's tokens
 */
export async function refresh(event: H3Event): Promise<JSONResponse | H3Error> {
  const result = await refreshTokens(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Log user out
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of logging user out
 */
export async function logout(event: H3Event): Promise<JSONResponse | H3Error> {
  const result = await logoutUser(event);
  if (result instanceof H3Error) throw result;

  return result;
}

/**
 * @desc Checks if user is authenticated
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function isauthenticated(event: H3Event): Promise<JSONResponse> {
  const authenticated = await isAuthenticated(event);
  const response = {} as JSONResponse;

  if (authenticated instanceof H3Error) {
    response.status = JSONResponseStatus.FAIL;
    response.data = { isAuthenticated: false };
    response.error = authenticated;
  }

  if (authenticated === false) {
    response.status = JSONResponseStatus.FAIL;
    response.data = { isAuthenticated: authenticated };
  }

  if (authenticated === true) {
    response.status = JSONResponseStatus.SUCCESS;
    response.data = { isAuthenticated: authenticated };
  }

  return response;
}
