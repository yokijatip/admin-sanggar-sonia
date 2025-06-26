<template>
  <div class="container mx-auto">
    <!-- Header -->
    <div class="px-4 mb-6">
      <HeadersContent 
        title="Order Dashboard" 
        description="Monitor order performance and analytics"
      />
    </div>

    <!-- Date Range Filter -->
    <div class="flex items-center gap-4 mb-6 px-4">
      <div class="flex items-center gap-2">
        <Calendar class="h-4 w-4 text-muted-foreground" />
        <Label>Date Range:</Label>
      </div>
      <Select v-model="selectedDateRange" @update:modelValue="updateDateRange">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" @click="refreshData">
        <RefreshCw class="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4">
      <!-- Total Orders -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p class="text-3xl font-bold">{{ metrics.totalOrders }}</p>
              <p class="text-xs text-muted-foreground mt-1">
                <span :class="metrics.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ metrics.ordersGrowth >= 0 ? '+' : '' }}{{ metrics.ordersGrowth }}%
                </span>
                vs last period
              </p>
            </div>
            <ShoppingCart class="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <!-- Total Revenue -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p class="text-3xl font-bold">Rp {{ formatPrice(metrics.totalRevenue) }}</p>
              <p class="text-xs text-muted-foreground mt-1">
                <span :class="metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ metrics.revenueGrowth >= 0 ? '+' : '' }}{{ metrics.revenueGrowth }}%
                </span>
                vs last period
              </p>
            </div>
            <DollarSign class="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <!-- Average Order Value -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Avg Order Value</p>
              <p class="text-3xl font-bold">Rp {{ formatPrice(metrics.avgOrderValue) }}</p>
              <p class="text-xs text-muted-foreground mt-1">
                <span :class="metrics.aovGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ metrics.aovGrowth >= 0 ? '+' : '' }}{{ metrics.aovGrowth }}%
                </span>
                vs last period
              </p>
            </div>
            <TrendingUp class="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <!-- Completion Rate -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <p class="text-3xl font-bold">{{ metrics.completionRate }}%</p>
              <p class="text-xs text-muted-foreground mt-1">
                <span :class="metrics.completionGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ metrics.completionGrowth >= 0 ? '+' : '' }}{{ metrics.completionGrowth }}%
                </span>
                vs last period
              </p>
            </div>
            <CheckCircle class="h-8 w-8 text-emerald-500" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-4">
      <!-- Orders Trend Chart -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <BarChart3 class="mr-2 h-5 w-5" />
            Orders Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-80 flex items-center justify-center bg-gray-50 rounded">
            <!-- Placeholder for Chart -->
            <div class="text-center">
              <BarChart3 class="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p class="text-gray-500">Orders trend chart will be displayed here</p>
              <p class="text-sm text-gray-400">Integration with Chart.js or similar library</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Revenue Trend Chart -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <LineChart class="mr-2 h-5 w-5" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-80 flex items-center justify-center bg-gray-50 rounded">
            <!-- Placeholder for Chart -->
            <div class="text-center">
              <LineChart class="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p class="text-gray-500">Revenue trend chart will be displayed here</p>
              <p class="text-sm text-gray-400">Integration with Chart.js or similar library</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Status Distribution & Top Products -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-4">
      <!-- Order Status Distribution -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <PieChart class="mr-2 h-5 w-5" />
            Order Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="status in statusDistribution" :key="status.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div 
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: status.color }"
                ></div>
                <span class="font-medium capitalize">{{ status.name }}</span>
              </div>
              <div class="text-right">
                <div class="font-bold">{{ status.count }}</div>
                <div class="text-sm text-muted-foreground">{{ status.percentage }}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Top Products -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Award class="mr-2 h-5 w-5" />
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="(product, index) in topProducts" :key="product.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <Badge :variant="index < 3 ? 'default' : 'secondary'" class="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                  {{ index + 1 }}
                </Badge>
                <div>
                  <div class="font-medium">{{ product.name }}</div>
                  <div class="text-sm text-muted-foreground">{{ product.category }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold">{{ product.quantity }} sold</div>
                <div class="text-sm text-muted-foreground">Rp {{ formatPrice(product.revenue) }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Orders & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
      <!-- Recent Orders -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center">
              <Clock class="mr-2 h-5 w-5" />
              Recent Orders
            </CardTitle>
            <Button variant="outline" size="sm" @click="navigateToOrderList">
              View All
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between p-3 border rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-600">
                    {{ order.customer.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <div class="font-medium">{{ order.id }}</div>
                  <div class="text-sm text-muted-foreground">{{ order.customer.name }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-medium">Rp {{ formatPrice(order.total) }}</div>
                <Badge :variant="getStatusVariant(order.status)" class="text-xs">
                  {{ order.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Zap class="mr-2 h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <Button @click="navigateToAddOrder" class="w-full justify-start">
              <Plus class="mr-2 h-4 w-4" />
              Add New Order
            </Button>
            <Button @click="navigateToQueue" variant="outline" class="w-full justify-start">
              <Clock class="mr-2 h-4 w-4" />
              View Queue
            </Button>
            <Button @click="exportData" variant="outline" class="w-full justify-start">
              <Download class="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button @click="showSettings = true" variant="outline" class="w-full justify-start">
              <Settings class="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Settings Modal -->
    <Dialog v-model:open="showSettings">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="refreshInterval">Auto Refresh Interval (minutes)</Label>
            <Select v-model="settings.refreshInterval">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minute</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="0">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox id="notifications" v-model="settings.notifications" />
            <Label for="notifications">Enable notifications</Label>
          </div>
          <div class="flex justify-end space-x-2">
            <Button variant="outline" @click="showSettings = false">Cancel</Button>
            <Button @click="saveSettings">Save Settings</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  RefreshCw,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  CheckCircle,
  BarChart3,
  LineChart,
  PieChart,
  Award,
  Clock,
  ArrowRight,
  Zap,
  Plus,
  Download,
  Settings,
} from "lucide-vue-next";

// State
const selectedDateRange = ref("month");
const showSettings = ref(false);
const refreshInterval = ref(null);

const settings = ref({
  refreshInterval: "5",
  notifications: true
});

// Sample data
const metrics = ref({
  totalOrders: 156,
  ordersGrowth: 12.5,
  totalRevenue: 45231890,
  revenueGrowth: 8.3,
  avgOrderValue: 290076,
  aovGrowth: -2.1,
  completionRate: 94.2,
  completionGrowth: 1.8
});

const statusDistribution = ref([
  { name: "completed", count: 89, percentage: 57, color: "#10b981" },
  { name: "processing", count: 23, percentage: 15, color: "#3b82f6" },
  { name: "queue", count: 31, percentage: 20, color: "#f59e0b" },
  { name: "cancelled", count: 13, percentage: 8, color: "#ef4444" }
]);

const topProducts = ref([
  { id: "P1", name: "Wedding Cake 3 Tier", category: "Custom Cakes", quantity: 12, revenue: 30000000 },
  { id: "P2", name: "Birthday Cake", category: "Regular Cakes", quantity: 28, revenue: 9800000 },
  { id: "P3", name: "Cupcakes", category: "Small Items", quantity: 156, revenue: 7800000 },
  { id: "P4", name: "Donat", category: "Small Items", quantity: 89, revenue: 4450000 },
  { id: "P5", name: "Custom Cake", category: "Custom Cakes", quantity: 8, revenue: 6400000 }
]);

const recentOrders = ref([
  {
    id: "ORD-156",
    customer: { name: "Siti Aminah" },
    total: 2500000,
    status: "processing",
    createdAt: "2024-01-17T10:30:00Z"
  },
  {
    id: "ORD-155",
    customer: { name: "Budi Santoso" },
    total: 350000,
    status: "completed",
    createdAt: "2024-01-17T09:15:00Z"
  },
  {
    id: "ORD-154",
    customer: { name: "Maya Sari" },
    total: 120000,
    status: "queue",
    createdAt: "2024-01-17T08:45:00Z"
  },
  {
    id: "ORD-153",
    customer: { name: "Ahmad Rizki" },
    total: 800000,
    status: "shipped",
    createdAt: "2024-01-16T16:20:00Z"
  }
]);

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const getStatusVariant = (status) => {
  switch (status) {
    case "completed": return "default";
    case "processing": return "secondary";
    case "queue": return "outline";
    case "shipped": return "outline";
    case "cancelled": return "destructive";
    default: return "secondary";
  }
};

const updateDateRange = () => {
  // Simulate data refresh based on date range
  console.log("Updating data for range:", selectedDateRange.value);
  refreshData();
};

const refreshData = () => {
  // Simulate API call to refresh dashboard data
  console.log("Refreshing dashboard data...");
  // In real implementation, this would fetch fresh data from Firebase
};

const navigateToOrderList = () => {
  console.log("Navigate to order list");
};

const navigateToAddOrder = () => {
  console.log("Navigate to add order");
};

const navigateToQueue = () => {
  console.log("Navigate to queue");
};

const exportData = () => {
  console.log("Export dashboard data");
  // Implement CSV/Excel export functionality
};

const saveSettings = () => {
  // Save settings to localStorage or user preferences
  localStorage.setItem('dashboardSettings', JSON.stringify(settings.value));
  showSettings.value = false;
  
  // Setup auto refresh if enabled
  setupAutoRefresh();
};

const setupAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
  
  if (settings.value.refreshInterval !== "0") {
    const interval = parseInt(settings.value.refreshInterval) * 60 * 1000;
    refreshInterval.value = setInterval(refreshData, interval);
  }
};

// Lifecycle
onMounted(() => {
  // Load saved settings
  const savedSettings = localStorage.getItem('dashboardSettings');
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings);
  }
  
  setupAutoRefresh();
  refreshData();
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});
</script>

<style scoped>
/* Custom styles for dashboard */
</style>