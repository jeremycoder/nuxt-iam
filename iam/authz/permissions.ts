/* Permissions should always return true or false. Any error that occurs, should print to the console and return false */
import { H3Event } from "h3";

export function isSuperAdmin(accessToken: string): boolean {
  // Get user uuid from accessToken

  // Get user record

  // Check if user role is SUPER_ADMIN
  return false;
}

export function hasVerifiedEmail(accessToken: string): boolean {
  // Get user uuid from accessToken

  // Get user record

  // Check if user email is verified

  return false;
}

export function canReadOwnUserRecord(
  accessToken: string,
  event: H3Event
): boolean {
  // Get user uuid from accessToken

  // Get user uuid from read/show route in event

  return false;
}

export function canEditOwnUserRecord(
  accessToken: string,
  event: H3Event
): boolean {
  // Get user uuid from accessToken

  // Get user uuid from update route in event

  return false;
}

export function canDeleteOwnUserRecord(
  accessToken: string,
  event: H3Event
): boolean {
  // Get user uuid from accessToken

  // Get user record

  // Get user uuid from delete route in event

  return false;
}
