<template>
  <div class="min-h-screen bg-background p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <HeadersContent
        title="Product Dashboard"
        description="Monitor and manage your products"
      />

      <!-- Quick Actions -->
      <div class="flex justify-between gap-3">
        <div class="flex gap-2">
          <Button variant="outline" class="gap-2">
            <Download class="h-4 w-4" />
            Export Data
          </Button>
          <Button class="gap-2">
            <Package class="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">Total Products</CardTitle>
            <Package class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.totalProducts }}</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">Active Products</CardTitle>
            <ShoppingCart class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.activeProducts }}</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.lowStockItems }}</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-red-600">+3</span> requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              Rp {{ formatCurrency(stats.totalRevenue) }}
            </div>
            <p class="text-xs text-muted-foreground">
              <span class="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Charts and Categories Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sales Overview Chart -->
        <Card class="lg:col-span-2">
          <CardHeader>
            <div class="flex justify-between items-center">
              <div>
                <CardTitle>Sales Overview</CardTitle>
                <p class="text-sm text-muted-foreground">
                  Monthly sales performance
                </p>
              </div>
              <Select>
                <SelectTrigger class="w-40">
                  <SelectValue placeholder="Last 6 months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                  <SelectItem value="12months">Last 12 months</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div class="h-64 flex items-end justify-between gap-2">
              <div
                v-for="(value, index) in chartData"
                :key="index"
                class="flex flex-col items-center flex-1"
              >
                <div
                  class="w-full bg-primary rounded-t-sm transition-all duration-300 hover:opacity-80"
                  :style="{
                    height: `${(value / Math.max(...chartData)) * 200}px`,
                  }"
                ></div>
                <span class="text-xs text-muted-foreground mt-2">{{
                  months[index]
                }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Top Categories -->
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="category in topCategories"
                :key="category.name"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: category.color }"
                  ></div>
                  <span class="text-sm font-medium">{{ category.name }}</span>
                </div>
                <div class="text-right">
                  <div class="text-sm font-bold">{{ category.count }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ category.percentage }}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Recent Activity & Top Products -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <Card>
          <CardHeader class="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm"> View all </Button>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start gap-3"
              >
                <div class="p-2 rounded-lg" :class="activity.iconBg">
                  <component
                    :is="activity.icon"
                    class="w-4 h-4"
                    :class="activity.iconColor"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium">{{ activity.title }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ activity.description }}
                  </p>
                  <p class="text-xs text-muted-foreground mt-1">
                    {{ activity.time }}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Top Products -->
        <Card>
          <CardHeader class="flex flex-row items-center justify-between">
            <CardTitle>Top Products</CardTitle>
            <Button variant="ghost" size="sm"> View all </Button>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="product in topProducts"
                :key="product.id"
                class="flex items-center gap-4"
              >
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ product.name }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ product.sales }} sales
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold">
                    Rp {{ formatCurrency(product.revenue) }}
                  </p>
                  <Badge variant="secondary" class="text-xs">
                    +{{ product.growth }}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Inventory Alerts -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2">
              <AlertTriangle class="h-5 w-5 text-destructive" />
              Inventory Alerts
            </CardTitle>
          </div>
          <Badge variant="destructive">
            {{ inventoryAlerts.length }} alerts
          </Badge>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <!-- Search and Filter -->
            <div class="flex gap-4">
              <div class="relative flex-1">
                <Search
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                />
                <Input
                  placeholder="Search products..."
                  class="pl-10"
                  v-model="searchQuery"
                />
              </div>
              <Select>
                <SelectTrigger class="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Alerts Table -->
            <div class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="alert in filteredAlerts" :key="alert.id">
                    <TableCell>
                      <div class="flex items-center gap-3">
                        <img
                          :src="alert.image"
                          :alt="alert.name"
                          class="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p class="font-medium">{{ alert.name }}</p>
                          <p class="text-sm text-muted-foreground">
                            SKU: {{ alert.sku }}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{{ alert.category }}</TableCell>
                    <TableCell>
                      <span class="font-medium">{{ alert.currentStock }}</span>
                    </TableCell>
                    <TableCell>{{ alert.minStock }}</TableCell>
                    <TableCell>
                      <Badge
                        :variant="
                          alert.status === 'Out of Stock'
                            ? 'destructive'
                            : 'secondary'
                        "
                      >
                        {{ alert.status }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div class="flex items-center gap-2">
                        <Button size="sm" variant="outline" class="gap-1">
                          <History class="h-3 w-3" />
                          Restock
                        </Button>
                        <Button size="sm" variant="ghost" class="gap-1">
                          <Edit class="h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between">
              <p class="text-sm text-muted-foreground">
                Showing {{ filteredAlerts.length }} of
                {{ inventoryAlerts.length }} alerts
              </p>
              <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft class="h-4 w-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                  <ChevronRight class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Search,
  Download,
  Edit,
  History,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  TrendingUp,
} from "lucide-vue-next";
import HeadersContent from "~/components/ui/HeadersContent.vue";

