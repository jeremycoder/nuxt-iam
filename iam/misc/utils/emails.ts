import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import {
  User,
  TokensSession,
  EmailOptions,
  Session,
  ProviderUser,
} from "~~/iam/misc/types";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import { H3Event, H3Error } from "h3";
import { getClientPlatform } from "../../middleware";
import passwordGenerator from "generate-password";
import {
  emailWithNodemailerService,
  emailWithNodemailerSmtp,
  emailWithSendgrid,
} from "../email";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { validateUserProfileUpdate, validatePassword } from "./validators";
import { makeRandomString32, hashPassword, makeUuid, verifyPassword } from "./passwords";
import { getUserByEmail, getUserByUuid, getUserById, updateLastLogin } from "./users";
import { storeRefreshToken, deactivateRefreshTokens, } from "./tokens";

const config = useRuntimeConfig();

/**
 * @desc Send email to reset user password
 * @param user User's profile
 * @param token Reset token
 */
export async function sendResetEmail(
  user: User,
  token: string
): Promise<H3Error | true> {
  const emailers = ["nodemailer-service", "nodemailer-smtp", "sendgrid"];
  console.log("Preparing to send reset email");

  // Get emailer and url
  const emailer = config.iamEmailer;
  const url = config.iamPublicUrl;

  // nodemailer-service
  const service = config.iamNodemailerService;
  const serviceSender = config.iamNodemailerServiceSender;
  const servicePassword = config.iamNodemailerServicePassword;

  // nodemailer-smtp
  const smtpHost = config.iamNodemailerSmtpHost;
  const smtpPort = config.iamNodemailerSmtpPort;
  const smtpSender = config.iamNodemailerSmtpSender;
  const smtpPassword = config.iamNodemailerSmtpPassword;

  // Check if emailer is valid
  if (!emailers.includes(emailer)) {
    console.log(
      `Error: Emailer: ${emailer} is an unknown emailer. Aborting send.`
    );
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // Common email options
  const options = {
    to: user.email,
    subject: "Nuxt IAM reset password link",
    text: `
    Hello ${user.first_name},
    You requested to reset your password. Please follow the link below. If you did not request to reset your password, 
    disregard this email. Your last login time was: ${user.last_login}.
      
    This is a one-time password link that will reveal a temporary password.
  
    Password reset link: ${url}/iam/verify?token=${token}
    `,
    html: `
    <p>Hello ${user.first_name}</p>,
    <p>You requested to reset your password. Please follow the link below. If you did not request to reset your password, 
    disregard this email. Your last login time was: ${user.last_login}.</p>
    <p>This is a one-time password link that will reveal a temporary password.</p>
    <p>Password reset link: ${url}/iam/verify?token=${token}</p>`,
  } as EmailOptions;

  // Sending with nodemailer-service
  if (emailer === "nodemailer-service") {
    //Options to do with nodemailer-service
    const serviceOptions = options;
    serviceOptions.from = serviceSender;

    // Attempt to send
    const errorOrSent = await emailWithNodemailerService(
      serviceSender,
      servicePassword,
      service,
      serviceOptions
    );

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Sending with nodemailer-smtp
  if (emailer === "nodemailer-smtp") {
    //Options to do with nodemailer-smtp
    const smtpOptions = options;
    smtpOptions.from = smtpSender;

    // Attempt to send email
    const errorOrSent = await emailWithNodemailerSmtp(
      smtpSender,
      smtpPassword,
      smtpHost,
      smtpPort,
      smtpOptions
    );

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Sending with Sendgrid
  if (emailer === "sendgrid") {
    const sendgridOptions = options;
    sendgridOptions.from = config.iamSendgridSender;
    const errorOrSent = await emailWithSendgrid(options);

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Otherwise return error
  console.log("We should not get here");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

/**
 * @desc Send email to verify user's email
 * @param user User's profile
 * @param token Verify token
 */
export async function sendVerifyEmail(
  user: User,
  token: string
): Promise<H3Error | true> {
  const emailers = ["nodemailer-service", "nodemailer-smtp", "sendgrid"];
  console.log("Preparing to send verification email");

  // Get emailer and url
  const emailer = config.iamEmailer;
  const url = config.iamPublicUrl;

  // nodemailer-service
  const service = config.iamNodemailerService;
  const serviceSender = config.iamNodemailerServiceSender;
  const servicePassword = config.iamNodemailerServicePassword;

  // nodemailer-smtp
  const smtpHost = config.iamNodemailerSmtpHost;
  const smtpPort = config.iamNodemailerSmtpPort;
  const smtpSender = config.iamNodemailerSmtpSender;
  const smtpPassword = config.iamNodemailerSmtpPassword;

  // Check if emailer is valid
  if (!emailers.includes(emailer)) {
    console.log(
      `Error: Emailer: ${emailer} is an unknown emailer. Aborting send.`
    );
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  }

  // Common email options
  const options = {
    to: user.email,
    subject: "Nuxt IAM please verify your email",
    text: `
    Hello ${user.first_name},
    You recently created an account at ${url} on ${user.created_at}. Please verify your email to continue with your account. Please follow the link below to verify your email. 
      
    Follow the link to verify your email: ${url}/iam/verifyemail?token=${token}
    `,
    html: `
    <p>Hello ${user.first_name}</p>,
    <p>You recently created an account at ${url} on ${user.created_at}. Please verify your email to continue with your account. Please follow the link below to verify your email.</p> 
      
    <p>Follow the link to verify your email: ${url}/iam/verifyemail?token=${token}</p>`,
  } as EmailOptions;

  // Sending with nodemailer-service
  if (emailer === "nodemailer-service") {
    //Options to do with nodemailer-service
    const serviceOptions = options;
    serviceOptions.from = serviceSender;

    // Attempt to send
    const errorOrSent = await emailWithNodemailerService(
      serviceSender,
      servicePassword,
      service,
      serviceOptions
    );

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Sending with nodemailer-smtp
  if (emailer === "nodemailer-smtp") {
    //Options to do with nodemailer-smtp
    const smtpOptions = options;
    smtpOptions.from = smtpSender;

    // Attempt to send email
    const errorOrSent = await emailWithNodemailerSmtp(
      smtpSender,
      smtpPassword,
      smtpHost,
      smtpPort,
      smtpOptions
    );

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Sending with Sendgrid
  if (emailer === "sendgrid") {
    const sendgridOptions = options;
    sendgridOptions.from = config.iamSendgridSender;
    const errorOrSent = await emailWithSendgrid(options);

    // If error, return error
    if (errorOrSent instanceof H3Error) return errorOrSent;

    // Otherwise its true
    return true;
  }

  // Otherwise return error
  console.log("We should not get here");
  return createError({
    statusCode: 500,
    statusMessage: "Server error",
  });
}

