<!-- components/DynamicBreadcrumb.vue -->
<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/composables/useBreadcrumb";

// Props untuk custom breadcrumb jika diperlukan
interface Props {
  customBreadcrumb?: Array<{
    title: string;
    to?: string;
    icon?: any;
  }>;
  showIcons?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showIcons: false,
});

// Use breadcrumb composable
const { breadcrumbItems } = useBreadcrumb();

// Use custom breadcrumb if provided, otherwise use generated one
const displayBreadcrumb = computed(() => {
  return props.customBreadcrumb || breadcrumbItems.value;
});
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template
        v-for="(item, index) in displayBreadcrumb"
        :key="`breadcrumb-${index}`"
      >
        <BreadcrumbItem :class="{ 'hidden md:block': index === 0 }">
          <!-- If it's the last item, show as page (no link) -->
          <BreadcrumbPage v-if="index === displayBreadcrumb.length - 1">
            <div class="flex items-center gap-2">
              <component
                :is="item.icon"
                v-if="item.icon && showIcons"
                class="h-4 w-4"
              />
              {{ item.title }}
            </div>
          </BreadcrumbPage>

          <!-- Otherwise, show as link -->
          <BreadcrumbLink
            v-else
            :to="item.to"
            class="hover:text-foreground cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <component
                :is="item.icon"
                v-if="item.icon && showIcons"
                class="h-4 w-4"
              />
              {{ item.title }}
            </div>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <!-- Show separator if not the last item -->
        <BreadcrumbSeparator
          v-if="index < displayBreadcrumb.length - 1"
          :class="{ 'hidden md:block': index === 0 }"
        />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
