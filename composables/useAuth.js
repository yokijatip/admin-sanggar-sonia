// composables/useAuth.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const useAuth = () => {
  const { $firebase } = useNuxtApp();
  const auth = $firebase.auth;
  const db = $firebase.firestore;
  const user = useState("user", () => null); // Global state
  const loading = useState("loading", () => true);

  // Monitor auth state
  onAuthStateChanged(auth, async (authUser) => {
    if (authUser) {
      const userDoc = await getDoc(doc(db, "users", authUser.uid));
      if (userDoc.exists()) {
        user.value = { uid: authUser.uid, ...userDoc.data() };
      } else {
        user.value = null;
      }
    } else {
      user.value = null;
    }
    loading.value = false;
  });

  // Login
  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const authUser = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", authUser.uid));
      if (!userDoc.exists()) throw new Error("User not found");

      user.value = { uid: authUser.uid, ...userDoc.data() };
      return user.value;
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
      return userData;
    } catch (error) {
      console.error("Error registering user:", error.code, error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
      await navigateTo("/login");
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    loginUser,
    registerUser,
    logout,
  };
};
