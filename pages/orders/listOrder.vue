<template>
  <div class="container mx-auto">
    <!-- Title and Button -->
    <div class="flex items-center justify-between px-4">
      <HeadersContent
        title="Orders"
        description="Manage your customer orders"
      />
      <Button @click="navigateToAddOrder" class="bg-primary">
        <Plus class="mr-2 h-4 w-4" />
        Add Order
      </Button>
    </div>

    <!-- Search and Filter -->
    <div class="flex items-center gap-4 mb-6 ml-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Search orders..."
          class="pl-8"
          @input="filterOrders"
        />
      </div>

      <Select v-model="selectedStatus" @update:modelValue="filterOrders">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedDateRange" @update:modelValue="filterOrders">
        <SelectTrigger class="w-36">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Data Table -->
    <div class="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">
              <Checkbox
                :checked="selectAll"
                @update:checked="toggleSelectAll"
              />
            </TableHead>
            <TableHead class="w-24">Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead class="w-32">Items</TableHead>
            <TableHead class="text-left">Total</TableHead>
            <TableHead class="text-left">Status</TableHead>
            <TableHead class="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="order in paginatedOrders"
            :key="order.id"
            class="hover:bg-muted/50"
          >
            <!-- Checkbox -->
            <TableCell>
              <Checkbox
                :checked="selectedOrders.includes(order.id)"
                @update:checked="toggleOrderSelection(order.id)"
              />
            </TableCell>
            <!-- Order ID -->
            <TableCell class="font-mono text-sm">
              {{ order.id }}
            </TableCell>
            <!-- Customer -->
            <TableCell class="font-medium">
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
            <!-- Date -->
            <TableCell>
              <div class="text-sm">
                <div>{{ formatDate(order.date) }}</div>
                <div class="text-muted-foreground">
                  {{ formatTime(order.date) }}
                </div>
              </div>
            </TableCell>
            <!-- Items -->
            <TableCell>
              <Badge variant="outline"> {{ order.itemCount }} items </Badge>
            </TableCell>
            <!-- Total -->
            <TableCell class="text-left font-medium">
              Rp {{ formatPrice(order.total) }}
            </TableCell>
            <!-- Status -->
            <TableCell class="text-left">
              <Badge
                :variant="getStatusVariant(order.status)"
                class="capitalize"
              >
                {{ order.status }}
              </Badge>
            </TableCell>
            <!-- Actions -->
            <TableCell class="text-right">
              <div class="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" @click="viewOrder(order.id)">
                  <Eye class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" @click="editOrder(order.id)">
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="deleteOrder(order.id)"
                >
                  <Trash2 class="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between space-x-2 p-4">
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

    <!-- Bulk Actions -->
    <div
      v-if="selectedOrders.length > 0"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2"
    >
      <div
        class="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-4"
      >
        <span class="text-sm font-medium"
          >{{ selectedOrders.length }} selected</span
        >
        <div class="flex gap-2">
          <Button variant="secondary" size="sm" @click="bulkDelete">
            <Trash2 class="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button variant="secondary" size="sm" @click="bulkStatusUpdate">
            <Settings class="h-4 w-4 mr-1" />
            Update Status
          </Button>
          <Button variant="secondary" size="sm" @click="clearSelection">
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <Dialog v-model:open="showOrderModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details - {{ selectedOrder?.id }}</DialogTitle>
        </DialogHeader>
        <div v-if="selectedOrder" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="font-medium">Customer</Label>
              <p>{{ selectedOrder.customer.name }}</p>
              <p class="text-sm text-gray-500">
                {{ selectedOrder.customer.email }}
              </p>
            </div>
            <div>
              <Label class="font-medium">Order Date</Label>
              <p>{{ formatDate(selectedOrder.date) }}</p>
            </div>
            <div>
              <Label class="font-medium">Status</Label>
              <Badge :variant="getStatusVariant(selectedOrder.status)">
                {{ selectedOrder.status }}
              </Badge>
            </div>
            <div>
              <Label class="font-medium">Total</Label>
              <p class="font-medium">
                Rp {{ formatPrice(selectedOrder.total) }}
              </p>
            </div>
          </div>

          <div>
            <Label class="font-medium">Products</Label>
            <div class="mt-2 space-y-2">
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

          <div v-if="selectedOrder.shippingAddress">
            <Label class="font-medium">Shipping Address</Label>
            <p class="text-sm">{{ selectedOrder.shippingAddress }}</p>
          </div>

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next";

