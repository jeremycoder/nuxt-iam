import { User, EmailOptions } from "~~/iam/misc/types";
import { H3Error } from "h3";
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";

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

/**
 * @desc Sends email with Sendgrid
 * @param options Email message options like to, from etc.
 * @returns {Promise<H3Error | true>}
 */
export async function emailWithSendgrid(
  options: EmailOptions
): Promise<H3Error | true> {
  const apiKey = config.iamSendGridApiKey;
  let emailError = null;

  // If Sendgrid api key not found
  if (!apiKey) {
    console.log("Sendgrid Api key not found. Cannot send email. Aborting.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Attempting to send mail with Sendgrid
  sgMail.setApiKey(apiKey);

  // Create messag object
  const msg = {
    to: options.to,
    from: options.from, // Change to your verified sender
    subject: options.subject,
    text: options.text ? options.text : "",
    html: options.html ? options.html : options.text,
  };

  console.log("=======SENDGRID EMAIL OPTIONS =========================");
  console.log("from: ", msg.from);
  console.log("to: ", msg.to);
  console.log("subject: ", msg.subject);
  console.log("=======SENDGRID EMAIL OPTIONS END=========================");

  // Send email
  console.log("Attempting to send email with Sendgrid");
  console.log(
    "Sendgrid requires verified senders. Make sure your sender is verified by Sendgrid."
  );
  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
      emailError = error;
    });

  // If error, return error
  if (emailError) {
    console.log("Error when sending email in Sendgrid");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // If successful
  return true;
}

/**
 *@desc Sends email using Nodemailer service (e.g. hotmail)
 * @param sender Sender's email address
 * @param password Sender's password
 * @param service Sender's service such as hotmail
 * @param options Options for email such as to, from, subject etc.
 * @returns
 */
export async function emailWithNodemailerService(
  sender: string,
  password: string,
  service: string,
  options: EmailOptions
): Promise<H3Error | true> {
  // Error flag
  let errorFound = null;

  const emailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // Sending email using nodemailer-service
  console.log("Attempting to send mail using nodemailer-service");

  if (!service) {
    console.log("Error: Service not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Check for email user
  if (!sender) {
    console.log("Error: Sender email not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Check for password
  if (!password) {
    console.log("Error: Email password not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  console.log("=======NODEMAILER-SERVICE EMAIL OPTIONS=============");
  console.log("service: ", service);
  console.log("from: ", emailOptions.from);
  console.log("to: ", emailOptions.to);
  console.log("=========NODEMAILER-SERVICE EMAIL OPTIONS END=================");

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: service,
    auth: {
      user: sender,
      pass: password,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  // Check if email server is ready to take our messages
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      console.log("Email server verify problem");
      errorFound = error;
    } else {
      console.log("Server is ready to take our messages");
      console.log("Success: ", success);
    }
  });

  // If transporter verify error, return
  if (errorFound)
    return createError({ statusCode: 500, statusMessage: "Server error" });

  // Attempt to send email
  transporter.sendMail(emailOptions, (err, result) => {
    console.log(`Attempting to send email to user: ${options.to}`);

    // If error, log error and return
    if (err) {
      console.log(err);
      errorFound = err;
      console.log("Send email error");
    } else {
      console.log("Email successfully sent");
      console.log("Email result: ", result);
    }
  });

  // If errorFound, return error
  if (errorFound)
    return createError({ statusCode: 500, statusMessage: "Server error" });

  // Otherwise successful
  return true;
}

/**
 * @desc Sends email using Nodemailer SMTP
 * @param sender Sender's email address
 * @param password Sender's password
 * @param host Email server host
 * @param port Email server port
 * @param options Options for email such as to, from, subject etc.
 * @returns
 */
export async function emailWithNodemailerSmtp(
  sender: string,
  password: string,
  host: string,
  port: string,
  options: EmailOptions
): Promise<H3Error | true> {
  // Error flag
  let errorFound = null;

  const emailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // Sending email using nodemailer-service
  console.log("Attempting to send mail using nodemailer-service");

  if (!host) {
    console.log("Error: Email host not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Check for email user
  if (!sender) {
    console.log("Error: Sender email not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  // Check for password
  if (!sender) {
    console.log("Error: Sender password not specified. Aborting email send.");
    return createError({ statusCode: 500, statusMessage: "Server error" });
  }

  console.log("=======NODEMAILER-SMTP EMAIL OPTIONS=============");
  console.log("host: ", host);
  console.log("port: ", port);
  console.log("user: ", sender);
  console.log("=========NODEMAILER-SMTP EMAIL OPTIONS END=================");

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    pool: true,
    secure: true, // use TLS
    auth: {
      user: sender,
      pass: password,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  // Check if email server is ready to take our messages
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      console.log("Email server verify problem");
      errorFound = error;
    } else {
      console.log("Server is ready to take our messages");
      console.log("Success: ", success);
    }
  });

  // If transporter verify error, return
  if (errorFound)
    return createError({ statusCode: 500, statusMessage: "Server error" });

  // Attempt to send email
  transporter.sendMail(emailOptions, (err, result) => {
    console.log(`Attempting to send email to user: ${options.to}`);

    // If error, log error and return
    if (err) {
      console.log(err);
      errorFound = err;
      console.log("Send email error");
    } else {
      console.log("Email successfully sent");
      console.log("Email result: ", result);
    }
  });

  // If errorFound, return error
  if (errorFound)
    return createError({ statusCode: 500, statusMessage: "Server error" });

  // Otherwise successful
  return true;
}

