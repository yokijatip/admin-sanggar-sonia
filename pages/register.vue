<template>
  <div
    class="min-h-screen bg-gradient-to-r from-lime-400 to-lime-500 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Register</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-2">
        <!-- Name Field -->
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Lengkap
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            placeholder="Nama Admin"
          />
        </div>

        <!-- Email Field -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            placeholder="admin@tokoroti.com"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            placeholder="••••••••"
          />
          <p class="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="text-green-600 text-sm text-center">
          {{ successMessage }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-6 bg-gradient-to-r from-lime-400 to-lime-500 text-white py-2 px-4 rounded-md hover:from-lime-500 hover:to-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
        >
          <span v-if="loading">Mendaftar...</span>
          <span v-else>Daftar Admin</span>
        </button>
      </form>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-600 text-sm">
          Sudah punya akun admin?
          <NuxtLink
            to="/login"
            class="text-lime-600 hover:text-lime-700 font-medium"
          >
            Masuk di sini
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Redirect if already authenticated
definePageMeta({
  layout: false,
  middleware: "guest",
});

const { register } = useAuth();
const router = useRouter();

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  // Validation
  if (form.password !== form.confirmPassword) {
    errorMessage.value = "Password dan konfirmasi password tidak sama";
    loading.value = false;
    return;
  }

  if (form.password.length < 6) {
    errorMessage.value = "Password minimal 6 karakter";
    loading.value = false;
    return;
  }

  try {
    const result = await register(form.email, form.password);

    if (result.success) {
      successMessage.value = "Registrasi berhasil! Mengarahkan ke dashboard...";

      // Optional: Save additional user info to Firestore
      // await saveUserProfile(result.user.uid, { name: form.name, email: form.email })

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      errorMessage.value = getErrorMessage(result.error);
    }
  } catch (error) {
    errorMessage.value = "Terjadi kesalahan. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};

const getErrorMessage = (error) => {
  switch (error) {
    case "auth/email-already-in-use":
      return "Email sudah digunakan";
    case "auth/invalid-email":
      return "Format email tidak valid";
    case "auth/weak-password":
      return "Password terlalu lemah";
    case "auth/operation-not-allowed":
      return "Registrasi tidak diizinkan";
    default:
      return "Registrasi gagal. Silakan coba lagi";
  }
};
</script>
