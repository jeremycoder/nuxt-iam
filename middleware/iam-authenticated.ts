// Check if user is authenticated
const { isAuthenticated } = useIam();

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isAuth = await isAuthenticated();
  if (!isAuth) return navigateTo("/iam/login");
});
