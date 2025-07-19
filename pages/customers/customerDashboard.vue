<template>
  <div class="container mx-auto min-w-full">
    <!-- Header -->
    <div class="px-4 mb-6">
      <HeadersContent
        title="Customer Dashboard"
        description="Monitor customer analytics and insights"
      />
    </div>
    <!-- Date Range Filter -->
    <div class="flex items-center gap-4 mb-6 px-4">
      <div class="flex items-center gap-2">
        <Calendar class="h-4 w-4 text-muted-foreground" />
        <Label>Analysis Period:</Label>
      </div>
      <Select v-model="selectedPeriod" @update:modelValue="updatePeriod">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
          <!-- If custom range di klik maka muncul toast, tapi nanti di ganti dengan rentang kalendar -->
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" @click="refreshData" :disabled="loadingData">
        <Loader2 v-if="loadingData" class="animate-spin h-4 w-4 mr-2" />
        <RefreshCw v-else class="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4">
      <!-- Total Customers -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Total Customer </CardTitle>
          <Users class="" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">{{ metrics.totalCustomers }}</div>
          <p class="text-xs text-muted-foreground mt-1">
            <!-- Growth metrics removed for simplicity, as they require historical data not easily available from single fetch -->
            Total customers in selected period
          </p>
        </CardContent>
      </Card>
      <!-- New Customers -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> New Customer </CardTitle>
          <UserPlus class="text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">{{ metrics.newCustomers }}</div>
          <p class="text-xs text-muted-foreground mt-1">
            New customers in selected period
          </p>
        </CardContent>
      </Card>
      <!-- VIP Customers -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> VIP Customer </CardTitle>
          <Crown class="text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">{{ metrics.vipCustomers }}</div>
          <p class="text-xs text-muted-foreground mt-1">
            {{
              ((metrics.vipCustomers / metrics.totalCustomers) * 100).toFixed(
                1
              )
            }}% of total
          </p>
        </CardContent>
      </Card>
      <!-- Average Customer Lifetime Value -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Average CLV </CardTitle>
          <TrendingUp class="" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">
            Rp {{ formatPrice(metrics.avgCLV) }}
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            Average lifetime value
          </p>
        </CardContent>
      </Card>
    </div>
    <!-- Customer Segmentation & Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-4">
      <!-- Customer Segmentation -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <PieChart class="mr-2 h-5 w-5" />
            Customer Segmentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="segment in customerSegments"
              :key="segment.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: segment.color }"
                ></div>
                <div>
                  <span class="font-medium">{{ segment.name }}</span>
                  <p class="text-sm text-muted-foreground">
                    {{ segment.description }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold">{{ segment.count }}</div>
                <div class="text-sm text-muted-foreground">
                  {{ segment.percentage }}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <!-- Customer Activity -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Activity class="mr-2 h-5 w-5" />
            Customer Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 bg-green-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="font-medium">Active (Last 30 days)</span>
              </div>
              <div class="text-right">
                <div class="font-bold text-green-700">
                  {{ activityStats.active }}
                </div>
                <div class="text-sm text-green-600">
                  {{ activityStats.activePercentage }}%
                </div>
              </div>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="font-medium">Inactive (30-90 days)</span>
              </div>
              <div class="text-right">
                <div class="font-bold text-yellow-700">
                  {{ activityStats.inactive }}
                </div>
                <div class="text-sm text-yellow-600">
                  {{ activityStats.inactivePercentage }}%
                </div>
              </div>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="font-medium">At Risk (90+ days)</span>
              </div>
              <div class="text-right">
                <div class="font-bold text-red-700">
                  {{ activityStats.atRisk }}
                </div>
                <div class="text-sm text-red-600">
                  {{ activityStats.atRiskPercentage }}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <!-- Top Customers & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-4">
      <!-- Top Customers by Value -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center">
              <Award class="mr-2 h-5 w-5" />
              Top Customers by Value
            </CardTitle>
            <Button variant="outline" size="sm" @click="navigateToCustomerList">
              View All
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="(customer, index) in topCustomers"
              :key="customer.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <Badge
                  :variant="index < 3 ? 'default' : 'secondary'"
                  class="w-6 h-6 rounded-full p-0 flex items-center justify-center"
                >
                  {{ index + 1 }}
                </Badge>
                <div
                  class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-gray-600">
                    {{ customer.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <div class="font-medium">{{ customer.name }}</div>
                  <div class="text-sm text-muted-foreground flex items-center">
                    {{ customer.email }}
                    <Crown
                      v-if="customer.type === 'vip'"
                      class="ml-2 h-3 w-3 text-yellow-500"
                    />
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold">
                  Rp {{ formatPrice(customer.totalSpent) }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ customer.orderCount }} orders
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <!-- Recent Customer Activity -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Clock class="mr-2 h-5 w-5" />
            Recent Customer Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-start space-x-3 p-3 border rounded-lg"
            >
              <div
                class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-xs font-medium text-gray-600">
                  {{ activity.customer.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <span class="font-medium">{{ activity.customer }}</span>
                  <Badge
                    :variant="getActivityVariant(activity.type)"
                    class="text-xs"
                  >
                    {{ activity.type }}
                  </Badge>
                </div>
                <p class="text-sm text-muted-foreground">
                  {{ activity.description }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ formatRelativeTime(activity.timestamp) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <!-- Customer Insights & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 mb-4">
      <!-- Customer Insights -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle class="flex items-center">
            <Brain class="mr-2 h-5 w-5" />
            Customer Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <TrendingUp class="h-5 w-5 text-blue-600" />
                <span class="font-medium text-blue-900">Growth Trend</span>
              </div>
              <p class="text-sm text-blue-700">
                Customer acquisition is up 15% this month, with strong retention
                rates among VIP customers.
              </p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <Target class="h-5 w-5 text-green-600" />
                <span class="font-medium text-green-900">Opportunity</span>
              </div>
              <p class="text-sm text-green-700">
                {{ metrics.customersNearVIP }} customers are close to VIP status. Consider targeted
                promotions to boost their spending.
              </p>
            </div>
            <div class="p-4 bg-yellow-50 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <AlertTriangle class="h-5 w-5 text-yellow-600" />
                <span class="font-medium text-yellow-900">At Risk</span>
              </div>
              <p class="text-sm text-yellow-700">
                {{ activityStats.atRisk }} VIP customers haven't ordered in 60+ days. Implement
                re-engagement campaigns.
              </p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <Heart class="h-5 w-5 text-purple-600" />
                <span class="font-medium text-purple-900">Loyalty</span>
              </div>
              <p class="text-sm text-purple-700">
                Average customer lifespan is 18 months with 4.2 orders per
                customer.
              </p>
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
            <Button @click="navigateToAddCustomer" class="w-full justify-start">
              <UserPlus class="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
            <Button
              @click="exportCustomerData"
              variant="outline"
              class="w-full justify-start"
            >
              <Download class="mr-2 h-4 w-4" />
              Export Customer Data
            </Button>
            <Button
              @click="sendBulkEmail"
              variant="outline"
              class="w-full justify-start"
            >
              <Mail class="mr-2 h-4 w-4" />
              Send Bulk Email
            </Button>
            <Button
              @click="createSegment"
              variant="outline"
              class="w-full justify-start"
            >
              <Users class="mr-2 h-4 w-4" />
              Create Segment
            </Button>
            <Button
              @click="viewAnalytics"
              variant="outline"
              class="w-full justify-start"
            >
              <BarChart3 class="mr-2 h-4 w-4" />
              Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, reactive, computed, onMounted} from "vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  RefreshCw,
  Users,
  UserPlus,
  Crown,
  TrendingUp,
  PieChart,
  Activity,
  Award,
  ArrowRight,
  Clock,
  Brain,
  Target,
  AlertTriangle,
  Heart,
  Zap,
  Download,
  Mail,
  BarChart3,
  Loader2,
} from "lucide-vue-next";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useNuxtApp } from "#app";

definePageMeta({
  middleware: "auth",
});

// Firebase Instance
const { $firebase } = useNuxtApp();

// Reactive data
const allCustomersData = ref([]);
const allOrdersData = ref([]);
const loadingData = ref(true);
const selectedPeriod = ref("month");

// Reactive metrics and segments (will be populated by fetchData)
const metrics = reactive({
  totalCustomers: 0,
  newCustomers: 0,
  vipCustomers: 0,
  avgCLV: 0,
  customersNearVIP: 0, // New metric for insights
});

const customerSegments = reactive([
  {
    name: "VIP Customers",
    description: "High-value repeat customers",
    count: 0,
    percentage: 0,
    color: "#fbbf24",
  },
  {
    name: "Regular Customers",
    description: "Consistent buyers",
    count: 0,
    percentage: 0,
    color: "#3b82f6",
  },
  {
    name: "New Customers",
    description: "First-time buyers",
    count: 0,
    percentage: 0,
    color: "#10b981",
  },
  {
    name: "Inactive Customers",
    description: "No recent activity",
    count: 0,
    percentage: 0,
    color: "#ef4444",
  },
]);

const activityStats = reactive({
  active: 0,
  activePercentage: 0,
  inactive: 0,
  inactivePercentage: 0,
  atRisk: 0,
  atRiskPercentage: 0,
});

const topCustomers = ref([]);
const recentActivity = ref([]);

// Helper functions
const formatPrice = (price) => {
  if (typeof price !== 'number') return "0";
  return new Intl.NumberFormat("id-ID").format(price);
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "N/A";
  let date;
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (typeof timestamp === "string" || typeof timestamp === "number") {
    date = new Date(timestamp);
  } else {
    date = new Date(); // Fallback
  }

  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const getActivityVariant = (type) => {
  switch (type) {
    case "order":
      return "default";
    case "registration":
      return "secondary";
    case "vip_upgrade":
      return "outline";
    case "review":
      return "outline";
    default:
      return "secondary";
  }
};

// Main data fetching and processing function
const fetchData = async () => {
  loadingData.value = true;
  try {
    const db = $firebase.firestore;

    // 1. Fetch Customers
    const customersCollection = collection(db, "customers");
    const customersQuery = query(customersCollection, orderBy("createdAt", "desc"));
    const customersSnapshot = await getDocs(customersQuery);
    allCustomersData.value = customersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(), // Convert Timestamp to Date
      lastOrderDate: doc.data().lastOrderDate?.toDate(), // Convert Timestamp to Date
    }));

    // 2. Fetch Orders (for recent activity and potentially CLV if not pre-calculated on customer doc)
    const ordersCollection = collection(db, "orderHistory");
    // Fetch recent orders, e.g., last 100 or orders from the last 90 days
    const ninetyDaysAgo = Timestamp.fromDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
    const ordersQuery = query(
      ordersCollection,
      where("createdAt", ">=", ninetyDaysAgo), // Filter for recent orders
      orderBy("createdAt", "desc")
    );
    const ordersSnapshot = await getDocs(ordersQuery);
    allOrdersData.value = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      orderDate: doc.data().orderDate?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    }));

    calculateDashboardMetrics();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Optionally show a toast or alert to the user
  } finally {
    loadingData.value = false;
  }
};

