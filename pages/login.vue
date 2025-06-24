<template>
  <div
    class="min-h-screen bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Login</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-2">
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-6 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-md hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
        >
          <span v-if="loading">Memproses...</span>
          <span v-else>Masuk</span>
        </button>
      </form>

      <!-- Register Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-600 text-sm">
          Belum punya akun admin?
          <NuxtLink
            to="/register"
            class="text-orange-600 hover:text-orange-700 font-medium"
          >
            Daftar di sini
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

const { login } = useAuth();
const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const result = await login(form.email, form.password);

    if (result.success) {
      await router.push("/");
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
    case "auth/user-not-found":
      return "Email tidak ditemukan";
    case "auth/wrong-password":
      return "Password salah";
    case "auth/invalid-email":
      return "Format email tidak valid";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Coba lagi nanti";
    default:
      return "Login gagal. Periksa email dan password Anda";
  }
};
</script>
