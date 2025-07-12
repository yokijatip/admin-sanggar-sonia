import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // Full SPA mode

  // atau bisa hybrid dengan nitro presets
  nitro: {
    preset: "static", // jika mau deploy sebagai static files
  },

  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  // TAMBAHKAN PLUGINS SECTION
  plugins: [
    { src: "~/plugins/firebase.client.js", mode: "client" },
    { src: "~/plugins/auth.client.js", mode: "client" },
  ],

  modules: [
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
  ],

  colorMode: {
    preference: "system", // default theme
    dataValue: "theme", // activate data-theme in <html> tag
    classSuffix: "",
  },

  // Add Tailwind
  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/main.css"],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },

  // Runtime config untuk environment variables
  runtimeConfig: {
    // Server-side environment variables (private)
    cloudinaryApiSecret: process.env.NUXT_CLOUDINARY_API_SECRET,

    // Public environment variables (client-side)
    public: {
      cloudinaryCloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.VITE_CLOUDINARY_API_KEY,
      cloudinaryUploadPreset: process.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      // Firebase config
      firebaseApiKey: process.env.VITE_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.VITE_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.VITE_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    },
  },
});
