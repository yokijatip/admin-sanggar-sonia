import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const useAuth = () => {
  const { $firebase } = useNuxtApp();
  const user = ref(null);
  const loading = ref(true);

  // Login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        $firebase.auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.code };
    }
  };

  // Register (untuk admin baru)
  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        $firebase.auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.code };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut($firebase.auth);
      await navigateTo("/login");
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Monitor auth state
  onMounted(() => {
    onAuthStateChanged($firebase.auth, (authUser) => {
      user.value = authUser;
      loading.value = false;
    });
  });

  return {
    user: readonly(user),
    loading: readonly(loading),
    login,
    register,
    logout,
  };
};
