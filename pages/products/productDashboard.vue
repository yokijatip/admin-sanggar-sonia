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
          <Button variant="outline" class="gap-2" @click="exportData">
            <Download class="h-4 w-4" />
            Export Data
          </Button>
          <Button @click="navigateToAddProduct" class="gap-2">
            <Package class="h-4 w-4" />
            Add Product
          </Button>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="refreshData" :disabled="loading">
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': loading }" />
            Refresh
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
              <span class="text-green-600">+{{ stats.totalProductsGrowth }}%</span> from last month
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
              <span class="text-green-600">+{{ stats.activeProductsGrowth }}%</span> from last month
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
              <span class="text-red-600">+{{ stats.lowStockGrowth }}</span> requires attention
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
              <span class="text-green-600">+{{ stats.revenueGrowth }}%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Charts and Categories Section -->
          <div class="grid gap-4 md:grid-cols-3">
            <!-- Sales Overview Chart -->
            <Card class="md:col-span-2">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Grafik penjualan bulanan</CardDescription>
              </CardHeader>
              <CardContent>
            <div class="h-80">
              <OverviewChart :data="chartData" v-if="chartData.datasets.length > 0" />
              <div v-else class="flex items-center justify-center h-full text-muted-foreground">
                <div class="text-center">
                  <Loader2 class="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading chart data...</p>
                </div>
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
            <Button variant="ghost" size="sm" @click="viewAllActivities"> View all </Button>
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
                    {{ formatTimeAgo(activity.time) }}
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
            <Button variant="ghost" size="sm" @click="viewAllProducts"> View all </Button>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="product in topProducts"
                :key="product.id"
                class="flex items-center gap-4"
              >
                <img
                  :src="product.imageUrl || '/placeholder-product.jpg'"
                  :alt="product.title"
                  class="w-12 h-12 rounded-lg object-cover"
                  @error="handleImageError"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ product.title }}</p>
                  <p class="text-sm text-muted-foreground">
                    Stock: {{ product.stock }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold">
                    Rp {{ formatCurrency(product.price) }}
                  </p>
                  <Badge 
                    :variant="product.statusProduct === 'active' ? 'default' : 'secondary'" 
                    class="text-xs"
                  >
                    {{ product.statusProduct }}
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
                          :src="alert.imageUrl || '/placeholder-product.jpg'"
                          :alt="alert.title"
                          class="w-10 h-10 rounded-lg object-cover"
                          @error="handleImageError"
                        />
                        <div>
                          <p class="font-medium">{{ alert.title }}</p>
                          <p class="text-sm text-muted-foreground">
                            ID: {{ alert.id }}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{{ getCategoryName(alert.category) }}</TableCell>
                    <TableCell>
                      <span class="font-medium">{{ alert.stock }}</span>
                    </TableCell>
                    <TableCell>{{ alert.minLevel }}</TableCell>
                    <TableCell>
                      <Badge
                        :variant="alert.stock === 0 ? 'destructive' : 'secondary'"
                      >
                        {{ alert.stock === 0 ? 'Out of Stock' : 'Low Stock' }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div class="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          class="gap-1"
                          @click="restockProduct(alert)"
                        >
                          <History class="h-3 w-3" />
                          Restock
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          class="gap-1"
                          @click="editProduct(alert)"
                        >
                          <Edit class="h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <!-- No alerts message -->
            <div v-if="filteredAlerts.length === 0" class="text-center py-8">
              <AlertTriangle class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p class="text-muted-foreground">No inventory alerts found</p>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between" v-if="filteredAlerts.length > 0">
              <p class="text-sm text-muted-foreground">
                Showing {{ filteredAlerts.length }} of {{ inventoryAlerts.length }} alerts
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
import { ref, computed, onMounted, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Loader2,
} from "lucide-vue-next";
import HeadersContent from "~/components/ui/HeadersContent.vue";
import OverviewChart from "@/components/chart/OverviewChart.vue";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  limit,
  where,
} from "firebase/firestore";

const { $firebase } = useNuxtApp();

// Reactive data
const loading = ref(true);
const searchQuery = ref("");
const selectedAlertFilter = ref("all");

// Products and categories
const allProducts = ref([]);
const categories = ref([]);

// Stats data
const stats = ref({
  totalProducts: 0,
  totalProductsGrowth: 0,
  activeProducts: 0,
  activeProductsGrowth: 0,
  lowStockItems: 0,
  lowStockGrowth: 0,
  totalRevenue: 0,
  revenueGrowth: 0,
});

// Chart data
const chartData = ref({
  labels: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
  datasets: [],
});

// Top categories
const topCategories = ref([]);

// Recent activities
const recentActivities = ref([]);

// Top products
const topProducts = ref([]);

// Computed properties
const inventoryAlerts = computed(() => {
  return allProducts.value.filter(product => 
    product.stock <= (product.minLevel) || product.stock === 0
  );
});

const filteredAlerts = computed(() => {
  let filtered = inventoryAlerts.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(alert =>
      alert.title?.toLowerCase().includes(query) ||
      alert.id?.toLowerCase().includes(query) ||
      getCategoryName(alert.category).toLowerCase().includes(query)
    );
  }

  // Filter by alert status
  if (selectedAlertFilter.value !== "all") {
    if (selectedAlertFilter.value === "out") {
      filtered = filtered.filter(alert => alert.stock === 0);
    } else if (selectedAlertFilter.value === "low") {
      filtered = filtered.filter(alert => alert.stock > 0 && alert.stock <= (alert.minLevel || 10));
    }
  }

  return filtered;
});

