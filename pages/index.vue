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
    <Tabs defaultValue="overview" class="w-full">
      <!-- Top Bar (Tabs Menu & Date Range Picker & Download Button) -->
      <div class="flex items-center justify-between gap-4 pb-4 px-4">
        <div>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="queue">Queue</TabsTrigger>
          </TabsList>
        </div>
        <div class="flex items-center justify-end gap-4">
          <DateRangePicker />
          <Button>Download</Button>
        </div>
      </div>

      <!-- Tabs Content - Konten untuk setiap tab -->
      <TabsContent value="overview">
        <!-- Content Dashboard untuk Overview -->
        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div class="grid auto-rows-min gap-4 md:grid-cols-4">
            <div class="aspect-video rounded-xl bg-muted/50"></div>
            <div class="aspect-video rounded-xl bg-muted/50" />
            <div class="aspect-video rounded-xl bg-muted/50" />
            <div class="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div
            class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"
          />
        </div>
      </TabsContent>

      <TabsContent value="analytics">
        <!-- Content Dashboard untuk Analytics -->
        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                View detailed analytics and metrics for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-4 md:grid-cols-2">
                <div
                  class="aspect-video rounded-xl bg-muted/50 flex items-center justify-center"
                >
                  <span class="text-muted-foreground">Analytics Chart 1</span>
                </div>
                <div
                  class="aspect-video rounded-xl bg-muted/50 flex items-center justify-center"
                >
                  <span class="text-muted-foreground">Analytics Chart 2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="queue">
        <!-- Content Dashboard untuk Queue -->
        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <CardTitle>Queue Management</CardTitle>
              <CardDescription>
                Monitor and manage your application queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="rounded-xl bg-muted/50 p-4">
                  <div class="flex items-center justify-between">
                    <span>Queue Item 1</span>
                    <span class="text-sm text-muted-foreground">Pending</span>
                  </div>
                </div>
                <div class="rounded-xl bg-muted/50 p-4">
                  <div class="flex items-center justify-between">
                    <span>Queue Item 2</span>
                    <span class="text-sm text-muted-foreground"
                      >Processing</span
                    >
                  </div>
                </div>
                <div class="rounded-xl bg-muted/50 p-4">
                  <div class="flex items-center justify-between">
                    <span>Queue Item 3</span>
                    <span class="text-sm text-muted-foreground">Completed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
