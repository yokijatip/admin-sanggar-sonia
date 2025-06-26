<template>
  <div class="container mx-auto px-4">
    <div class="mx-auto">
      <!-- Header -->
      <HeadersContent
        title="Orders"
        description="Manage your customer orders"
      />

      <!-- Actions Bar -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
      >
        <!-- Search and Filters -->
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <!-- Search -->
          <div class="relative">
            <SearchIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search orders..."
              class="pl-10 w-full sm:w-64"
            />
          </div>

          <!-- Status Filter -->
          <Select v-model="statusFilter">
            <SelectTrigger class="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
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

          <!-- Date Filter -->
          <Select v-model="dateFilter">
            <SelectTrigger class="w-full sm:w-40">
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Add Order Button -->
        <Button @click="navigateToAddOrder" class="w-full sm:w-auto">
          <PlusIcon class="h-4 w-4 mr-2" />
          Add Order
        </Button>
      </div>

      <!-- Orders Table -->
      <Card>
        <CardContent class="p-0">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b bg-gray-50">
                <tr>
                  <th class="text-left p-4 font-medium text-gray-900">
                    Order ID
                  </th>
                  <th class="text-left p-4 font-medium text-gray-900">
                    Customer
                  </th>
                  <th class="text-left p-4 font-medium text-gray-900">Date</th>
                  <th class="text-left p-4 font-medium text-gray-900">Items</th>
                  <th class="text-left p-4 font-medium text-gray-900">Total</th>
                  <th class="text-left p-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th class="text-left p-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="7" class="text-center p-8">
                    <div class="flex items-center justify-center">
                      <svg
                        class="animate-spin h-6 w-6 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                          fill="none"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Loading orders...
                    </div>
                  </td>
                </tr>
                <tr v-else-if="filteredOrders.length === 0">
                  <td colspan="7" class="text-center p-8 text-gray-500">
                    <PackageIcon class="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p class="text-lg font-medium">No orders found</p>
                    <p class="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
                <tr
                  v-else
                  v-for="order in paginatedOrders"
                  :key="order.id"
                  class="border-b hover:bg-gray-50 transition-colors"
                >
                  <!-- Order ID -->
                  <td class="p-4">
                    <div class="font-medium text-gray-900">{{ order.id }}</div>
                  </td>

                  <!-- Customer -->
                  <td class="p-4">
                    <div class="flex items-center">
                      <div
                        class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3"
                      >
                        <span class="text-sm font-medium text-gray-600">
                          {{ order.customer.name.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">
                          {{ order.customer.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ order.customer.email }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Date -->
                  <td class="p-4">
                    <div class="text-gray-900">
                      {{ formatDate(order.date) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatTime(order.date) }}
                    </div>
                  </td>

                  <!-- Items -->
                  <td class="p-4">
                    <div class="text-gray-900">{{ order.itemCount }} items</div>
                    <div class="text-sm text-gray-500">
                      {{
                        order.products
                          .slice(0, 2)
                          .map((p) => p.name)
                          .join(", ")
                      }}{{ order.products.length > 2 ? "..." : "" }}
                    </div>
                  </td>

                  <!-- Total -->
                  <td class="p-4">
                    <div class="font-medium text-gray-900">
                      Rp {{ formatPrice(order.total) }}
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="p-4">
                    <Badge :variant="getStatusVariant(order.status)">
                      {{ order.status }}
                    </Badge>
                  </td>

                  <!-- Actions -->
                  <td class="p-4">
                    <div class="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="viewOrder(order.id)"
                        title="View Order"
                      >
                        <EyeIcon class="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="editOrder(order.id)"
                        title="Edit Order"
                      >
                        <EditIcon class="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="deleteOrder(order.id)"
                        title="Delete Order"
                        class="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon class="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            v-if="filteredOrders.length > 0"
            class="flex items-center justify-between p-4 border-t"
          >
            <div class="text-sm text-gray-500">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{
                Math.min(currentPage * itemsPerPage, filteredOrders.length)
              }}
              of {{ filteredOrders.length }} orders
            </div>
            <div class="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                @click="currentPage--"
                :disabled="currentPage === 1"
              >
                <ChevronLeftIcon class="h-4 w-4" />
                Previous
              </Button>
              <div class="flex items-center space-x-1">
                <Button
                  v-for="page in visiblePages"
                  :key="page"
                  :variant="page === currentPage ? 'default' : 'outline'"
                  size="sm"
                  @click="currentPage = page"
                  class="w-8 h-8 p-0"
                >
                  {{ page }}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                @click="currentPage++"
                :disabled="currentPage === totalPages"
              >
                Next
                <ChevronRightIcon class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <!-- Delete Confirmation Dialog -->
      <AlertDialog v-model:open="showDeleteDialog">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order {{ orderToDelete?.id }}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              @click="confirmDelete"
              class="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  PackageIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-vue-next";

// State
const searchQuery = ref("");
const statusFilter = ref("all");
const dateFilter = ref("all");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isLoading = ref(true);
const showOrderModal = ref(false);
const showDeleteDialog = ref(false);
const selectedOrder = ref(null);
const orderToDelete = ref(null);

// Sample orders data
const orders = ref([
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
    itemCount: 3,
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
]);

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (statusFilter.value !== "all") {
    filtered = filtered.filter((order) => order.status === statusFilter.value);
  }

  // Date filter
  if (dateFilter.value !== "all") {
    const now = new Date();
    const orderDate = new Date();

    filtered = filtered.filter((order) => {
      const date = new Date(order.date);
      switch (dateFilter.value) {
        case "today":
          return date.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return date >= weekAgo;
        case "month":
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        case "year":
          return date.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredOrders.value.length / itemsPerPage.value)
);

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredOrders.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
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

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
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

const navigateToAddOrder = () => {
  // Navigate to add order page
  console.log("Navigate to add order");
};

const viewOrder = (orderId) => {
  selectedOrder.value = orders.value.find((order) => order.id === orderId);
  showOrderModal.value = true;
};

const editOrder = (orderId) => {
  // Navigate to edit order page
  console.log("Edit order:", orderId);
};

const deleteOrder = (orderId) => {
  orderToDelete.value = orders.value.find((order) => order.id === orderId);
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (orderToDelete.value) {
    const index = orders.value.findIndex(
      (order) => order.id === orderToDelete.value.id
    );
    if (index > -1) {
      orders.value.splice(index, 1);
    }
  }
  showDeleteDialog.value = false;
  orderToDelete.value = null;
};

// Lifecycle
onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
