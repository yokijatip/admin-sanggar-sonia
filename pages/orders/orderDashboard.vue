<template>
  <div class="container mx-auto min-w-full">
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
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Total Orders </CardTitle>
          <ShoppingCart />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">{{ metrics.totalOrders }}</div>
          <p class="text-xs text-muted-foreground">
            <span
              :class="
                metrics.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              "
            >
              {{ metrics.ordersGrowth >= 0 ? "+" : ""
              }}{{ metrics.ordersGrowth }}%
            </span>
            vs last period
          </p>
        </CardContent>
      </Card>

      <!-- Total Revenue -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Total Revenue </CardTitle>
          <DollarSign class="text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">
            Rp {{ formatPrice(metrics.totalRevenue) }}
          </div>
          <p class="text-xs text-muted-foreground">
            <span
              :class="
                metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              "
            >
              {{ metrics.revenueGrowth >= 0 ? "+" : ""
              }}{{ metrics.revenueGrowth }}%
            </span>
            vs last period
          </p>
        </CardContent>
      </Card>

      <!-- Average Order Value -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Avg Order Value </CardTitle>
          <TrendingUp class="text-purple-500" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">
            Rp {{ formatPrice(metrics.avgOrderValue) }}
          </div>
          <p class="text-xs text-muted-foreground">
            <span
              :class="
                metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              "
            >
              {{ metrics.revenueGrowth >= 0 ? "+" : ""
              }}{{ metrics.revenueGrowth }}%
            </span>
            vs last period
          </p>
        </CardContent>
      </Card>

      <!-- Completion Rate -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Completion Rate </CardTitle>
          <CheckCircle class="text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">{{ metrics.completionRate }}%</div>
          <p class="text-xs text-muted-foreground">
            <span
              :class="
                metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              "
            >
              {{ metrics.revenueGrowth >= 0 ? "+" : ""
              }}{{ metrics.revenueGrowth }}%
            </span>
            vs last period
          </p>
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
              <p class="text-gray-500">
                Orders trend chart will be displayed here
              </p>
              <p class="text-sm text-gray-400">
                Integration with Chart.js or similar library
              </p>
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
              <p class="text-gray-500">
                Revenue trend chart will be displayed here
              </p>
              <p class="text-sm text-gray-400">
                Integration with Chart.js or similar library
              </p>
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
            <div
              v-for="status in statusDistribution"
              :key="status.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: status.color }"
                ></div>
                <span class="font-medium capitalize">{{ status.name }}</span>
              </div>
              <div class="text-right">
                <div class="font-bold">{{ status.count }}</div>
                <div class="text-sm text-muted-foreground">
                  {{ status.percentage }}%
                </div>
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
            <div
              v-for="(product, index) in topProducts"
              :key="product.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <Badge
                  :variant="index < 3 ? 'default' : 'secondary'"
                  class="w-6 h-6 rounded-full p-0 flex items-center justify-center"
                >
                  {{ index + 1 }}
                </Badge>
                <div>
                  <div class="font-medium">{{ product.name }}</div>
                  <div class="text-sm text-muted-foreground">
                    {{ product.category }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold">{{ product.quantity }} sold</div>
                <div class="text-sm text-muted-foreground">
                  Rp {{ formatPrice(product.revenue) }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Orders & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-4">
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
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="flex items-center justify-between p-3 border rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-gray-600">
                    {{ order.customer.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <div class="font-medium">{{ order.id }}</div>
                  <div class="text-sm text-muted-foreground">
                    {{ order.customer.name }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-medium">Rp {{ formatPrice(order.total) }}</div>
                <Badge
                  :variant="getStatusVariant(order.status)"
                  class="text-xs"
                >
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
            <Button
              @click="navigateToQueue"
              variant="outline"
              class="w-full justify-start"
            >
              <Clock class="mr-2 h-4 w-4" />
              View Queue
            </Button>
            <Button
              @click="exportData"
              variant="outline"
              class="w-full justify-start"
            >
              <Download class="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button
              @click="showSettings = true"
              variant="outline"
              class="w-full justify-start"
            >
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
            <Button variant="outline" @click="showSettings = false"
              >Cancel</Button
            >
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
// Firebase imports - menggunakan struktur yang sama dengan history orders
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

import { useNuxtApp } from "#app";
import { navigateTo } from "#app";

// Firebase Instance - menggunakan struktur yang sama
const { $firebase } = useNuxtApp();

definePageMeta({
  middleware: "auth",
});

// State
const selectedDateRange = ref("month");
const showSettings = ref(false);
const refreshInterval = ref(null);
const isLoading = ref(false);
const error = ref(null);

const settings = ref({
  refreshInterval: "5",
  notifications: true,
});

// Reactive data
const metrics = ref({
  totalOrders: 0,
  ordersGrowth: 0,
  totalRevenue: 0,
  revenueGrowth: 0,
  avgOrderValue: 0,
  aovGrowth: 0,
  completionRate: 0,
  completionGrowth: 0,
});

const statusDistribution = ref([]);
const topProducts = ref([]);
const recentOrders = ref([]);

// Date range helpers
const getDateRange = (range) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (range) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      return {
        start: weekStart,
        end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      };
    case 'month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 1)
      };
    case 'quarter':
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      return {
        start: quarterStart,
        end: new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 1)
      };
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear() + 1, 0, 1)
      };
    default:
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 1)
      };
  }
};

