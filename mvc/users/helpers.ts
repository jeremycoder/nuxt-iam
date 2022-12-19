// TODO: Please separate helpers for user model and helpers for Mulozi Auth. Remember,, Mulozi is for auth only

// Helper functions for
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { RegisteredUser, Tokens } from "./types";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { H3Event, H3Error } from "h3";
import { randomBytes } from "crypto";

const config = useRuntimeConfig();
const prisma = new PrismaClient();

/**
 * @desc Hashes a password or any string using Argon 2
 * @param password Unhashed password
 */
export async function hashPassword(
  password: string
): Promise<string | H3Error> {
  try {
    return await argon2.hash(password);
  } catch (err) {
    return createError({ statusCode: 500, statusMessage: "Password error" });
  }
}

/**
 * @desc Makes a uuid
 */
export function makeUuid(): string {
  return uuidv4();
}

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
  const bodyError = validateRegisterBody(body);
  if (bodyError) {
    return createError({ statusCode: 400, statusMessage: bodyError });
  }

  // Check email is in a valid format
  if (!validateEmail(body.email)) {
    return createError({ statusCode: 400, statusMessage: "Bad email format" });
  }

  // Check if email exists
  if (await emailExists(body.email)) {
    return createError({
      statusCode: 403,
      statusMessage: "Email already exists",
    });
  }

  // Check password meets minimum strength requirements
  if (!validatePassword(body.password)) {
    return createError({
      statusCode: 400,
      statusMessage:
        "Poor password strength. Password must contain at least 8 characters, an upper-case letter, and a lower-case letter, a number, and a non-alphanumeric character.",
    });
  }
}

/**
 * @desc Suite of checks to validate data before updating user
 * @param event Event from Api
 * @info Expects fromRoute object in event.context.params
 */
export async function validateUserUpdate(
  event: H3Event
): Promise<H3Error | void> {
  const { fromRoute } = event.context.params;
  const body = await readBody(event);

  // If fromRoute object not found
  if (!fromRoute)
    return createError({
      statusCode: 400,
      statusMessage: "fromRoute expected",
    });

  // If no uuid given
  if (!fromRoute.uuid)
    return createError({
      statusCode: 400,
      statusMessage: "Uuid not supplied",
    });

  // If uuid exists, but user does not exist
  if (!(await userExists(fromRoute.uuid)))
    return createError({
      statusCode: 400,
      statusMessage: "User not found",
    });

  // If first name and last name do not exist in body
  if ("first_name" in body === false && "last_name" in body === false)
    return createError({
      statusCode: 400,
      statusMessage: "No updatable properties supplied",
    });

  // If first_name empty
  if (!body.first_name)
    return createError({
      statusCode: 400,
      statusMessage: "first_name must have data",
    });

  // If last_name empty
  if (!body.last_name)
    return createError({
      statusCode: 400,
      statusMessage: "last_name must have data",
    });
}

/**
 * @desc Suite of checks to validate data before deleting user
 * @param event Event from Api
 * @info Expects fromRoute object in event.context.params
 */
