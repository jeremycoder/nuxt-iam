// Check if user is admin authorized
const { getProfile } = useIam();
import { User } from "~~/iam/misc/types"; 

export default defineNuxtRouteMiddleware(async (to, from) => { 
  let isAdminAuthorized = false;
  const { status, data, error } = await getProfile()
  
  if (status === 'fail') {
    console.log('Failed to get user profile: ', error)
    return navigateTo('/iam/dashboard/denied')
  } else {
    const profile = data as User
    if (profile.role === 'SUPER_ADMIN' && profile.email_verified && profile.permissions && profile.permissions.includes('canAccessAdmin'))
      isAdminAuthorized = true;
  }

  // If authorization fails, send to denied page
  if (!isAdminAuthorized) return navigateTo('/iam/dashboard/denied')
})