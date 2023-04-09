/* Permissions should always return true or false. Any error that occurs, should print to the console and return false */
/* They are designed to be independent checks. However because they may do very similar things, they can become expensive*/

import { User } from "~~/iam/misc/types";

/**
 * @desc Checks if a user has admin authorization
 * @param user User object
 */
export function canAccessAdmin(user: User): boolean{  
  if (user.role === 'SUPER_ADMIN' && user.email_verified)
    return true

  return false
}

/**
 * @desc Checks if a user has a permission
 * @param user User object
 * @param permission A permission
 */
export function hasPermission(user: User, permission: string): boolean {
  // Check if user has the permission
  const permissions = {    
    'can-access-admin': canAccessAdmin(user),
  }

  // If permission does not exist, return false
  if (permission in permissions === false) {
    console.log(`No such permission as "${permission}"`) 
    return false
  }
  else {
    // @ts-ignore
    return permissions[permission]
  }
  
}