// Search functionality
const searchQuery = ref("");

// Stats data
const stats = ref({
  totalProducts: 1247,
  activeProducts: 1156,
  lowStockItems: 23,
  totalRevenue: 45750000,
});

// Chart data
const chartData = ref([120, 150, 180, 220, 160, 190]);
const months = ref(["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);

// Top categories
const topCategories = ref([
  {
    name: "Electronics",
    count: 342,
    percentage: 28,
    color: "hsl(var(--primary))",
  },
  { name: "Clothing", count: 298, percentage: 24, color: "#10B981" },
  { name: "Books", count: 187, percentage: 15, color: "#F59E0B" },
  { name: "Home & Garden", count: 156, percentage: 13, color: "#EF4444" },
  { name: "Sports", count: 134, percentage: 11, color: "#8B5CF6" },
]);

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    title: "New product added",
    description: "iPhone 15 Pro Max added to Electronics category",
    time: "2 minutes ago",
    icon: Plus,
    iconBg: "bg-green-50 dark:bg-green-950",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    id: 2,
    title: "Stock updated",
    description: "Samsung Galaxy S24 stock increased by 50 units",
    time: "15 minutes ago",
    icon: RefreshCw,
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: 3,
    title: "Low stock alert",
    description: "Nike Air Max 270 is running low on stock",
    time: "1 hour ago",
    icon: AlertTriangle,
    iconBg: "bg-yellow-50 dark:bg-yellow-950",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: 4,
    title: "Sales milestone",
    description: "MacBook Pro M3 reached 100 sales this month",
    time: "2 hours ago",
    icon: TrendingUp,
    iconBg: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
]);

// Top products
const topProducts = ref([
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    sales: 156,
    revenue: 24000000,
    growth: 12,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    sales: 134,
    revenue: 18500000,
    growth: 8,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 3,
    name: "MacBook Pro M3",
    sales: 89,
    revenue: 22750000,
    growth: 15,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 4,
    name: "AirPods Pro",
    sales: 267,
    revenue: 8500000,
    growth: 22,
    image:
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=100&h=100&fit=crop&crop=center",
  },
]);

// Inventory alerts
const inventoryAlerts = ref([
  {
    id: 1,
    name: "Nike Air Max 270",
    sku: "NK-AM270-BLK",
    category: "Footwear",
    currentStock: 5,
    minStock: 20,
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 2,
    name: "Sony WH-1000XM4",
    sku: "SN-WH1000XM4",
    category: "Electronics",
    currentStock: 0,
    minStock: 15,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 3,
    name: "Adidas Ultraboost 22",
    sku: "AD-UB22-WHT",
    category: "Footwear",
    currentStock: 8,
    minStock: 25,
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 4,
    name: "Dell XPS 13",
    sku: "DL-XPS13-SLV",
    category: "Electronics",
    currentStock: 0,
    minStock: 10,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: 5,
    name: "Canon EOS R5",
    sku: "CN-EOSR5-BLK",
    category: "Electronics",
    currentStock: 3,
    minStock: 12,
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=100&h=100&fit=crop&crop=center",
  },
]);

// Computed property for filtered alerts
const filteredAlerts = computed(() => {
  if (!searchQuery.value) {
    return inventoryAlerts.value;
  }

  return inventoryAlerts.value.filter(
    (alert) =>
      alert.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      alert.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      alert.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID").format(amount);
};
</script>

<style></style>
