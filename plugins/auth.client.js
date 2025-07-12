export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp();

  // Check if Firebase is available
  if (!nuxtApp.$firebase) {
    console.error("Firebase not available in auth plugin");
    return;
  }

  console.log("Auth plugin initialized");

  // Add global navigation guard
  addRouteMiddleware(
    "global-auth",
    (to) => {
      // Skip auth check untuk halaman publik
      const publicRoutes = ["/login", "/register", "/unauthorized"];
      if (publicRoutes.includes(to.path)) {
        return;
      }

      // Initialize auth if not already done
      try {
        const { user, loading, initialized } = useAuth();

        // Tunggu auth state initialized
        if (!initialized.value || loading.value) {
          return;
        }

        // Jika user tidak ada dan bukan halaman publik, redirect ke login
        if (!user.value) {
          console.log("User not authenticated, redirecting to login");
          return navigateTo("/login");
        }
      } catch (error) {
        console.error("Error in auth middleware:", error);
        return navigateTo("/login");
      }
    },
    { global: true }
  );
});
