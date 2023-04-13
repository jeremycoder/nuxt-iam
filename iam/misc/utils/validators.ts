// Validator helper functions
import { PrismaClient } from "@prisma/client";
import { H3Event, H3Error } from "h3";
import { getUserByEmail, getUserByUuid } from "./../utils/users";
import { verifyPassword } from "../utils/passwords";

const prisma = new PrismaClient();

/**
 * @desc Suite of checks to validate user before registration
 * @param event Event from Api
 * @info returns NuxtError HTTP status code if comething is wrong
 */
export async function validateUserRegistration(
  event: H3Event
): Promise<H3Error | void> {
  const body = await readBody(event);

  // Check if body contains first_name, last_name, email, and password
  const bodyError = await validateRegisterBody(event);
  if (bodyError) {
    return createError({ statusCode: 400, statusMessage: bodyError });
  }

  // Check email is in a valid format
  if (!validateEmail(body.email)) {
    return createError({ statusCode: 400, statusMessage: "Bad email format" });
  }

  // If a user with that email already exists, return error
  const user = await getUserByEmail(body.email);
  if (user)
    return createError({
      statusCode: 409,
      statusMessage: "Email already exists",
    });

  // Check password meets minimum strength requirements
  if (!validatePassword(body.password)) {
    return createError({
      statusCode: 400,
      statusMessage: `Poor password strength. Password must contain at least 8 characters, an upper-case letter, and a lower-case letter, 
        a number, and a non-alphanumeric character.`,
    });
  }
}

/**
 * @desc Suite of checks to validate data before updating user
 * @param event Event from Api 
 */
export async function validateUserUpdate(
  event: H3Event
): Promise<H3Error | void> {
  const uuid = event.context.params?.uuid;
  const body = await readBody(event);

  // If no uuid given
  if (!uuid)
    return createError({
      statusCode: 400,
      statusMessage: "Uuid not supplied",
    });

  // If uuid exists, but user does not exist
  if (!(await userExists(uuid)))
    return createError({
      statusCode: 400,
      statusMessage: "User not found",
    });

  // If no updatable properties supplied
  if (
    "first_name" in body === false &&
    "last_name" in body === false &&
    "role" in body === false &&
    "permissions" in body === false
  )
    return createError({
      statusCode: 400,
      statusMessage: "No updatable properties supplied",
    });

  // If first_name empty
  if ("first_name" in body && !body.first_name)
    return createError({
      statusCode: 400,
      statusMessage: "first_name must have data",
    });

  // If last_name empty
  if ("last_name" in body && !body.last_name)
    return createError({
      statusCode: 400,
      statusMessage: "last_name must have data",
    });

  // If role empty
  if ("role" in body && !body.role)
    return createError({
      statusCode: 400,
      statusMessage: "role must have data",
    });
}

/**
 * @desc Suite of checks to validate data before updating user profile
 * @param event Event from Api
 */
export async function validateUserProfileUpdate(
  event: H3Event
): Promise<H3Error | void> {
  const body = await readBody(event);

  // If uuid not provided
  if (!body.uuid)
    return createError({
      statusCode: 400,
      statusMessage: "User uuid not provided",
    });

  // If nothing supplied can be updated
  if (
    "first_name" in body === false &&
    "last_name" in body === false &&
    "current_password" in body === false &&
    "new_password" in body === false
  )
    return createError({
      statusCode: 400,
      statusMessage: "No updatable properties supplied",
    });

  const user = await getUserByUuid(body.uuid);
  // This error really shouldn't happen
  if (!user)
    return createError({
      statusCode: 400,
      statusMessage: "User not found",
    });

  // If first name is supplied, but has no value
  if ("first_name" in body === true && body.first_name.trim() === "")
    return createError({
      statusCode: 400,
      statusMessage: "first_name must have a value",
    });

  // If last name is supplied, but has no value
  if ("last_name" in body === true && body.last_name.trim() === "")
    return createError({
      statusCode: 400,
      statusMessage: "last_name must have a value",
    });

  // If either current password or new password is supplied, but not the other one
  if ("new_password" in body === true && "current_password" in body === false)
    return createError({
      statusCode: 400,
      statusMessage: "Both current_password and new_password must be supplied",
    });

  if ("new_password" in body === false && "current_password" in body === true)
    return createError({
      statusCode: 400,
      statusMessage: "Both current_password and new_password must be supplied",
    });

  // If supplied current password does not match password in database
  if ("current_password" in body)
    if (!(await verifyPassword(user.password, body.current_password)))
      return createError({
        statusCode: 400,
        statusMessage: "Wrong current password",
      });

  // If new password is supplied, but fails password strength policy
  if ("new_password" in body === true && !validatePassword(body.new_password))
    return createError({
      statusCode: 400,
      statusMessage: `Poor new password strength. Password must contain at least 8 characters, an upper-case letter, and a lower-case letter, 
      a number, and a non-alphanumeric character.`,
    });
}

