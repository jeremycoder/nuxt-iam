import { PrismaClient } from "@prisma/client";
import { UsersTablePermission, UsersTablePermissions } from "~~/iam/misc/types";
import { validateCreateRolePermission } from "./helpers";
import { H3Event, H3Error } from "h3";

const prisma = new PrismaClient();
const rowLimit = 100;

/**
 * @desc Gets permissions
 * @param event H3Event
 */
export async function getUsersTablePermissions(
  event: H3Event
): Promise<UsersTablePermissions | H3Error> {
  let permissions = [] as UsersTablePermissions;
  let error = null;

  await prisma.users_table_perms
    .findMany({
      take: rowLimit,
    })
    .then(async (result) => {
      permissions = result as UsersTablePermissions;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Return error or permissions
  if (error) return error;
  else return permissions;
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
      permission = result as UsersTablePermission;
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
 * @desc Gets one permission
 * @param event H3Event
 */
export async function showUsersTablePermission(
  event: H3Event
): Promise<UsersTablePermission | H3Error> {
  const { id } = event.context.params.fromRoute;
  let error = null;
  let permission = {} as UsersTablePermission | null;

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
      permission = result as UsersTablePermission;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) return error;

  // Because Prisma can return null for permission, we have to check for null before returning permission
  if (permission === null)
    return createError({
      statusCode: 404,
      statusMessage: "Permission not found",
    });
  else return permission;
}

/**
 * @desc Update a role permission
 * @param event H3Event
 */
export async function updateUsersTablePermission(
  event: H3Event
): Promise<UsersTablePermission | H3Error> {
  // Get parameters
  const body = await readBody(event);
  const { id } = event.context.params.fromRoute;
  let permission = {} as UsersTablePermission;
  let updatedPermission = {} as UsersTablePermission;
  let error = null;

  // Error if no id
  if (!id)
    return createError({
      statusCode: 400,
      statusMessage: "id is required",
    });

  // First get current values
  await prisma.users_table_perms
    .findUnique({
      where: {
        id: parseInt(id),
      },
    })
    .then(async (result) => {
      permission = result as UsersTablePermission;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) return error;

  // Because Prisma can return null for permission, we have to check for null before returning permission
  if (permission === null)
    return createError({
      statusCode: 404,
      statusMessage: "Permission not found",
    });

  // Get current values
  let canCreate = permission.can_create;
  let canRead = permission.can_read;
  let canUpdate = permission.can_update;
  let canDelete = permission.can_delete;
  let expiresAt = permission.expires_at;

  // Update values if values are sent in body
  if ("can_create" in body) canCreate = body.can_create;
  if ("can_read" in body) canRead = body.can_read;
  if ("can_update" in body) canUpdate = body.can_update;
  if ("can_delete" in body) canDelete = body.can_delete;
  if ("expires_at" in body) expiresAt = body.expires_at;

  await prisma.users_table_perms
    .update({
      where: {
        id: parseInt(id),
      },
      data: {
        can_create: canCreate,
        can_read: canRead,
        can_update: canUpdate,
        can_delete: canDelete,
        expires_at: expiresAt,
        updated_at: new Date(),
      },
    })
    .then(async (response) => {
      updatedPermission = response as UsersTablePermission;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) {
    console.log("Error updating permission");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  return updatedPermission;
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
