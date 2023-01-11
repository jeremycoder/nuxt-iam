import { PrismaClient } from "@prisma/client";
import { H3Event, H3Error } from "h3";
import { RolePermission, RolePermissions } from "~~/iam/misc/types";

const prisma = new PrismaClient();

/**
 * @desc Suite of checks before creating a role permission
 * @param event Event from Api
 */
export async function validateCreateRolePermission(
  event: H3Event
): Promise<H3Error | void> {
  const body = await readBody(event);

  // If no body, return error
  if (!body)
    return createError({
      statusCode: 400,
      statusMessage: "body object is required",
    });

  // If not user_uuid, return error
  if (!body.user_id) {
    console.log();
    return createError({
      statusCode: 400,
      statusMessage: "user_id is required",
    });
  }

  // check if fole permission exists
  const errorOrRolePerm = await getRolePermByUserUuid(body.user_id);

  // If error found
  if (errorOrRolePerm instanceof H3Error) return errorOrRolePerm;

  // If record is not null, record exists
  if (errorOrRolePerm !== null)
    return createError({
      statusCode: 409,
      statusMessage: "user record already exists",
    });
}

/**
 * @desc Gets role permission given user uuid
 * @param event H3Event
 */
export async function getRolePermByUserUuid(
  user_id: number
): Promise<RolePermission | H3Error | null> {
  let error = null;
  let rolePerm = null as RolePermission | null;

  if (!user_id)
    return createError({
      statusCode: 400,
      statusMessage: "user_id is required",
    });

  await prisma.users_table_perms
    .findFirst({
      where: {
        id: user_id,
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
  if (error) {
    console.log("Error getting role permission");
    return createError({
      statusCode: 400,
      statusMessage: "Error getting role permission",
    });
  }

  // If we have role permission, return it
  if (rolePerm) return rolePerm;

  // Most likely record not found
  return null;
}

/**
 * @desc Suite of checks before updating role permission
 * @param event Event from Api
 */
export async function validateUpdateRolePermission(
  event: H3Event
): Promise<H3Error | void> {
  const { fromRoute } = event.context.params;
  const body = await readBody(event);

  // If no id given
  if (!fromRoute.id)
    return createError({
      statusCode: 400,
      statusMessage: "role permission id not supplied",
    });
}
