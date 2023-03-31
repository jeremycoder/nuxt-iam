// Check if user is admin. This is an example


export default defineNuxtRouteMiddleware(async (to, from) => {  
  const isAdmin = false
  if (isAdmin === false) {
    return navigateTo('/iam/dashboard/denied')
  }
})