/**
 * @desc Suite of checks to validate data before deleting user
 * @param event Event from Api 
 */
export async function validateUserDelete(
  event: H3Event
): Promise<H3Error | void> {
  const uuid = event.context.params?.uuid;
  
  if (!uuid)
    return createError({
      statusCode: 400,
      statusMessage: "Uuid not supplied",
    });

  // If uuid exists, but user does not exist
  if (!(await userExists(uuid)))
    return createError({
      statusCode: 400,
      statusMessage: "User not found",
    });
}

/**
 * @desc Suite of checks to validate data before logging user in
 * @param event Event from Api
 */
export async function validateUserLogin(
  event: H3Event
): Promise<H3Error | void> {
  const body = await readBody(event);

  // Check if body contains email, and password
  const bodyError = validateLoginBody(body);
  if (bodyError) {
    return createError({ statusCode: 400, statusMessage: bodyError });
  }

  // Check email is in a valid format
  if (!validateEmail(body.email)) {
    return createError({ statusCode: 400, statusMessage: "Bad email format" });
  }
}

/**
 * @desc Checks whether the body in register post request is in correct format
 * @param body Body object passed in register post request
 */
export async function validateRegisterBody(event: H3Event) {
  const body = await readBody(event);
  console.log('BODY: ', body);
  if ("first_name" in body === false || body.first_name.trim() === "") {
    return "'first_name' is required";
  }

  if ("last_name" in body === false || body.last_name.trim() == "") {
    return "'last_name' is required";
  }

  if ("email" in body === false) {
    return "'email' is required";
  }

  if ("password" in body === false) {
    return "'password' is required";
  }
}

/**
 * @desc Checks whether the body in login post request is in correct format
 * @param body Body object passed in login post request
 */
export function validateLoginBody(body: Object) {
  if ("email" in body === false) {
    return "'email' is required";
  }

  if ("password" in body === false) {
    return "'password' is required";
  }
}

/**
 * @desc Checks whether email is valid
 * @param email The email string
 */
export function validateEmail(email: string): boolean {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }

  return false;
}

/**
 * @desc Checks whether email already exists in database
 * @param email The email string
 */
export async function emailExists(email: string): Promise<boolean | H3Error> {
  if (!email) return false;
  let error = null;

  let user = undefined;
  await prisma.users
    .findFirst({
      where: {
        email: email,
      },
    })
    .then(async (result) => {
      user = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) {
    console.log("Email error when checking if email exists");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // if user does not exist, return false
  if (user === null) {
    console.log("User not found");
    return false;
  }

  // Otherwise user exists, return true
  return true;
}

/**
 * @desc Checks whether user exists in database using uuid
 * @param uuid User's uuid
 * @return { Promise<boolean> }
 */
export async function userExists(uuid: string): Promise<boolean> {
  if (!uuid) return false;

  let user = undefined;

  await prisma.users
    .findFirst({
      where: {
        uuid: uuid,
      },
    })
    .then(async (result) => {
      user = result;
    })
    .catch(async (e) => {
      console.error(e);
    });

  if (user === null) return false;

  return true;
}

/**
 * @desc Checks whether password matches a certain strength
 * @param password User's password
 * @return { <boolean> }
 */
export function validatePassword(password: string): boolean {
  // Has at least 8 characters
  if (password.length < 8) return false;

  // Has uppercase letters
  if (!/[A-Z]/.test(password)) return false;

  // Has lowercase letters
  if (!/[a-z]/.test(password)) return false;

  // Has numbers
  if (!/\d/.test(password)) return false;

  // Has non-alphanumeric characters
  if (!/\W/.test(password)) return false;

  return true;
}

