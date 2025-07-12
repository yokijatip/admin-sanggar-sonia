// composables/useBreadcrumb.ts
export interface BreadcrumbItem {
  title: string;
  to?: string;
  icon?: any;
}

export const useBreadcrumb = () => {
  const route = useRoute();

  // Mapping route paths to breadcrumb configurations
  const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
    "/": [{ title: "Home", to: "/" }],

    // Products routes
    "/products/productDashboard": [
      { title: "Home", to: "/" },
      { title: "Products", to: "/products/productDashboard" },
    ],
    "/products/listProducts": [
      { title: "Home", to: "/" },
      { title: "Products", to: "/products/productDashboard" },
      { title: "List Products" },
    ],
    "/products/addProduct": [
      { title: "Home", to: "/" },
      { title: "Products", to: "/products/productDashboard" },
      { title: "Add Product" },
    ],
    "/products/inventory": [
      { title: "Home", to: "/" },
      { title: "Products", to: "/products/productDashboard" },
      { title: "Inventory" },
    ],

    // Orders routes
    "/orders/orderDashboard": [
      { title: "Home", to: "/" },
      { title: "Orders", to: "/orders/orderDashboard" },
    ],
    "/orders/listOrder": [
      { title: "Home", to: "/" },
      { title: "Orders", to: "/orders/orderDashboard" },
      { title: "List Orders" },
    ],
    "/orders/addOrder": [
      { title: "Home", to: "/" },
      { title: "Orders", to: "/orders/orderDashboard" },
      { title: "Add Order" },
    ],
    "/orders/historyOrder": [
      { title: "Home", to: "/" },
      { title: "Orders", to: "/orders/orderDashboard" },
      { title: "History Order" },
    ],
    "/orders/queueOrderProcess": [
      { title: "Home", to: "/" },
      { title: "Orders", to: "/orders/orderDashboard" },
      { title: "Queue Order Process" },
    ],

    // Customers routes
    "/customers/customerDashboard": [
      { title: "Home", to: "/" },
      { title: "Customers", to: "/customers/customerDashboard" },
    ],
    "/customers/listCustomer": [
      { title: "Home", to: "/" },
      { title: "Customers", to: "/customers/customerDashboard" },
      { title: "List Customer" },
    ],
    "/customers/addCustomer": [
      { title: "Home", to: "/" },
      { title: "Customers", to: "/customers/customerDashboard" },
      { title: "Add Customer" },
    ],
    "/customers/customerInformation": [
      { title: "Home", to: "/" },
      { title: "Customers", to: "/customers/customerDashboard" },
      { title: "Customer Information" },
    ],

    // Finance routes
    "/finance/financeDashboard": [
      { title: "Home", to: "/" },
      { title: "Finance", to: "/finance/financeDashboard" },
    ],
    "/finance/expenses": [
      { title: "Home", to: "/" },
      { title: "Finance", to: "/finance/financeDashboard" },
      { title: "Expenses" },
    ],
    "/finance/transactions": [
      { title: "Home", to: "/" },
      { title: "Finance", to: "/finance/financeDashboard" },
      { title: "Transactions" },
    ],
    "/finance/approval": [
      { title: "Home", to: "/" },
      { title: "Finance", to: "/finance/financeDashboard" },
      { title: "Approval" },
    ],

    // Settings routes
    "/settings/settings": [
      { title: "Home", to: "/" },
      { title: "Settings", to: "/settings/settings" },
    ],
    "/settings/team": [
      { title: "Home", to: "/" },
      { title: "Settings", to: "/settings/settings" },
      { title: "Team" },
    ],
    "/settings/billing": [
      { title: "Home", to: "/" },
      { title: "Settings", to: "/settings/settings" },
      { title: "Billing" },
    ],

    // Support routes
    "/support": [{ title: "Home", to: "/" }, { title: "Support" }],
    "/feedback": [{ title: "Home", to: "/" }, { title: "Feedback" }],
  };

  // Generate breadcrumb items based on current route
  const breadcrumbItems = computed(() => {
    const currentPath = route.path;

    // Check if we have a predefined breadcrumb for this path
    if (breadcrumbMap[currentPath]) {
      return breadcrumbMap[currentPath];
    }

    // Fallback: generate breadcrumb from path segments
    const segments = currentPath.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [{ title: "Home", to: "/" }];

    let currentPath_build = "";
    segments.forEach((segment, index) => {
      currentPath_build += `/${segment}`;

      // Capitalize and format segment name
      const title = segment
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .replace(/([a-z])([A-Z])/g, "$1 $2");

      if (index === segments.length - 1) {
        // Last segment should not have a link
        items.push({ title });
      } else {
        items.push({ title, to: currentPath_build });
      }
    });

    return items;
  });

  // Get current page title (last breadcrumb item)
  const currentPageTitle = computed(() => {
    const items = breadcrumbItems.value;
    return items[items.length - 1]?.title || "Home";
  });

  return {
    breadcrumbItems,
    currentPageTitle,
  };
};
