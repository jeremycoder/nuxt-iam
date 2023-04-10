import { PrismaClient } from "@prisma/client";
import { User, ProviderUser } from "~~/iam/misc/types";
import { H3Error, H3Event } from "h3";
import { validateUserProfileUpdate, validatePassword } from "./../utils/validators";
import { hashPassword, makeUuid } from "./../utils/passwords";
import passwordGenerator from "generate-password";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/**
 * @desc Returns user by email
 * @param email User's email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  let user = null;
  await prisma.users
    .findFirst({
      where: {
        email: email,
      },
    })
    .then(async (response) => {
      user = response;
    })
    .catch(async (e) => {
      console.error(e);
    });

  return user;
}

/**
 * @desc Returns user by user's uuid
 * @param uuid User's uuid
 */
export async function getUserByUuid(uuid: string): Promise<User | null> {
  let user = null;
  await prisma.users
    .findFirst({
      where: {
        uuid: uuid,
      },
    })
    .then(async (response) => {
      user = response;
    })
    .catch(async (e) => {
      console.error(e);
    });

  return user;
}

/**
 * @desc Returns user by user id
 * @param id User's id
 */
export async function getUserById(id: number): Promise<User | null> {
  let user = null;
  await prisma.users
    .findFirst({
      where: {
        id: id,
      },
    })
    .then(async (response) => {
      user = response;
    })
    .catch(async (e) => {
      console.error(e);
    });

  return user;
}

/**
 * @desc Updates user's last login value
 * @param email User's email
 */
export async function updateLastLogin(email: string): Promise<null | User> {
  let result = null;
  await prisma.users
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
    })
    .catch(async (e) => {
      console.error(e);
    });

  return result;
}

/**
 * @desc Updates user's email verified to true
 * @param email User's email
 */
export async function updateEmailVerifiedTrue(
  email: string
): Promise<H3Error | void> {
  let error = null;

  if (!email) {
    console.log("Error no email provided to update email verified to true");
    return createError({ statusCode: 400, statusMessage: "No email provided" });
  }

  await prisma.users
    .update({
      where: {
        email: email,
      },
      data: {
        email_verified: true,
      },
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) {
    console.log("Error updating email verified to true");
    return createError({ statusCode: 500, statusMessage: "Password error" });
  }
}

/**
 * @desc Update user profile
 * @param event H3Event
 */
export async function updateUserProfile(
  event: H3Event
): Promise<User | H3Error> {
  const errorOrVoid = await validateUserProfileUpdate(event);
  if (errorOrVoid instanceof H3Error) return errorOrVoid;

  // After going through validateUserProfileUpdate, supplied values should be clean
  const body = await readBody(event);

  // Properties that user can update in their profile
  let user = {} as User;
  let error = null;

  // Get current user data
  const userDataOrError = await getUserByUuid(body.uuid);
  if (userDataOrError instanceof H3Error) return userDataOrError;
  const userData = userDataOrError as User;

  // Attempt to hash new password, if error, return error
  let newHashedPassword = "";
  if ("new_password" in body === true && "current_password" in body === true) {
    const newHashedPasswordOrError = await hashPassword(body.new_password);
    if (newHashedPasswordOrError instanceof H3Error)
      return newHashedPasswordOrError;
    newHashedPassword = newHashedPasswordOrError as string;
  }

  await prisma.users
    .update({
      where: {
        uuid: body.uuid,
      },
      data: {
        first_name: body.first_name ? body.first_name : userData.first_name,
        last_name: body.last_name ? body.last_name : userData.last_name,
        // If we got a new password, update it, otherwise keep old password
        password:
          newHashedPassword.length > 0 ? newHashedPassword : userData.password,
      },
    })
    .then(async (response) => {
      user = response;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // If error, return error
  if (error) return error;

  return user;
}

/**
 * @Desc Check if session and token are valid
 * @param payload Payload from Google access token
 * @returns {Promise<H3Error|User>} Returns error or the given uuid
 */
export async function createGoogleUser(
  payload: jwt.JwtPayload
): Promise<H3Error | User> {
  let error = null;
  let providerUser = {} as ProviderUser | null;
  let user = null;

  // Check if token is Google token (simple check)
  if (!payload.aud?.includes("googleusercontent")) {
    console.log("Error creating Google user: token not a Google token");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Check if payload subject exists
  if (!payload.sub) {
    console.log("Missing payload subject from Google token payload");
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Check if Google user exists (payload.sub is unique Google user id)
  await prisma.provider_users
    .findFirst({
      where: {
        provider_user_id: payload.sub,
      },
    })
    .then(async (result) => {
      providerUser = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for error
  if (error) {
    console.log("Error checking if Google user exists");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If provider user exists, get user using user_id
  if (providerUser) {
    await prisma.users
      .findFirst({
        where: {
          id: providerUser.user_id,
        },
      })
      .then(async (result) => {
        user = result;
      })
      .catch(async (e) => {
        console.log("Provider user error");
        console.error(e);
        error = e;
      });
  }

  // Check for error
  if (error) {
    console.log("Error getting already created Google user");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If user exists, return user
  if (user) return user;

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

  // check if user exists
  user = await getUserByEmail(payload.email);

  // If no user, create user
  if (!user) {
    await prisma.users
      .create({
        data: {
          first_name: payload.given_name,
          last_name: payload.family_name,
          uuid: makeUuid(),
          avatar: payload.picture,
          email: payload.email,
          email_verified: true,
          password: hashedPassword,
        },
      })
      .then(async (response) => {
        user = response;
      })
      .catch(async (e) => {
        console.error(e);
        error = e;
      });

    // Check for error
    if (error) {
      console.log("Error creating user after Google login");
      return createError({
        statusCode: 500,
        statusMessage: "Server error",
      });
    }
  }

  // Get user
  let verifiedUser = {} as User;
  if (user) verifiedUser = user as User;

  // Create provider user
  if (user) {
    await prisma.provider_users
      .create({
        data: {
          provider: "GOOGLE",
          provider_user_id: payload.sub,
          user_id: verifiedUser.id,
        },
      })
      .then(async (result) => {
        providerUser = result;
      })
      .catch(async (e) => {
        console.log("Error creating provider user");
        console.error(e);
        error = e;
      });
  }

  if (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have the user, return the user
  if (verifiedUser) return verifiedUser;

  // Otherwise, return an error
  console.log("We should not be getting this create Google user error");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}