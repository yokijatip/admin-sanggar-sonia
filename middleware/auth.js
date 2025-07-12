export default defineNuxtRouteMiddleware((to) => {
  const { user, loading, initialized } = useAuth();

  // Tunggu auth state initialized
  if (!initialized.value || loading.value) {
    return; // Biarkan loading state handle ini
  }

  // Jika user tidak ada, redirect ke login
  if (!user.value) {
    return navigateTo("/login");
  }
});