// Function to calculate all dashboard metrics
const calculateDashboardMetrics = () => {
  const customers = allCustomersData.value;
  const orders = allOrdersData.value;
  const now = new Date();

  // Filter customers based on selectedPeriod for metrics
  let customersInPeriod = customers;
  if (selectedPeriod.value !== "all") {
    customersInPeriod = customers.filter((customer) => {
      const createdAt = customer.createdAt;
      if (!createdAt) return false; // Skip if no creation date

      switch (selectedPeriod.value) {
        case "today":
          return createdAt.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return createdAt >= weekAgo;
        case "month":
          return (
            createdAt.getMonth() === now.getMonth() &&
            createdAt.getFullYear() === now.getFullYear()
          );
        case "quarter":
          const quarter = Math.floor(now.getMonth() / 3);
          const customerQuarter = Math.floor(createdAt.getMonth() / 3);
          return (
            customerQuarter === quarter &&
            createdAt.getFullYear() === now.getFullYear()
          );
        case "year":
          return createdAt.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }

  // Metrics
  metrics.totalCustomers = customersInPeriod.length;
  metrics.newCustomers = customersInPeriod.filter(
    (c) => (now - c.createdAt) / (1000 * 60 * 60 * 24) <= 30 // New in last 30 days
  ).length;
  metrics.vipCustomers = customersInPeriod.filter(
    (c) => c.customerType === "vip"
  ).length;

  const totalSpentAllCustomers = customers.reduce(
    (sum, c) => sum + (c.totalSpent || 0),
    0
  );
  metrics.avgCLV =
    customers.length > 0 ? totalSpentAllCustomers / customers.length : 0;

  // Customers near VIP status (example: totalSpent > 80% of VIP threshold, assuming VIP threshold is 10,000,000)
  const vipThreshold = 10000000; // Example threshold
  metrics.customersNearVIP = customers.filter(
    (c) => c.customerType !== "vip" && (c.totalSpent || 0) >= vipThreshold * 0.8 && (c.totalSpent || 0) < vipThreshold
  ).length;


  // Customer Segmentation
  const vipCount = customers.filter((c) => c.customerType === "vip").length;
  const regularCount = customers.filter(
    (c) => c.customerType === "regular"
  ).length;
  const newCustomerCount = customers.filter(
    (c) => (now - c.createdAt) / (1000 * 60 * 60 * 24) <= 30
  ).length;
  const inactiveCount = customers.filter(
    (c) =>
      c.lastOrderDate && (now - c.lastOrderDate) / (1000 * 60 * 60 * 24) > 90
  ).length; // Inactive if no order in 90+ days

  const totalCustomersForSegments = customers.length;

  customerSegments[0].count = vipCount;
  customerSegments[0].percentage =
    totalCustomersForSegments > 0
      ? ((vipCount / totalCustomersForSegments) * 100).toFixed(1)
      : 0;

  customerSegments[1].count = regularCount;
  customerSegments[1].percentage =
    totalCustomersForSegments > 0
      ? ((regularCount / totalCustomersForSegments) * 100).toFixed(1)
      : 0;

  customerSegments[2].count = newCustomerCount;
  customerSegments[2].percentage =
    totalCustomersForSegments > 0
      ? ((newCustomerCount / totalCustomersForSegments) * 100).toFixed(1)
      : 0;

  customerSegments[3].count = inactiveCount;
  customerSegments[3].percentage =
    totalCustomersForSegments > 0
      ? ((inactiveCount / totalCustomersForSegments) * 100).toFixed(1)
      : 0;

  // Customer Activity
  const activeCustomers = customers.filter(
    (c) =>
      c.lastOrderDate && (now - c.lastOrderDate) / (1000 * 60 * 60 * 24) <= 30
  ).length;
  const inactiveCustomers = customers.filter(
    (c) =>
      c.lastOrderDate &&
      (now - c.lastOrderDate) / (1000 * 60 * 60 * 24) > 30 &&
      (now - c.lastOrderDate) / (1000 * 60 * 60 * 24) <= 90
  ).length;
  const atRiskCustomers = customers.filter(
    (c) =>
      c.lastOrderDate && (now - c.lastOrderDate) / (1000 * 60 * 60 * 24) > 90
  ).length;

  activityStats.active = activeCustomers;
  activityStats.activePercentage =
    totalCustomersForSegments > 0
      ? ((activeCustomers / totalCustomersForSegments) * 100).toFixed(1)
      : 0;
  activityStats.inactive = inactiveCustomers;
  activityStats.inactivePercentage =
    totalCustomersForSegments > 0
      ? ((inactiveCustomers / totalCustomersForSegments) * 100).toFixed(1)
      : 0;
  activityStats.atRisk = atRiskCustomers;
  activityStats.atRiskPercentage =
    totalCustomersForSegments > 0
      ? ((atRiskCustomers / totalCustomersForSegments) * 100).toFixed(1)
      : 0;

  // Top Customers by Value
  topCustomers.value = [...customers]
    .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
    .slice(0, 5)
    .map(c => ({
      id: c.id,
      name: c.fullName || c.firstName + ' ' + (c.lastName || ''),
      email: c.email,
      type: c.customerType,
      totalSpent: c.totalSpent || 0,
      orderCount: c.totalOrders || 0,
    }));

  // Recent Customer Activity (from orders)
  recentActivity.value = orders
    .slice(0, 5) // Take top 5 recent orders
    .map((order) => {
      const customer = allCustomersData.value.find(c => c.id === order.customerId);
      const customerName = customer ? (customer.fullName || customer.firstName + ' ' + (customer.lastName || '')) : 'Unknown Customer';
      return {
        id: order.id,
        customer: customerName,
        type: "order", // Assuming all recent activities are orders for now
        description: `Placed a new order for Rp ${formatPrice(order.grandTotal || order.total || 0)}`,
        timestamp: order.createdAt || order.orderDate,
      };
    });
};

const updatePeriod = () => {
  console.log("Updating period to:", selectedPeriod.value);
  fetchData(); // Re-fetch and re-calculate based on new period
};

const refreshData = () => {
  console.log("Refreshing customer dashboard data...");
  fetchData();
};

const navigateToCustomerList = () => {
  navigateTo("/customers/listCustomer"); // Assuming this is the path to your list customer page
};

const navigateToAddCustomer = () => {
  navigateTo("/customers/addCustomer"); // Assuming this is the path to your add customer page
};

const exportCustomerData = () => {
  console.log("Export customer data");
  // Implement CSV/Excel export for all customers
  const csvData = allCustomersData.value.map(customer => ({
    'Customer ID': customer.id,
    'Full Name': customer.fullName || customer.firstName + ' ' + (customer.lastName || ''),
    'Email': customer.email,
    'Phone': customer.phone,
    'Customer Type': customer.customerType,
    'Total Spent': customer.totalSpent || 0,
    'Total Orders': customer.totalOrders || 0,
    'Created At': customer.createdAt ? customer.createdAt.toLocaleDateString() : 'N/A',
  }));

  const csv = convertToCSV(csvData);
  downloadCSV(csv, 'customer-data.csv');
};

const sendBulkEmail = () => {
  console.log("Send bulk email");
  // Implement bulk email functionality
};

const createSegment = () => {
  console.log("Create customer segment");
  // Implement customer segmentation tool
};

const viewAnalytics = () => {
  console.log("View detailed analytics");
  // Navigate to a more detailed analytics page if available
};

const convertToCSV = (data) => {
  if (!data.length) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${String(row[header]).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
};

const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Initialize on component mount
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Custom styles for dashboard */
</style>
