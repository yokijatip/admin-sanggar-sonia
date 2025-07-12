import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const useAuth = () => {
  const nuxtApp = useNuxtApp();

  // Check if Firebase is available
  if (!nuxtApp.$firebase) {
    console.error("Firebase not initialized in useAuth");
    throw new Error(
      "Firebase not initialized. Make sure firebase.client.js plugin is loaded first."
    );
  }

  const auth = nuxtApp.$firebase.auth;
  const db = nuxtApp.$firebase.firestore;
  const user = useState("user", () => null);
  const loading = useState("loading", () => true);
  const initialized = useState("auth_initialized", () => false);

  // Initialize auth state monitoring hanya sekali
  const initAuth = () => {
    if (initialized.value) return;

    console.log("Initializing auth state monitoring");

    onAuthStateChanged(auth, async (authUser) => {
      console.log(
        "Auth state changed:",
        authUser ? "User logged in" : "User logged out"
      );

      try {
        if (authUser) {
          const userDoc = await getDoc(doc(db, "users", authUser.uid));
          if (userDoc.exists()) {
            user.value = {
              uid: authUser.uid,
              email: authUser.email,
              ...userDoc.data(),
            };
            console.log("User data loaded:", user.value);
          } else {
            console.log("User document not found");
            user.value = null;
          }
        } else {
          user.value = null;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        user.value = null;
      } finally {
        loading.value = false;
        initialized.value = true;
        console.log("Auth initialization complete");
      }
    });
  };

  // Initialize auth saat composable dipanggil
  initAuth();

  // Login
  const loginUser = async (email, password) => {
    try {
      console.log("Attempting login for:", email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const authUser = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", authUser.uid));
      if (!userDoc.exists()) {
        throw new Error("User data not found");
      }

      const userData = {
        uid: authUser.uid,
        email: authUser.email,
        ...userDoc.data(),
      };

      user.value = userData;
      console.log("Login successful:", userData);
      return userData;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // Register
  const registerUser = async (
    email,
    password,
    firstName,
    lastName,
    phoneNumber = "",
    imageUrl = "",
    role = "staff"
  ) => {
    try {
      console.log("Attempting registration for:", email);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const authUser = userCredential.user;

      const userData = {
        uid: authUser.uid,
        email,
        firstName,
        lastName,
        phoneNumber,
        imageUrl,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "users", authUser.uid), userData);
      user.value = userData;
      console.log("Registration successful:", userData);
      return userData;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      console.log("Logging out user");
      await signOut(auth);
      user.value = null;
      await navigateTo("/login");
      return { success: true };
    } catch (error) {
      console.error("Error logging out:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    initialized: readonly(initialized),
    loginUser,
    registerUser,
    logout,
  };
};
