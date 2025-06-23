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
});
