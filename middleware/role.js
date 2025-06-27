export default defineNuxtRouteMiddleware((to) => {
  const { user, loading } = useAuth();

  if (loading.value) return;

  if (!user.value) {
    return navigateTo("/login");
  }

  // Ambil role yang dibutuhkan dari meta
  const requiredRole = to.meta.requiredRole;

  // Kalau tidak sesuai role, redirect
  if (
    requiredRole &&
    user.value.role !== requiredRole &&
    user.value.role !== "owner"
  ) {
    return navigateTo("/unauthorized");
  }
});
