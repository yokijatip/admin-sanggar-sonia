export default defineNuxtRouteMiddleware((to) => {
  const { user, loading, initialized } = useAuth();

  // Tunggu auth state initialized
  if (!initialized.value || loading.value) {
    return;
  }

  // Jika user tidak ada, redirect ke login
  if (!user.value) {
    return navigateTo("/login");
  }

  // Ambil role yang dibutuhkan dari meta
  const requiredRole = to.meta.requiredRole;

  // Jika ada role requirement dan user tidak memenuhi
  if (
    requiredRole &&
    user.value.role !== requiredRole &&
    user.value.role !== "owner"
  ) {
    return navigateTo("/unauthorized");
  }
});