// Fetch functions
const fetchCategories = async () => {
  try {
    const q = query(collection($firebase.firestore, "categories"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    
    categories.value = querySnapshot.docs.map(doc => ({
      id: doc.data().id || doc.id,
      name: doc.data().name,
      firestoreId: doc.id
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const fetchProducts = async () => {
  try {
    loading.value = true;
    const productsRef = collection($firebase.firestore, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    allProducts.value = querySnapshot.docs.map(doc => ({
      firestoreId: doc.id,
      id: doc.data().id,
      ...doc.data(),
    }));

    calculateStats();
    calculateTopCategories();
    generateChartData();
    fetchTopProducts();
    generateRecentActivities();
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
};

const calculateStats = () => {
  const total = allProducts.value.length;
  const active = allProducts.value.filter(p => p.statusProduct === 'active').length;
  const lowStock = allProducts.value.filter(p => p.stock <= (p.minLevel)).length;
  const totalRevenue = allProducts.value.reduce((sum, p) => sum + (p.price * p.stock), 0);

  stats.value = {
    totalProducts: total,
    totalProductsGrowth: Math.floor(Math.random() * 20) + 5, // Simulated growth
    activeProducts: active,
    activeProductsGrowth: Math.floor(Math.random() * 15) + 3,
    lowStockItems: lowStock,
    lowStockGrowth: Math.floor(Math.random() * 10) + 1,
    totalRevenue: totalRevenue,
    revenueGrowth: Math.floor(Math.random() * 25) + 10,
  };
};

const calculateTopCategories = () => {
  const categoryCount = {};
  const colors = ['#FF4F0F', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  allProducts.value.forEach(product => {
    const categoryName = getCategoryName(product.category);
    categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
  });

  const total = allProducts.value.length;
  topCategories.value = Object.entries(categoryCount)
    .map(([name, count], index) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

const generateChartData = () => {
  // Generate sample monthly data based on current products
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const baseValue = Math.floor(Math.random() * 5000) + 1000;
    const seasonalMultiplier = i >= 10 || i <= 1 ? 1.5 : 1; // Higher in Nov-Feb
    return Math.floor(baseValue * seasonalMultiplier);
  });

  chartData.value = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        data: monthlyData,
        backgroundColor: "#FF4F0F",
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };
};

const fetchTopProducts = () => {
  // Get top 4 products by price
  topProducts.value = allProducts.value
    .filter(p => p.statusProduct === 'active')
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);
};

const generateRecentActivities = () => {
  const activities = [];
  const now = new Date();
  
  // Generate activities based on recent products
  const recentProducts = allProducts.value
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  recentProducts.forEach((product, index) => {
    const createdAt = new Date(product.createdAt);
    const timeDiff = now - createdAt;
    
    activities.push({
      id: index + 1,
      title: "New product added",
      description: `${product.title} added to ${getCategoryName(product.category)} category`,
      time: createdAt,
      icon: Plus,
      iconBg: "bg-green-50 dark:bg-green-950",
      iconColor: "text-green-600 dark:text-green-400",
    });
  });

  recentActivities.value = activities;
};

// Helper functions
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId || 'Unknown';
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  }
};

const handleImageError = (event) => {
  event.target.src = '/placeholder-product.jpg';
};

// Action functions
const refreshData = async () => {
  await fetchProducts();
  await fetchCategories();
};

const navigateToAddProduct = () => {
  navigateTo("/products/addProduct");
};

const exportData = () => {
  const csvContent = "data:text/csv;charset=utf-8," + 
    "ID,Title,Category,Price,Stock,Status\n" +
    allProducts.value.map(p => 
      `${p.id},"${p.title}","${getCategoryName(p.category)}",${p.price},${p.stock},${p.statusProduct}`
    ).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "products_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const viewAllActivities = () => {
  // Navigate to activities page
  console.log("Navigate to activities page");
};

const viewAllProducts = () => {
  navigateTo("/products/listProducts");
};

const restockProduct = (product) => {
  // Navigate to restock page or open restock modal
  console.log("Restock product:", product);
  navigateTo(`/products/restock/${product.firestoreId}`);
};

const editProduct = (product) => {
  // Navigate to edit page
  navigateTo(`/products/edit/${product.firestoreId}`);
};

// Initialize
onMounted(async () => {
  await fetchCategories();
  await fetchProducts();
});

// Watch for real-time updates
watch(allProducts, () => {
  calculateStats();
  calculateTopCategories();
  generateChartData();
  fetchTopProducts();
  generateRecentActivities();
}, { deep: true });
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}


</style>
