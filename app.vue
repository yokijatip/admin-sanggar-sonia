<template>
  <div>
    <!-- Loading state saat auth belum initialized -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-white flex items-center justify-center z-50"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>

    <!-- Main app content -->
    <div v-else>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp();
const isLoading = ref(true);

onMounted(async () => {
  // Wait for Firebase to be ready
  await nextTick();

  if (nuxtApp.$firebase) {
    console.log("Firebase available, initializing auth");

    try {
      const { loading, initialized } = useAuth();

      // Watch for auth initialization
      watch(
        [initialized, loading],
        ([init, load]) => {
          if (init && !load) {
            console.log("Auth ready, hiding loading");
            isLoading.value = false;
          }
        },
        { immediate: true }
      );

      // Timeout fallback
      setTimeout(() => {
        if (isLoading.value) {
          console.log("Auth timeout, showing content anyway");
          isLoading.value = false;
        }
      }, 3000);
    } catch (error) {
      console.error("Error initializing auth:", error);
      isLoading.value = false;
    }
  } else {
    console.error("Firebase not available in app.vue");
    isLoading.value = false;
  }
});
</script>
