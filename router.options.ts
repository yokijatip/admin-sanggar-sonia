// app/router.options.ts
export default {
  routes: async () => {
    const resolved = (await import("~/../.nuxt/types/router")).default;
    return [
      {
        name: "dashboard",
        path: "/dashboard",
        component: resolved.find((r) => r.name === "dashboard")?.component,
      },
      {
        name: "products",
        path: "/products",
        component: resolved.find((r) => r.name === "products")?.component,
      },
      {
        name: "orders",
        path: "/orders",
        component: resolved.find((r) => r.name === "orders")?.component,
      },
      {
        name: "customers",
        path: "/customers",
        component: resolved.find((r) => r.name === "customers")?.component,
      },
    ];
  },
};
