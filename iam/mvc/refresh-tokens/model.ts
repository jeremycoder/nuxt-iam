import { H3Event, H3Error } from "h3";
import {
  getAllRefreshTokens,
  destroyRefreshToken,
  destroyRefreshTokens,
} from "./queries";
import { JSONResponse, RefreshTokens } from "~~/iam/misc/types";

/**
 * @desc Gets all refresh tokens
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns success or failure
 */
export async function index(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrTokens = await getAllRefreshTokens(event);

  // If error, return error
  if (errorOrTokens instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrTokens;
    return response;
  }

  // Otherwise, return tokens
  const tokens = errorOrTokens as RefreshTokens;
  response.status = "success";
  response.data = tokens;

  return response;
}

/**
 * @desc Delete a particular refresh token
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns success of failure
 */
export async function destroy(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrBoolean = await destroyRefreshToken(event);

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
  // Otherwise token successfully deleted
  else {
    response.status = "success";
    return response;
  }
}

/**
 * @desc Delete allrefresh token
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns success of failure
 */
export async function destroyAll(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrBoolean = await destroyRefreshTokens(event);

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
  // Otherwise token successfully deleted
  else {
    response.status = "success";
    return response;
  }
}
