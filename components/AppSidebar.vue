<script setup lang="ts">
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Package2,
  Users,
  LogOut,
  ShoppingBasket,
} from "lucide-vue-next";

import NavMain from "@/components/NavMain.vue";
import NavProjects from "@/components/NavProjects.vue";
import NavSecondary from "@/components/NavSecondary.vue";
import NavUser from "@/components/NavUser.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarProps,
} from "@/components/ui/sidebar";

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: "inset",
});

const data = {
  user: {
    name: "Yoki Jati Perkasa",
    email: "yokijati@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Products",
      url: "/products/productDashboard",
      icon: Package2,
      isActive: true,
      items: [
        {
          title: "List Products",
          url: "/products/listProducts",
        },
        {
          title: "Add Product",
          url: "/products/addProduct",
        },
        {
          title: "Inventory",
          url: "/products/inventory",
        },
      ],
    },
    {
      title: "Orders",
      url: "/orders/orderDashboard",
      icon: ShoppingBasket,
      items: [
        {
          title: "List Orders",
          url: "/orders/listOrder",
        },
        {
          title: "Add Order",
          url: "/orders/addOrder",
        },
        {
          title: "History Order",
          url: "/orders/historyOrder",
        },
        {
          title: "Queue Order",
          url: "/orders/queueOrderProcess",
        },
        {
          title: "Tracking Order",
          url: "/orders/trackingOrder",
        },
      ],
    },
    {
      title: "Customers",
      url: "/customers/customerDashboard",
      icon: Users,
      items: [
        {
          title: "List Customer",
          url: "/customers/listCustomer",
        },
        {
          title: "Add Customer",
          url: "/customers/addCustomer",
        },
        {
          title: "History Customer",
          url: "/customers/orderHistoryPerCustomer",
        },
        {
          title: "Customer Loyalty",
          url: "/customers/customerLoyalty",
        },
        {
          title: "Customer Information",
          url: "/customers/customerInformation",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/projects/design",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/projects/marketing",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/projects/travel",
      icon: Map,
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <NuxtLink to="/">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">Acme Inc</span>
                <span class="truncate text-xs">Enterprise</span>
              </div>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <NavProjects :projects="data.projects" />
      <NavSecondary :items="data.navSecondary" class="mt-auto" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
