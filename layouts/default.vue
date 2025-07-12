<!-- layouts/default.vue -->
<script lang="ts">
export const description = "An inset sidebar with secondary navigation.";
export const iframeHeight = "800px";
</script>

<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb.vue";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useBreadcrumb } from "@/composables/useBreadcrumb";

// Get current page title from breadcrumb
const { currentPageTitle } = useBreadcrumb();

// Optional: You can also use this for dynamic page titles
useHead({
  title: currentPageTitle,
});
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="max-w-screen overflow-hidden">
      <header class="flex h-16 shrink-0 items-center gap-2">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <!-- Use dynamic breadcrumb component -->
          <DynamicBreadcrumb />
        </div>
      </header>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
