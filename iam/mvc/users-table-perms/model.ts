import { H3Event, H3Error } from "h3";
import {
  getRolePermissions,
  createUsersTablePermission,
  showRolePermission,
  updateRolePermission,
  destroyUsersTablePermission,
} from "./queries";
import {
  JSONResponse,
  UsersTablePermissions,
  UsersTablePermission,
} from "~~/iam/misc/types";

/**
 * @desc Shows all permissions
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns success or fail api response
 */
export async function index(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrUsersTablePerms = await getUsersTablePermissions(event);

  // If error, return error
  if (errorOrUsersTablePerms instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrUsersTablePerms;
    return response;
  }

  // Otherwise, return role permissions
  const usersTablePerms = errorOrUsersTablePerms as UsersTablePermissions;
  response.status = "success";
  response.data = usersTablePerms;

  return response;
}

/**
 * @desc Creates a new role permission in database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns success or fail api response
 */
export async function create(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrPerm = await createUsersTablePermission(event);

  // If error, return error
  if (errorOrPerm instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrPerm;
    return response;
  }

  // Otherwise, return role permissions
  const perm = errorOrPerm as UsersTablePermission;
  response.status = "success";
  response.data = perm;

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
  const errorOrRolePerm = await destroyUsersTablePermission(event);

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
