import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import {
  validateRegisterBody,
  validateEmail,
  emailExists,
  validatePassword,
  createUser,
  userExists,
  validateUserRegistration,
} from "~~/mulozi/helpers";

const prisma = new PrismaClient();

// Add limits to how many rows are returned
const rowLimit = 100;

/**
 * @desc Shows all users
 * @param event H3 Event passed from api
 * @returns {Promise<Object|null>} object returns all users|error
 */
export async function index(event: H3Event): Promise<Object | null> {
  let users = null;

  await prisma.user
    .findMany({
      take: rowLimit,
    })
    .then(async (result) => {
      users = result;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  return users;
}

/**
 * @desc Shows form to create new user (not available in api)
 * @param event H3 Event passed from api
 * @returns {Promise<void>}
 */
export async function create(event: H3Event): Promise<void> {
  return event.context.params;
}

/**
 * @desc Store a particular user in database
 * @param event H3 Event passed from api
 * @returns {Promise<Object>} Object mentioning success or failure of storing user or error
 */
export async function store(event: H3Event): Promise<Object> {
  const error = await validateUserRegistration(event);
  if (error) throw error;

  const body = await readBody(event);
  const user = await createUser(body);

  return user;
}

/**
 * @desc Show a particular user
 * @param event H3 Event passed from api
 * @returns {Promise<Object|null>} User object or error
 */
export async function show(event: H3Event): Promise<Object | null> {
  const { uuid } = event.context.params.fromRoute;

  let user = {};
  await prisma.user
    .findUnique({
      where: {
        uuid: uuid,
      },
    })
    .then(async (result) => {
      if (result) user = result;

      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  return user;
}

/**
 * @desc Shows form to edit new user (not available in api)
 * @param event H3 Event passed from api
 * @returns {Promise<void>}
 */
export async function edit(event: H3Event): Promise<void> {
  return event.context.params;
}

/**
 * @desc Update particular user
 * @param event H3 Event passed from api
 * @returns {Promise<JSON>} Object mentioning success or failure of editing user or error
 */
export async function update(event: H3Event): Promise<JSON> {
  return event.context.params;
}

/**
 * @desc Delete a particular user
 * @param event H3 Event passed from api
 * @returns {Promise<Object>} Object mentioning success or failure of deleting user or error
 */
export async function destroy(event: H3Event): Promise<Object> {
  const { uuid } = event.context.params.fromRoute;

  if (!(await userExists(uuid)))
    throw createError({
      statusCode: 400,
      statusMessage: "User not found",
    });

  let user = {};
  await prisma.user
    .delete({
      where: {
        uuid: uuid,
      },
    })
    .then(async (result) => {
      if (result) user = result;

      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  return user;
}
