import { H3Event, H3Error } from "h3";
import {
  getRolePermissions,
  createRolePermission,
  showRolePermission,
  updateRolePermission,
  destroyRolePermission,
} from "./queries";
import {
  JSONResponse,
  RolePermissions,
  RolePermission,
  User,
} from "~~/iam/misc/types";

/**
 * @desc Shows all role permissions
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns success or fail api response
 */
export async function index(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrRolePerms = await getRolePermissions(event);

  // If error, return error
  if (errorOrRolePerms instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrRolePerms;
    return response;
  }

  // Otherwise, return role permissions
  const rolePerms = errorOrRolePerms as RolePermissions;
  response.status = "success";
  response.data = rolePerms;

  return response;
}

/**
 * @desc Creates a new role permission in database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns success or fail api response
 */
export async function create(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrRolePerm = await createRolePermission(event);

  // If error, return error
  if (errorOrRolePerm instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrRolePerm;
    return response;
  }

  // Otherwise, return role permissions
  const rolePerm = errorOrRolePerm as RolePermission;
  response.status = "success";
  response.data = rolePerm;

  return response;
}

/**
 * @desc Show a particular role permission
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns success or fail api response
 */
export async function show(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrRolePerm = await showRolePermission(event);

  // If error, return error
  if (errorOrRolePerm instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrRolePerm;
    return response;
  }

  // Otherwise, return role permission
  const rolePerm = errorOrRolePerm as RolePermission;
  response.status = "success";
  response.data = rolePerm;

  return response;
}

/**
 * @desc Update particular role permission
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns success or fail api response
 */
export async function update(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrRolePerm = await updateRolePermission(event);

  // If error, return error
  if (errorOrRolePerm instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrRolePerm;
    return response;
  }

  // Otherwise, return role
  const role = errorOrRolePerm as RolePermission;
  response.status = "success";
  response.data = role;

  return response;
}

/**
 * @desc Delete a particular role permission
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns success or fail api response
 */
export async function destroy(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrRolePerm = await destroyRolePermission(event);

  // If error, return error
  if (errorOrRolePerm instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrRolePerm;
    return response;
  }

  // Other true will be returned
  response.status = "success";
  return response;
}
