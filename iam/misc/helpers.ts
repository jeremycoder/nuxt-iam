// Helper functions for
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
import { getClientPlatform } from "../middleware";
import passwordGenerator from "generate-password";
import {
  emailWithNodemailerService,
  emailWithNodemailerSmtp,
  emailWithSendgrid,
} from "./email";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { validateUserProfileUpdate, validatePassword } from "./utils/validators";
import { makeRandomString32, hashPassword, makeUuid, verifyPassword } from "./utils/passwords";
import { getUserByEmail, getUserByUuid, getUserById, updateLastLogin } from "./utils/users";
import { storeRefreshToken, deactivateRefreshTokens, } from "./utils/tokens";

const config = useRuntimeConfig();
const prisma = new PrismaClient();


