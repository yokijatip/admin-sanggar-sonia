<template>
  <div class="container mx-auto min-w-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-4">
      <HeadersContent
        title="Order History"
        description="View and analyze completed orders"
      />
      <div class="flex gap-2">
        <Button @click="exportHistory" variant="outline">
          <Download class="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button @click="showFilters = !showFilters" variant="outline">
          <Filter class="mr-2 h-4 w-4" />
          {{ showFilters ? "Hide" : "Show" }} Filters
        </Button>
      </div>
    </div>

    <!-- Advanced Filters -->
    <Card v-if="showFilters" class="mb-6 mx-4">
      <CardHeader>
        <CardTitle class="text-lg">Advanced Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Date Range -->
          <div>
            <Label class="pb-2">Date Range</Label>
            <Select
              v-model="filters.dateRange"
              @update:modelValue="applyFilters"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Status Filter -->
          <div>
            <Label class="pb-2">Status</Label>
            <Select v-model="filters.status" @update:modelValue="applyFilters">
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Customer Type -->
          <div>
            <Label class="pb-2">Customer Type</Label>
            <Select
              v-model="filters.customerType"
              @update:modelValue="applyFilters"
            >
              <SelectTrigger>
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="vip">VIP Customers</SelectItem>
                <SelectItem value="regular">Regular Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Value Range -->
          <div>
            <Label class="pb-2">Order Value</Label>
            <Select
              v-model="filters.valueRange"
              @update:modelValue="applyFilters"
            >
              <SelectTrigger>
                <SelectValue placeholder="All Values" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Values</SelectItem>
                <SelectItem value="high">≥ Rp 1,000,000</SelectItem>
                <SelectItem value="medium">Rp 500,000 - Rp 999,999</SelectItem>
                <SelectItem value="low">&lt; Rp 500,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="flex items-center gap-4 mt-4">
          <div class="relative flex-1 max-w-sm">
            <Search
              class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="filters.search"
              placeholder="Search orders, customers..."
              class="pl-8"
              @input="applyFilters"
            />
          </div>
          <Button @click="clearFilters" variant="outline">
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 px-4">
      <!-- Total Orders -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Total Orders </CardTitle>
          <ShoppingCart />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">{{ filteredStats.totalOrders }}</div>
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
            Rp {{ formatPrice(filteredStats.totalRevenue) }}
          </div>
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
            Rp {{ formatPrice(filteredStats.avgOrderValue) }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Completion Rate </CardTitle>
          <CheckCircle class="text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">
            {{ filteredStats.completionRate }}%
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- History Table -->
    <div class="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-24">Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Completion Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="isLoading">
            <TableCell colspan="9" class="text-center p-8">
              <div class="flex items-center justify-center">
                <RefreshCw class="animate-spin h-6 w-6 mr-3" />
                Loading order history...
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="paginatedHistory.length === 0">
            <TableCell colspan="9" class="text-center p-8 text-gray-500">
              <FileX class="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p class="text-lg font-medium">No orders found</p>
              <p class="text-sm">Try adjusting your filters</p>
            </TableCell>
          </TableRow>
          <TableRow
            v-else
            v-for="order in paginatedHistory"
            :key="order.id"
            class="hover:bg-muted/50"
          >
            <!-- Order ID -->
            <TableCell class="font-mono text-sm">
              {{ order.id }}
            </TableCell>

            <!-- Customer -->
            <TableCell>
              <div class="flex items-center">
                <div
                  class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3"
                >
                  <span class="text-sm font-medium text-gray-600">
                    {{ order.customer.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <div class="font-medium">{{ order.customer.name }}</div>
                  <div class="text-sm text-muted-foreground">
                    {{ order.customer.email }}
                  </div>
                </div>
              </div>
            </TableCell>

            <!-- Products -->
            <TableCell>
              <div class="space-y-1">
                <div
                  v-for="product in order.products.slice(0, 2)"
                  :key="product.id"
                  class="text-sm"
                >
                  {{ product.name }} x{{ product.quantity }}
                </div>
                <div
                  v-if="order.products.length > 2"
                  class="text-xs text-muted-foreground"
                >
                  +{{ order.products.length - 2 }} more items
                </div>
              </div>
            </TableCell>

            <!-- Order Date -->
            <TableCell>
              <div class="text-sm">
                {{ formatDate(order.orderDate) }}
              </div>
            </TableCell>

            <!-- Completion Date -->
            <TableCell>
              <div class="text-sm">
                {{
                  order.completionDate ? formatDate(order.completionDate) : "-"
                }}
              </div>
            </TableCell>

            <!-- Duration -->
            <TableCell>
              <div class="text-sm">
                {{ order.duration ? order.duration + "h" : "-" }}
              </div>
            </TableCell>

            <!-- Total -->
            <TableCell class="font-medium">
              Rp {{ formatPrice(order.total) }}
            </TableCell>

            <!-- Status -->
            <TableCell>
              <Badge
                :variant="getStatusVariant(order.status)"
                class="capitalize"
              >
                {{ order.status }}
              </Badge>
            </TableCell>

            <!-- Actions -->
            <TableCell>
              <div class="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="viewOrderDetails(order)"
                  title="View Details"
                >
                  <Eye class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="downloadInvoice(order.id)"
                  title="Download Invoice"
                >
                  <Download class="h-4 w-4" />
                </Button>
                <Button
                  v-if="order.status === 'completed'"
                  variant="ghost"
                  size="sm"
                  @click="reorderItems(order)"
                  title="Reorder"
                >
                  <RotateCcw class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between space-x-2 p-4 mx-4">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select v-model="itemsPerPage" @update:modelValue="changePage(1)">
          <SelectTrigger class="h-8 w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex items-center space-x-6 lg:space-x-8">
        <div class="flex w-32 items-center justify-center text-sm font-medium">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            @click="changePage(1)"
            :disabled="currentPage === 1"
          >
            <ChevronsLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            <ChevronRight class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            @click="changePage(totalPages)"
            :disabled="currentPage === totalPages"
          >
            <ChevronsRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <Dialog v-model:open="showDetailsModal">
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details - {{ selectedOrder?.id }}</DialogTitle>
        </DialogHeader>
        <div v-if="selectedOrder" class="space-y-6">
          <!-- Order Timeline -->
          <div>
            <Label class="font-medium mb-3 block">Order Timeline</Label>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <div class="font-medium">Order Placed</div>
                  <div class="text-sm text-muted-foreground">
                    {{ formatDateTime(selectedOrder.orderDate) }}
                  </div>
                </div>
              </div>
              <div
                v-if="selectedOrder.processingStarted"
                class="flex items-center space-x-3"
              >
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <div class="font-medium">Processing Started</div>
                  <div class="text-sm text-muted-foreground">
                    {{ formatDateTime(selectedOrder.processingStarted) }}
                  </div>
                </div>
              </div>
              <div
                v-if="selectedOrder.completionDate"
                class="flex items-center space-x-3"
              >
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div class="font-medium">Order Completed</div>
                  <div class="text-sm text-muted-foreground">
                    {{ formatDateTime(selectedOrder.completionDate) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Details -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="font-medium">Customer</Label>
              <p>{{ selectedOrder.customer.name }}</p>
              <p class="text-sm text-muted-foreground">
                {{ selectedOrder.customer.email }}
              </p>
            </div>
            <div>
              <Label class="font-medium">Total Duration</Label>
              <p>{{ selectedOrder.duration || "N/A" }} hours</p>
            </div>
            <div>
              <Label class="font-medium">Total Value</Label>
              <p class="font-bold">Rp {{ formatPrice(selectedOrder.total) }}</p>
            </div>
            <div>
              <Label class="font-medium">Status</Label>
              <Badge :variant="getStatusVariant(selectedOrder.status)">
                {{ selectedOrder.status }}
              </Badge>
            </div>
          </div>

          <!-- Products -->
          <div>
            <Label class="font-medium mb-3 block">Products</Label>
            <div class="space-y-2">
              <div
                v-for="product in selectedOrder.products"
                :key="product.id"
                class="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span>{{ product.name }} x{{ product.quantity }}</span>
                <span>Rp {{ formatPrice(product.subtotal) }}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedOrder.notes">
            <Label class="font-medium">Notes</Label>
            <p class="text-sm">{{ selectedOrder.notes }}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, computed, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Filter,
  Search,
  RefreshCw,
  FileX,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
  ShoppingCart,
  DollarSign,
  LineChart,
  BarChart3,
  TrendingUp,
} from "lucide-vue-next";

definePageMeta({
  middleware: "auth",
});

// State
const showFilters = ref(false);
const showDetailsModal = ref(false);
const selectedOrder = ref(null);
const isLoading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(20);

const filters = ref({
  dateRange: "month",
  status: "all",
  customerType: "all",
  valueRange: "all",
  search: "",
});

// Sample order history data
const orderHistory = ref([
  {
    id: "ORD-001",
    customer: { name: "Siti Aminah", email: "siti@email.com", type: "vip" },
    products: [
      { id: "P1", name: "Wedding Cake 3 Tier", quantity: 1, subtotal: 2500000 },
      { id: "P2", name: "Cupcakes", quantity: 50, subtotal: 500000 },
    ],
    total: 3000000,
    orderDate: "2024-01-15T08:00:00Z",
    processingStarted: "2024-01-15T10:00:00Z",
    completionDate: "2024-01-16T16:00:00Z",
    duration: 30,
    status: "completed",
    notes: "Wedding cake for 200 guests",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Budi Santoso",
      email: "budi@email.com",
      type: "regular",
    },
    products: [
      { id: "P3", name: "Birthday Cake", quantity: 1, subtotal: 350000 },
    ],
    total: 350000,
    orderDate: "2024-01-14T14:20:00Z",
    processingStarted: "2024-01-14T16:00:00Z",
    completionDate: "2024-01-15T10:00:00Z",
    duration: 18,
    status: "completed",
    notes: "",
  },
  // Add more sample data...
]);

// Computed
const filteredHistory = computed(() => {
  let filtered = orderHistory.value;

  // Apply filters
  if (filters.value.status !== "all") {
    filtered = filtered.filter(
      (order) => order.status === filters.value.status
    );
  }

  if (filters.value.customerType !== "all") {
    filtered = filtered.filter(
      (order) => order.customer.type === filters.value.customerType
    );
  }

  if (filters.value.search) {
    const query = filters.value.search.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const filteredStats = computed(() => {
  const orders = filteredHistory.value;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  return {
    totalOrders,
    totalRevenue,
    avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    completionRate:
      totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
  };
});

const totalPages = computed(() => {
  return Math.ceil(filteredHistory.value.length / parseInt(itemsPerPage.value));
});

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value);
  const end = start + parseInt(itemsPerPage.value);
  return filteredHistory.value.slice(start, end);
});

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusVariant = (status) => {
  switch (status) {
    case "completed":
      return "default";
    case "cancelled":
      return "destructive";
    case "refunded":
      return "secondary";
    default:
      return "outline";
  }
};

const applyFilters = () => {
  currentPage.value = 1;
};

const clearFilters = () => {
  filters.value = {
    dateRange: "all",
    status: "all",
    customerType: "all",
    valueRange: "all",
    search: "",
  };
  applyFilters();
};

const changePage = (page) => {
  currentPage.value = page;
};

const viewOrderDetails = (order) => {
  selectedOrder.value = order;
  showDetailsModal.value = true;
};

const downloadInvoice = (orderId) => {
  console.log("Download invoice for:", orderId);
  // Implement invoice download
};

const reorderItems = (order) => {
  console.log("Reorder items from:", order.id);
  // Implement reorder functionality
};

const exportHistory = () => {
  console.log("Export order history");
  // Implement CSV/Excel export
};

// Initialize
onMounted(() => {
  // Load order history data
});
</script>

<style scoped>
/* Custom styles */
</style>
