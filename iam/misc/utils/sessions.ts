import { PrismaClient } from "@prisma/client";
import { Session } from "~~/iam/misc/types";
import { H3Event, H3Error } from "h3";
import { makeRandomString32, makeUuid } from "./../utils/passwords";

const prisma = new PrismaClient();

/**
 * @Desc Create user session
 * @param user_id User id
 * @returns {Promise<H3Error|string>} Returns error or the given uuid
 */
export async function createUserSession(
  userId: number,
  accessToken: string,
  event: H3Event
): Promise<H3Error | Session> {
  let error = null;
  let session = null;

  // If no user id provided
  if (!userId) {
    console.log("User id not provided for create session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If no access token provided
  if (!accessToken) {
    console.log("Access token not provided for create session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If event not provided
  if (!event) {
    console.log("Event not provided for create session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  const csrfToken = makeRandomString32();
  const ipAddress = getRequestHeader(event, "x-forwarded-for");

  // Create session
  await prisma.sessions
    .create({
      data: {
        user_id: userId,
        sid: makeUuid(),
        start_time: new Date(),
        access_token: accessToken,
        csrf_token: csrfToken,
        is_active: true,
        ip_address: ipAddress ? ipAddress : "unable to get IP address",
      },
    })
    .then(async (result) => {
      session = result as Session;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error creating user session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a session, return it
  if (session) return session;

  // Otherwise, return an error
  console.log("We should not be getting this session error");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @Desc Returns session given session id
 * @param sessionId Session id
 * @returns {Promise<H3Error|Session>} Returns error or the given uuid
 */
export async function getUserSession(
  sessionId: string
): Promise<H3Error | Session> {
  let error = null;
  let session = null;

  // Create session
  await prisma.sessions
    .findUnique({
      where: {
        sid: sessionId,
      },
    })
    .then(async (result) => {
      session = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error retrieving user session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a session, return it
  if (session) return session;

  // Otherwise, return an error
  console.log("We should not be getting this retrieve session error");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @Desc Deactivates all of a user's sessions
 * @param userId User id
 * @returns {Promise<H3Error|Session>} Returns error or the given uuid
 */
export async function deactivateUserSessions(
  userId: number
): Promise<H3Error | Session> {
  let error = null;
  let session = null;

  // Deactivate session
  await prisma.sessions
    .updateMany({
      where: {
        user_id: userId,
      },
      data: {
        is_active: false,
      },
    })
    .then(async (result) => {
      session = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error deactivating user session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a session, return it
  if (session) return session;

  // Otherwise, return an error
  console.log("We should not be getting this deactivate user session error");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @Desc Records end time of a user session
 * @param sessionId Session id
 * @returns {Promise<H3Error|Session>} Returns error or the given uuid
 */
export async function endUserSession(
  sessionId: string
): Promise<H3Error | Session> {
  let error = null;
  let session = null;

  // Deactivate session
  await prisma.sessions
    .update({
      where: {
        sid: sessionId,
      },
      data: {
        end_time: new Date(),
      },
    })
    .then(async (result) => {
      session = result;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

  // Check for database errors
  if (error) {
    console.log("Error ending user session");
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // If we have a session, return it
  if (session) return session;

  // Otherwise, return an error
  console.log("We should not be getting this update user session error");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}


