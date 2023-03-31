// Check if user is authenticated
const { isAuthenticated } = useIam();

export default defineNuxtRouteMiddleware(async (to, from) => {  
  if (await isAuthenticated() === false) {
    return navigateTo('/iam/login')
  }
})