const getPreviousDateRange = (range) => {
  const current = getDateRange(range);
  const duration = current.end.getTime() - current.start.getTime();
  
  return {
    start: new Date(current.start.getTime() - duration),
    end: current.start
  };
};

// Firebase data fetching functions - menggunakan struktur yang sama dengan history orders
const fetchOrders = async (dateRange, statusFilter = null) => {
  try {
    const ordersCollection = collection($firebase.firestore, "orders");
    
    let ordersQuery;
    if (statusFilter) {
      ordersQuery = query(
        ordersCollection,
        where("status", "==", statusFilter)
      );
    } else {
      ordersQuery = query(ordersCollection);
    }
    
    const querySnapshot = await getDocs(ordersQuery);
    
    // Map data dari Firebase ke format yang dibutuhkan
    const orders = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        customer: {
          name: data.customerName || "",
          email: data.customerEmail || "",
          type: data.customerType || "regular",
        },
        products: data.products || [],
        total: data.subtotal || 0,
        subtotal: data.subtotal || 0,
        tax: data.tax || 0,
        orderDate: data.createdAt,
        processingStarted: data.processingStarted || data.createdAt,
        completionDate: data.updatedAt || data.createdAt,
        duration: data.duration || 0,
        status: data.status,
        notes: data.notes || "",
        shippingAddress: data.shippingAddress || "",
        shippingCost: data.shippingCost || 0,
        createdAt: data.createdAt,
      };
    });
    
    // Filter berdasarkan date range
    const filteredOrders = orders.filter(order => {
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return orderDate >= dateRange.start && orderDate < dateRange.end;
    });
    
    // Sort secara manual di client side
    return filteredOrders.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA; // Descending order (terbaru ke terlama)
    });
    
  } catch (err) {
    console.error('Error fetching orders:', err);
    throw err;
  }
};

const fetchRecentOrders = async () => {
  try {
    const ordersCollection = collection($firebase.firestore, "orders");
    const ordersQuery = query(ordersCollection);
    
    const querySnapshot = await getDocs(ordersQuery);
    
    const orders = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        customer: {
          name: data.customerName || "",
          email: data.customerEmail || "",
        },
        total: data.subtotal || 0,
        status: data.status,
        createdAt: data.createdAt,
      };
    });
    
    // Sort dan ambil 4 terbaru
    return orders
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      })
      .slice(0, 4);
      
  } catch (err) {
    console.error('Error fetching recent orders:', err);
    throw err;
  }
};

