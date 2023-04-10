import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { H3Error } from "h3";
import crypto from "crypto";
import { validatePassword } from "./../utils/validators";
import passwordGenerator from "generate-password";

const prisma = new PrismaClient();

/**
 * @desc Returns a random string of 32 characters in hexadecimal
 * @info Can be used to create a secret
 */
export function makeRandomString32(): string {
  return crypto.randomBytes(32).toString("hex");
}

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
 * @Desc Generates a new password for user given user's uuid
 * @param uuid User's uuid
 * @returns {Promise<H3Error|string>} Returns generated password or error
 */
export async function generateNewPassword(
  uuid: string
): Promise<H3Error | string> {
  let error = null;

  // Generate secure password consistent with password policy
  const password = passwordGenerator.generate({
    length: 20,
    numbers: true,
    symbols: true,
    strict: true,
  });

  // Check if password passes password policy
  const isValidPassword = validatePassword(password);
  if (!isValidPassword) {
    console.log("Failed to generate valid password");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // Hash password
  const errorOrHashedPassword = await hashPassword(password);
  if (errorOrHashedPassword instanceof H3Error) {
    console.log("Error hashing password");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  const hashedPassword = errorOrHashedPassword as string;

  // Update database
  await prisma.users
    .update({
      where: {
        uuid: uuid,
      },
      data: {
        password: hashedPassword,
      },
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error updating user password");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  console.log("Updated user password");
  return password;
}

/**
 * @desc Verifies password against a hash
 * @param hash Hashed password
 * @param password Unhashed password
 */
export async function verifyPassword(
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
