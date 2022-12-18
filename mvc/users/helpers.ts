// TODO: Please separate helpers for user model and helpers for Mulozi Auth. Remember,, Mulozi is for auth only

// Helper functions for
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { UnregisteredUser, RegisteredUser } from "./types";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { H3Event } from "h3";

const config = useRuntimeConfig();
const prisma = new PrismaClient();

/**
 * @desc Hashes a password or any string using Argon 2
 * @param password Unhashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password);
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: "Password error" });
  }
}

/**
 * @desc Suite of checks to validate user before registration
 * @param body Body object passed in HTTP request
 * @info returns NuxtError HTTP status code if comething is wrong
 */
export async function validateUserRegistration(event: H3Event) {
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

/**
 * @desc Creates a user
 * @param UnregUser Unregistered user with properties e.g first_name, email
 */
export async function createUser(
  UnregisteredUser: UnregisteredUser
): Promise<Object> {
  let registeredUser = {} as RegisteredUser;

  const hashedPassword = await hashPassword(UnregisteredUser.password);
  await prisma.user
    .create({
      data: {
        first_name: UnregisteredUser.first_name,
        last_name: UnregisteredUser.last_name,
        uuid: uuidv4(),
        email: UnregisteredUser.email,
        password: hashedPassword,
      },
    })
    .then(async (result) => {
      registeredUser = result;
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

  return { email: registeredUser.email };
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
        //TODO; Running into problems with date, need to fix
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
export function createNewTokensFromRefresh(token: string): null | Object {
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

  return null;
}

/**
 * @desc Verifies refresh token
 * @param token JSON web token
 */
export function verifyRefreshToken(token: string): null | RegisteredUser {
  let verifiedUser = null;
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
 * @desc Logs a user into database
 * @param registeredUser Registered user
 */
export async function login(
  registeredUser: RegisteredUser
): Promise<null | Object> {
  const user = await getUser(registeredUser.email);
  if (user === null) return null;

  if (await verifyPassword(user.password, registeredUser.password)) {
    updateLastLogin(user.email);

    // TODO: Maybe create a logins table

    // Public user profile does not show password or internal user id
    // const publicUser = {
    //   uuid: user.uuid,
    //   first_name: user.first_name,
    //   last_name: user.last_name,
    //   email: user.email,
    //   role: user.role,
    //   password_verified: user.password_verified,
    //   last_login: user.last_login,
    //   date_created: user.date_created,
    // };

    // The rest of info can be exposed in /getProfile(uuid) endpoint
    const publicUser = {
      uuid: user.uuid,
      email: user.email,
      role: user.role,
    };

    // Create access and refresh tokens
    const accessToken = jwt.sign(publicUser, config.muloziAccessTokenSecret, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(publicUser, config.muloziRefreshTokenSecret, {
      expiresIn: "14d",
      issuer: "MuloziAuth",
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  return null;
}
