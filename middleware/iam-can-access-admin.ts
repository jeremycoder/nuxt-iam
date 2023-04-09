// Check if user is admin authorized
const { getProfile } = useIam();
const { userHasPermission } = useIamAdmin();
import { User } from "~~/iam/misc/types"; 

export default defineNuxtRouteMiddleware(async (to, from) => {   
  let user = {} as User|null
  const profileData = await getProfile()  
    
  // Attempt to get user
  if (profileData.status === 'fail') {
    console.log('Failed to get user profile: ', profileData.error)
    return navigateTo('/iam/dashboard/denied')
  } else {
    user = profileData.data as User
  }

  // Check admin permission  
  if (user) {
    const hasPermission = await userHasPermission(user, 'can-access-admin')
    if (hasPermission.status !== 'success') {
      console.log('Admin authentication failed.')
      return navigateTo('/iam/dashboard/denied')
    } 
  }     
    
})