export async function validateUserDelete(
  event: H3Event
): Promise<H3Error | void> {
  const { uuid } = event.context.params.fromRoute;
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
 * @desc Suite of checks to validate data before issuing refresh token
 * @param event Event from Api
 */
export async function getRefreshTokens(
  event: H3Event
): Promise<H3Error | Tokens> {
  const authHeader = event.node.req.headers.authorization;

  // Check for authorization header
  if (!authHeader) {
    console.log("Missing authorization header");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Get Bearer token
  const bearerToken = authHeader.split(" ");

  // Check for word "Bearer"
  if (bearerToken[0] !== "Bearer") {
    console.log("Missing word 'Bearer' in token");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Check for token
  if (!bearerToken[1]) {
    console.log("Missing token");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Get user from token
  const user = verifyRefreshToken(bearerToken[1]);

  // Check if user was retrieved from token
  if (user === null) {
    console.log("Failed to retrieve user from token");
    return createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  // Check if user has email attribute
  if (!user.email)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });

  // Check if user exists in the database
  const userInDb = await getUser(user.email);

  // TODO: Must also check if user is ACTIVE

  if (userInDb === null) {
    console.log("User not found in database");
    return createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  // Get new access and refresh tokens
  const errorOrTokens = createNewTokensFromRefresh(bearerToken[1]);
  if (errorOrTokens instanceof H3Error) return errorOrTokens;

  const tokens = errorOrTokens as Tokens;
  return tokens;
}

/**
 * @desc Checks whether the body in register post request is in correct format
 * @param body Body object passed in register post request
 */
export function validateRegisterBody(body: Object) {
  if ("first_name" in body === false) {
    return "'first_name' is required";
  }

  if ("last_name" in body === false) {
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
export async function emailExists(email: string): Promise<boolean> {
  if (!email) return false;

  let user = undefined;
  await prisma.user
    .findFirst({
      where: {
        email: email,
      },
    })
    .then(async (result) => {
      user = result;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  if (user === null) return false;

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

  await prisma.user
    .findFirst({
      where: {
        uuid: uuid,
      },
    })
    .then(async (result) => {
      user = result;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  if (user === null) return false;

  return true;
}

export function validatePassword(password: string): boolean {
  // Has at least 8 characters
  if (password.length <= 8) return false;

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

/**
 * @desc Returns user by email
 * @param email User's email
 */
export async function getUser(email: string): Promise<RegisteredUser | null> {
  let user = null;
  await prisma.user
    .findFirst({
      where: {
        email: email,
      },
    })
    .then(async (response) => {
      user = response;
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
 * @desc Updates user's last login value
 * @param email User's email
 */
async function updateLastLogin(email: string): Promise<null | RegisteredUser> {
  let result = null;
  await prisma.user
    .update({
      where: {
        email: email,
      },
      data: {
        last_login: new Date(),
      },
    })
    .then(async (response) => {
      result = response;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  return result;
}

/**
 * @desc Verifies password against a hash
 * @param hash Hashed password
 * @param password Unhashed password
 */
async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    if (await argon2.verify(hash, password)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * @desc Verifies user after token is passed
 * @param token JSON web token
 */
export function verifyAccessToken(token: string): null | RegisteredUser {
  let verifiedUser = null;
  jwt.verify(token, config.muloziAccessTokenSecret, (err, user) => {
    if (err) {
      console.log(err);
      return null;
    }
    verifiedUser = user;
  });

  return verifiedUser;
}

/**
 * @desc Creates new tokens given a valid refresh token
 * @param token JSON web token
 */
export function createNewTokensFromRefresh(token: string): Tokens | H3Error {
  const user = verifyRefreshToken(token);

  const publicUser = {
    uuid: user?.uuid,
    email: user?.email,
    role: user?.role,
  };

  if (user) {
    // Create access and refresh tokens
    const accessToken = jwt.sign(publicUser, config.muloziAccessTokenSecret, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(publicUser, config.muloziRefreshTokenSecret, {
      expiresIn: "14d",
      issuer: "MuloziAuth",
    });

    // TODO: Deactivate current token

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  return createError({
    statusCode: 500,
    statusMessage: "Error creating tokens",
  });
}

/**
 * @desc Verifies refresh token
 * @param token JSON web token
 */
export function verifyRefreshToken(token: string): null | RegisteredUser {
  let verifiedUser = null;
  // TODO: Need to store dynamic secret in database and retrive it
  jwt.verify(token, config.muloziRefreshTokenSecret, (err, user) => {
    if (err) {
      console.log(err);
      return null;
    }

    // Checks for token issuer
    if (user?.iss !== "MuloziAuth") {
      return null;
    }
    verifiedUser = user;
  });

  return verifiedUser;
}

/**
 * @desc Authenticates user
 * @param event Event from Api
 */
export async function login(event: H3Event): Promise<H3Error | Tokens> {
  const body = await readBody(event);
  const user = await getUser(body.email);
  if (user === null)
    return createError({ statusCode: 401, statusMessage: "Invalid login" });

  if (await verifyPassword(user.password, body.password)) {
    updateLastLogin(user.email);

    const publicUser = {
      uuid: user.uuid,
      email: user.email,
      role: user.role,
    };

    // Create access and refresh tokens

    // Dynamically generate 64-character hexadecimal string
    const accessSecret = randomBytes(64).toString("hex");

    // TODO: Create a logins table perhaps

    // TODO: Access secret must be stored in database, is needed by verifyAccessToken()
    const accessToken = jwt.sign(publicUser, accessSecret, {
      expiresIn: "15m",
      issuer: "MuloziAuth",
      jwtid: uuidv4(),
    });

    const refreshSecret = randomBytes(64).toString("hex");

    // TODO: Refresh secret must be stored in database, is needed by verifyRefreshToken()
    const refreshToken = jwt.sign(publicUser, refreshSecret, {
      expiresIn: "14d",
      issuer: "MuloziAuth",
      jwtid: uuidv4(),
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  return createError({ statusCode: 401, statusMessage: "Invalid login" });
}
