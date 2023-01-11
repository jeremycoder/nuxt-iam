import { PrismaClient } from "@prisma/client";
import { UsersTablePermission, UsersTablePermissions } from "~~/iam/misc/types";
import { validateCreateRolePermission } from "./helpers";
import { H3Event, H3Error } from "h3";

const prisma = new PrismaClient();
const rowLimit = 100;

/**
 * @desc Gets all role permissions
 * @param event H3Event
 */
export async function getUsersTablePermissions(
  event: H3Event
): Promise<RolePermissions | H3Error> {
  let rolePermissions = [] as RolePermissions;
  let error = null;

  await prisma.users_table_perms
    .findMany({
      take: rowLimit,
    })
    .then(async (result) => {
      rolePermissions = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Return error or role permissions
  if (error) return error;
  else return rolePermissions;
}

/**
 * @desc Adds a new permission to the database
 * @param event H3Event
 */
export async function createUsersTablePermission(
  event: H3Event
): Promise<UsersTablePermission | H3Error> {
  const body = await readBody(event);
  let permission = undefined as UsersTablePermission | undefined;
  let error = null;

  // If no user_id, return error
  const user_id = parseInt(body.user_id);
  if (!user_id)
    return createError({
      statusCode: 400,
      statusMessage: "user_id is required",
    });

  await prisma.users_table_perms
    .create({
      data: {
        user_id: user_id,
        can_create: body.can_create,
        can_read: body.can_read,
        can_update: body.can_update,
        can_delete: body.can_delete,
        expires_at: body.expires_at,
      },
    })
    .then(async (result) => {
      permission = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Return error or permission
  if (error) {
    console.log("Error creating permission");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  if (permission) return permission;

  console.log("Failed to create permission");
  return createError({ statusCode: 500, statusMessage: "Server error" });
}

/**
 * @desc Gets one role permission
 * @param event H3Event
 */
export async function showRolePermission(
  event: H3Event
): Promise<RolePermission | H3Error> {
  const { id } = event.context.params.fromRoute;
  let error = null;
  let rolePerm = {} as RolePermission | null;

  // Error if not id
  if (!id)
    return createError({
      statusCode: 400,
      statusMessage: "id is required",
    });

  await prisma.users_table_perms
    .findUnique({
      where: {
        id: parseInt(id),
      },
    })
    .then(async (result) => {
      if (result) rolePerm = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) return error;

  // Because Prisma can return null for role permission, we have to check for null before returning role permission
  if (rolePerm === null)
    return createError({
      statusCode: 404,
      statusMessage: "Role permission not found",
    });
  else return rolePerm;
}

/**
 * @desc Update a role permission
 * @param event H3Event
 */
export async function updateRolePermission(
  event: H3Event
): Promise<RolePermission | H3Error> {
  // Get parameters
  const body = await readBody(event);
  const { id } = event.context.params.fromRoute;
  let rolePerm = {} as RolePermission;
  let error = null;

  // Error if no id
  if (!id)
    return createError({
      statusCode: 400,
      statusMessage: "id is required",
    });

  await prisma.users_table_perms
    .update({
      where: {
        id: parseInt(id),
      },
      data: {
        is_super_admin: body.is_super_admin,
        is_admin: body.is_admin,
        is_general: body.is_general,
        updated_at: new Date(),
      },
    })
    .then(async (response) => {
      rolePerm = response;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) {
    console.log("Error updating role permission");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  return rolePerm;
}

/**
 * @desc Removes role permission from database
 * @param event H3Event
 */
export async function destroyUsersTablePermission(
  event: H3Event
): Promise<H3Error | true> {
  // Get uuid from route
  const { id } = event.context.params.fromRoute;
  let error = null;
  let rolePerm = null;

  console.log("DELETE ID: ", id);

  // Error if not id
  if (!id)
    return createError({
      statusCode: 400,
      statusMessage: "id is required",
    });

  await prisma.users_table_perms
    .delete({
      where: {
        id: parseInt(id),
      },
    })
    .then(async (result) => {
      rolePerm = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If we encounter an error, return error

  if (error) {
    console.log("ERROR: ", error);
    console.log("Error deleting users table permission");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  if (rolePerm) {
    console.log("ROLE PERM: ", rolePerm);
    // console.log("Some error deleting role permission");
    // return createError({
    //   statusCode: 500,
    //   statusMessage: "Server error",
    // });
  }

  // Otherwise, delete happened, return true
  return true;
}