// Sample orders data
const allOrders = ref([
  {
    id: "ORD-001",
    customer: {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
    },
    date: "2024-01-15T10:30:00Z",
    status: "delivered",
    total: 1199000,
    itemCount: 1,
    products: [
      {
        id: "PRD-001",
        name: "iPhone 15 Pro Max",
        quantity: 1,
        subtotal: 1199000,
      },
    ],
    shippingAddress: "Jl. Sudirman No. 123, Jakarta",
    notes: "Please handle with care",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
    },
    date: "2024-01-14T14:20:00Z",
    status: "processing",
    total: 449000,
    itemCount: 2,
    products: [
      {
        id: "PRD-002",
        name: "Nike Air Max 270",
        quantity: 1,
        subtotal: 150000,
      },
      {
        id: "PRD-005",
        name: "Smart Garden Kit",
        quantity: 1,
        subtotal: 299000,
      },
    ],
    shippingAddress: "Jl. Thamrin No. 456, Jakarta",
    notes: "",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
    },
    date: "2024-01-13T09:15:00Z",
    status: "shipped",
    total: 2399000,
    itemCount: 1,
    products: [
      { id: "PRD-003", name: "MacBook Pro M3", quantity: 1, subtotal: 2399000 },
    ],
    shippingAddress: "Jl. Gatot Subroto No. 789, Jakarta",
    notes: "Urgent delivery",
  },
  {
    id: "ORD-004",
    customer: {
      name: "William Kim",
      email: "will@email.com",
    },
    date: "2024-01-12T16:45:00Z",
    status: "pending",
    total: 338000,
    itemCount: 2,
    products: [
      {
        id: "PRD-006",
        name: "Wireless Headphones",
        quantity: 1,
        subtotal: 249000,
      },
      { id: "PRD-007", name: "Designer T-Shirt", quantity: 1, subtotal: 89000 },
    ],
    shippingAddress: "Jl. Kuningan No. 321, Jakarta",
    notes: "",
  },
  {
    id: "ORD-005",
    customer: {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
    },
    date: "2024-01-11T11:30:00Z",
    status: "cancelled",
    total: 599000,
    itemCount: 1,
    products: [
      {
        id: "PRD-008",
        name: "Coffee Maker Pro",
        quantity: 1,
        subtotal: 599000,
      },
    ],
    shippingAddress: "Jl. Senayan No. 654, Jakarta",
    notes: "Customer requested cancellation",
  },
  {
    id: "ORD-006",
    customer: {
      name: "Ahmad Rizki",
      email: "ahmad.rizki@email.com",
    },
    date: "2024-01-10T08:20:00Z",
    status: "delivered",
    total: 164000,
    itemCount: 2,
    products: [
      {
        id: "PRD-004",
        name: "The Psychology of Money",
        quantity: 1,
        subtotal: 15000,
      },
      {
        id: "PRD-002",
        name: "Nike Air Max 270",
        quantity: 1,
        subtotal: 150000,
      },
    ],
    shippingAddress: "Jl. Kemang No. 987, Jakarta",
    notes: "",
  },
]);

// Reactive data
const searchQuery = ref("");
const selectedStatus = ref("all");
const selectedDateRange = ref("all");
const filteredOrders = ref([...allOrders.value]);
const selectedOrders = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showOrderModal = ref(false);
const selectedOrder = ref(null);

// Computed properties
const selectAll = computed(() => {
  return (
    paginatedOrders.value.length > 0 &&
    paginatedOrders.value.every((order) =>
      selectedOrders.value.includes(order.id)
    )
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / parseInt(itemsPerPage.value));
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value);
  const end = start + parseInt(itemsPerPage.value);
  return filteredOrders.value.slice(start, end);
});

// Methods
const filterOrders = () => {
  let filtered = allOrders.value;

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(
      (order) =>
        order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        order.customer.name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        order.customer.email
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  // Filter by status
  if (selectedStatus.value && selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (order) => order.status === selectedStatus.value
    );
  }

  // Filter by date range
  if (selectedDateRange.value && selectedDateRange.value !== "all") {
    const now = new Date();
    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.date);
      switch (selectedDateRange.value) {
        case "today":
          return orderDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case "month":
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        default:
          return true;
      }
    });
  }

  filteredOrders.value = filtered;
  currentPage.value = 1;
  selectedOrders.value = [];
};

const getStatusVariant = (status) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "processing":
      return "default";
    case "shipped":
      return "outline";
    case "delivered":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

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

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toggleSelectAll = (checked) => {
  if (checked) {
    selectedOrders.value = [...paginatedOrders.value.map((o) => o.id)];
  } else {
    selectedOrders.value = [];
  }
};

const toggleOrderSelection = (orderId) => {
  const index = selectedOrders.value.indexOf(orderId);
  if (index > -1) {
    selectedOrders.value.splice(index, 1);
  } else {
    selectedOrders.value.push(orderId);
  }
};

const changePage = (page) => {
  currentPage.value = page;
  selectedOrders.value = [];
};

const clearSelection = () => {
  selectedOrders.value = [];
};

// Navigation methods
const navigateToAddOrder = () => {
  console.log("Navigate to add order");
  // navigateTo('/admin/orders/add');
  showOrderModal.value = true;
};

const viewOrder = (id) => {
  selectedOrder.value = allOrders.value.find((order) => order.id === id);
  showOrderModal.value = true;
};

const editOrder = (id) => {
  console.log("Edit order:", id);
};

const deleteOrder = (id) => {
  console.log("Delete order:", id);
};

const bulkDelete = () => {
  console.log("Bulk delete:", selectedOrders.value);
};

const bulkStatusUpdate = () => {
  console.log("Bulk status update:", selectedOrders.value);
};

// Initialize
onMounted(() => {
  filterOrders();
});
</script>

<style></style>
