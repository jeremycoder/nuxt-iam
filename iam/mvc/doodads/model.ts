/* Example doodads model
 * Data manipulation of all doodad requests
 */

import { H3Event } from "h3";
import { JSONResponse } from "~~/iam/misc/types";


/**
 * @desc Shows all doodads
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns doodads or error
 */
export async function index(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;  
  
  const info = "get all doodads"  
  response.status = "success";
  response.data = {
    info,
  };

  return response;
}

/**
 * @desc Creates a new doodad in database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function create(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  
  const info = "create a doodad"  
  response.status = "success";
  response.data = {
    info
  };

  return response;
}

/**
 * @desc Show a particular doodad
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} doodad object or error
 */
export async function show(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  
  const info = "show a doodad"  
  response.status = "success";
  response.data = {
    info
  };

  return response;
}

/**
 * @desc Update particular doodad
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of editing doodad or error
 */
export async function update(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  
  const info = "update a doodad"  
  response.status = "success";
  response.data = {
    info
  };

  return response;
}

/**
 * @desc Delete a particular doodad
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse | H3Error>} Object mentioning success or failure of deleting doodad or error
 */
export async function destroy(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  
  const info = "delete a doodad"  
  response.status = "success";
  response.data = {
    info
  };

  return response;
}
