<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateRangePicker from "@/components/DateRangePicker.vue";
</script>

<template>
  <div>
    <!-- Top Bar (Tabs Menu & Date Range Picker & Download Button) -->
    <div>
      <DateRangePicker />
    </div>

    <!-- Content Dashboard -->
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="grid auto-rows-min gap-4 md:grid-cols-4">
        <div class="aspect-video rounded-xl bg-muted/50"></div>
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  </div>
</template>