// Data processing functions
const calculateMetrics = (currentOrders, previousOrders) => {
  const currentTotal = currentOrders.length;
  const previousTotal = previousOrders.length;
  
  const currentRevenue = currentOrders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
  const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
  
  const completedOrders = currentOrders.filter(order => order.status === 'complete' || order.status === 'completed');
  const completionRate = currentTotal > 0 ? (completedOrders.length / currentTotal) * 100 : 0;
  
  const previousCompletedOrders = previousOrders.filter(order => order.status === 'complete' || order.status === 'completed');
  const previousCompletionRate = previousTotal > 0 ? (previousCompletedOrders.length / previousTotal) * 100 : 0;
  
  const avgOrderValue = currentTotal > 0 ? currentRevenue / currentTotal : 0;
  const previousAvgOrderValue = previousTotal > 0 ? previousRevenue / previousTotal : 0;
  
  return {
    totalOrders: currentTotal,
    ordersGrowth: previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1) : 0,
    totalRevenue: currentRevenue,
    revenueGrowth: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 0,
    avgOrderValue: avgOrderValue,
    aovGrowth: previousAvgOrderValue > 0 ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue * 100).toFixed(1) : 0,
    completionRate: completionRate.toFixed(1),
    completionGrowth: previousCompletionRate > 0 ? ((completionRate - previousCompletionRate) / previousCompletionRate * 100).toFixed(1) : 0,
  };
};

const calculateStatusDistribution = (orders) => {
  const statusCounts = {};
  const statusColors = {
    complete: '#10b981',
    completed: '#10b981',
    processing: '#3b82f6',
    queue: '#f59e0b',
    cancelled: '#ef4444',
    refunded: '#8b5cf6'
  };
  
  orders.forEach(order => {
    const status = order.status || 'unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  const total = orders.length;
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    color: statusColors[status] || '#6b7280'
  }));
};

const calculateTopProducts = (orders) => {
  const productStats = {};
  
  orders.forEach(order => {
    if (order.products && Array.isArray(order.products)) {
      order.products.forEach(item => {
        const key = item.id || item.name || 'Unknown Product';
        if (!productStats[key]) {
          productStats[key] = {
            id: item.id || key,
            name: item.name || key,
            category: item.category || 'Uncategorized',
            quantity: 0,
            revenue: 0
          };
        }
        productStats[key].quantity += item.quantity || 1;
        productStats[key].revenue += (item.price || 0) * (item.quantity || 1);
      });
    }
  });
  
  return Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

// Main data refresh function
const refreshData = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const currentRange = getDateRange(selectedDateRange.value);
    const previousRange = getPreviousDateRange(selectedDateRange.value);
    
    // Fetch current and previous period data
    const [currentOrders, previousOrders, recent] = await Promise.all([
      fetchOrders(currentRange),
      fetchOrders(previousRange),
      fetchRecentOrders()
    ]);
    
    // Calculate metrics
    metrics.value = calculateMetrics(currentOrders, previousOrders);
    
    // Calculate distributions
    statusDistribution.value = calculateStatusDistribution(currentOrders);
    topProducts.value = calculateTopProducts(currentOrders);
    recentOrders.value = recent;
    
  } catch (err) {
    error.value = err.message;
    console.error('Error refreshing dashboard data:', err);
  } finally {
    isLoading.value = false;
  }
};

// Utility methods
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const getStatusVariant = (status) => {
  switch (status) {
    case "complete":
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "queue":
      return "outline";
    case "cancelled":
      return "destructive";
    case "refunded":
      return "secondary";
    default:
      return "secondary";
  }
};

const updateDateRange = () => {
  refreshData();
};

const navigateToOrderList = () => {
  navigateTo('/orders/historyOrder');
};

const navigateToAddOrder = () => {
  navigateTo('/orders/addOrder');
};

const navigateToQueue = () => {
  navigateTo('/orders/queueOrderProcess');
};

const exportData = () => {
  console.log("Export dashboard data");
};

const saveSettings = () => {
  localStorage.setItem("dashboardSettings", JSON.stringify(settings.value));
  showSettings.value = false;
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
  const savedSettings = localStorage.getItem("dashboardSettings");
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
