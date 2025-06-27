// middleware/auth.js
export default defineNuxtRouteMiddleware(() => {
  const { user, loading } = useAuth();

  if (loading.value) return; // Tungu auth state siap

  if (!user.value) {
    return navigateTo("/login");
  }
});
