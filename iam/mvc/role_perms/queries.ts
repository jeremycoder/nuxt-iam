import { PrismaClient } from "@prisma/client";
import { RolePermission, RolePermissions } from "~~/iam/misc/types";
import { H3Event, H3Error } from "h3";

const prisma = new PrismaClient();
const rowLimit = 100;

/**
 * @desc Gets all role permissions
 * @param event H3Event
 */
export async function getRolePermissions(
  event: H3Event
): Promise<RolePermissions | H3Error> {
  let rolePermissions = [] as RolePermissions;
  let error = null;

  await prisma.role_perms
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

  // Return error or users
  if (error) return error;
  else return rolePermissions;
}

/**
 * @desc Adds a new role permission to the database
 * @param event H3Event
 */
export async function createRolePermission(
  event: H3Event
): Promise<RolePermission | H3Error> {
  const body = await readBody(event);
  let rolePermission = {} as RolePermission;
  let error = null;

  // TODO: Validate role permissions befre reading database

  await prisma.role_perms
    .create({
      data: {
        user_uuid: body.user_uuid,
        is_super_admin: body.is_super_admin,
        is_admin: body.is_admin,
        is_general: body.is_general,
      },
    })
    .then(async (result) => {
      rolePermission = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Return error or users
  if (error) return error;
  else return rolePermission;
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

  await prisma.role_perms
    .findUnique({
      where: {
        id: id,
      },
    })
    .then(async (result) => {
      rolePerm = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) return error;

  // Prisma returns empty object if role permission not found, so check if user has email
  if (rolePerm && "id" in rolePerm === false) {
    return createError({
      statusCode: 404,
      statusMessage: "Role permission not found",
    });
  }

  // Because Prisma can return null for role permission, we have to check for null before returning user
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
  const { fromRoute } = event.context.params;
  let rolePerm = {} as RolePermission;
  let error = null;

  await prisma.role_perms
    .update({
      where: {
        id: fromRoute.id,
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
  if (error) return error;

  return rolePerm;
}

/**
 * @desc Removes role permission from database
 * @param event H3Event
 */
export async function destroyRolePermission(
  event: H3Event
): Promise<H3Error | true> {
  // Get uuid from route
  const { id } = event.context.params.fromRoute;
  let error = null;

  await prisma.users
    .delete({
      where: {
        id: id,
      },
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If we encounter an error, return error
  if (error) return error;

  // Otherwise, delete happened, return true
  return true;
}
