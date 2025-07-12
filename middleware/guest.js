export default defineNuxtRouteMiddleware(() => {
  const { user, loading, initialized } = useAuth();

  // Tunggu auth state initialized
  if (!initialized.value || loading.value) {
    return;
  }

  // Jika user sudah login, redirect ke dashboard
  if (user.value) {
    return navigateTo("/");
  }
});
