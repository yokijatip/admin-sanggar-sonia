<template>
  <div class="container mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 mb-6">
      <HeadersContent
        title="Customer List"
        description="Manage all your customers"
      />
      <Button @click="navigateToAddCustomer" class="bg-primary">
        <Plus class="mr-2 h-4 w-4" />
        Add Customer
      </Button>
    </div>

    <!-- Search and Filter -->
    <div class="flex items-center gap-4 mb-6 px-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Search customers..."
          class="pl-8"
          @input="filterCustomers"
        />
      </div>

      <Select v-model="selectedType" @update:modelValue="filterCustomers">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Customer Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="vip">VIP Customers</SelectItem>
          <SelectItem value="regular">Regular Customers</SelectItem>
          <SelectItem value="corporate">Corporate Customers</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedStatus" @update:modelValue="filterCustomers">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Activity Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active (30 days)</SelectItem>
          <SelectItem value="inactive">Inactive (30-90 days)</SelectItem>
          <SelectItem value="at_risk">At Risk (90+ days)</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedLocation" @update:modelValue="filterCustomers">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="jakarta">DKI Jakarta</SelectItem>
          <SelectItem value="west_java">West Java</SelectItem>
          <SelectItem value="central_java">Central Java</SelectItem>
          <SelectItem value="east_java">East Java</SelectItem>
          <SelectItem value="banten">Banten</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Customer Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 px-4">
      <Card>
        <CardContent class="p-4">
          <div class="text-center">
            <p class="text-2xl font-bold">{{ filteredStats.total }}</p>
            <p class="text-sm text-muted-foreground">Total Customers</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-yellow-600">
              {{ filteredStats.vip }}
            </p>
            <p class="text-sm text-muted-foreground">VIP Customers</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">
              {{ filteredStats.active }}
            </p>
            <p class="text-sm text-muted-foreground">Active Customers</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <div class="text-center">
            <p class="text-2xl font-bold">
              Rp {{ formatPrice(filteredStats.totalValue) }}
            </p>
            <p class="text-sm text-muted-foreground">Total Customer Value</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Customer Table -->
    <div class="border mx-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">
              <Checkbox
                :checked="selectAll"
                @update:checked="toggleSelectAll"
              />
            </TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="customer in paginatedCustomers"
            :key="customer.id"
            class="hover:bg-muted/50"
          >
            <!-- Checkbox -->
            <TableCell>
              <Checkbox
                :checked="selectedCustomers.includes(customer.id)"
                @update:checked="toggleCustomerSelection(customer.id)"
              />
            </TableCell>

            <!-- Customer Info -->
            <TableCell>
              <div class="flex items-center space-x-3">
                <div
                  class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-gray-600">
                    {{ customer.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <div class="font-medium">{{ customer.name }}</div>
                  <div class="text-sm text-muted-foreground">
                    ID: {{ customer.id }}
                  </div>
                </div>
              </div>
            </TableCell>

            <!-- Contact -->
            <TableCell>
              <div class="text-sm">
                <div>{{ customer.email }}</div>
                <div class="text-muted-foreground">{{ customer.phone }}</div>
              </div>
            </TableCell>

            <!-- Type -->
            <TableCell>
              <Badge
                :variant="getTypeVariant(customer.type)"
                class="capitalize"
              >
                <Crown v-if="customer.type === 'vip'" class="mr-1 h-3 w-3" />
                <Building
                  v-if="customer.type === 'corporate'"
                  class="mr-1 h-3 w-3"
                />
                {{ customer.type }}
              </Badge>
            </TableCell>

            <!-- Location -->
            <TableCell>
              <div class="text-sm">
                <div>{{ customer.address.city }}</div>
                <div class="text-muted-foreground">
                  {{ customer.address.province }}
                </div>
              </div>
            </TableCell>

            <!-- Orders -->
            <TableCell class="text-center">
              <div class="font-medium">{{ customer.orderCount }}</div>
              <div class="text-xs text-muted-foreground">orders</div>
            </TableCell>

            <!-- Total Spent -->
            <TableCell class="font-medium">
              Rp {{ formatPrice(customer.totalSpent) }}
            </TableCell>

            <!-- Last Order -->
            <TableCell>
              <div class="text-sm">
                {{
                  customer.lastOrderDate
                    ? formatDate(customer.lastOrderDate)
                    : "Never"
                }}
              </div>
            </TableCell>

            <!-- Status -->
            <TableCell>
              <Badge :variant="getStatusVariant(customer.activityStatus)">
                {{ getStatusLabel(customer.activityStatus) }}
              </Badge>
            </TableCell>

            <!-- Actions -->
            <TableCell class="text-center">
              <div class="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="viewCustomer(customer.id)"
                  title="View Details"
                >
                  <Eye class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="editCustomer(customer.id)"
                  title="Edit Customer"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="sendEmail(customer.id)"
                  title="Send Email"
                >
                  <Mail class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="deleteCustomer(customer.id)"
                  title="Delete Customer"
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

    <!-- Bulk Actions -->
    <div
      v-if="selectedCustomers.length > 0"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2"
    >
      <div
        class="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-4"
      >
        <span class="text-sm font-medium"
          >{{ selectedCustomers.length }} selected</span
        >
        <div class="flex gap-2">
          <Button variant="secondary" size="sm" @click="bulkEmail">
            <Mail class="h-4 w-4 mr-1" />
            Send Email
          </Button>
          <Button variant="secondary" size="sm" @click="bulkExport">
            <Download class="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="secondary" size="sm" @click="bulkDelete">
            <Trash2 class="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button variant="secondary" size="sm" @click="clearSelection">
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, computed, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  Plus,
  Search,
  Crown,
  Building,
  Eye,
  Pencil,
  Mail,
  Trash2,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next";

// Sample customers data
const allCustomers = ref([
  {
    id: "CUST-001",
    name: "Siti Aminah",
    email: "siti.aminah@email.com",
    phone: "+62 812-3456-7890",
    type: "vip",
    address: {
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
    },
    orderCount: 15,
    totalSpent: 12500000,
    lastOrderDate: "2024-01-15T10:30:00Z",
    activityStatus: "active",
    joinDate: "2023-03-15T08:00:00Z",
  },
  {
    id: "CUST-002",
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "+62 813-4567-8901",
    type: "regular",
    address: {
      city: "Bandung",
      province: "West Java",
    },
    orderCount: 8,
    totalSpent: 3200000,
    lastOrderDate: "2024-01-10T14:20:00Z",
    activityStatus: "active",
    joinDate: "2023-06-20T10:15:00Z",
  },
  {
    id: "CUST-003",
    name: "Maya Sari",
    email: "maya.sari@email.com",
    phone: "+62 814-5678-9012",
    type: "vip",
    address: {
      city: "Surabaya",
      province: "East Java",
    },
    orderCount: 22,
    totalSpent: 18750000,
    lastOrderDate: "2024-01-12T16:45:00Z",
    activityStatus: "active",
    joinDate: "2022-11-10T12:30:00Z",
  },
  {
    id: "CUST-004",
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    phone: "+62 815-6789-0123",
    type: "regular",
    address: {
      city: "Yogyakarta",
      province: "Yogyakarta",
    },
    orderCount: 5,
    totalSpent: 1850000,
    lastOrderDate: "2023-11-25T09:15:00Z",
    activityStatus: "inactive",
    joinDate: "2023-08-05T14:20:00Z",
  },
  {
    id: "CUST-005",
    name: "Dewi Lestari",
    email: "dewi.lestari@email.com",
    phone: "+62 816-7890-1234",
    type: "corporate",
    address: {
      city: "Tangerang",
      province: "Banten",
    },
    orderCount: 12,
    totalSpent: 8900000,
    lastOrderDate: "2024-01-08T11:30:00Z",
    activityStatus: "active",
    joinDate: "2023-01-15T09:45:00Z",
  },
  {
    id: "CUST-006",
    name: "Rina Wijaya",
    email: "rina.wijaya@email.com",
    phone: "+62 817-8901-2345",
    type: "regular",
    address: {
      city: "Semarang",
      province: "Central Java",
    },
    orderCount: 3,
    totalSpent: 950000,
    lastOrderDate: "2023-09-20T15:45:00Z",
    activityStatus: "at_risk",
    joinDate: "2023-07-12T16:30:00Z",
  },
]);

// Reactive data
const searchQuery = ref("");
const selectedType = ref("all");
const selectedStatus = ref("all");
const selectedLocation = ref("all");
const selectedCustomers = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Computed properties
const filteredCustomers = computed(() => {
  let filtered = allCustomers.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.id.toLowerCase().includes(query)
    );
  }

  // Type filter
  if (selectedType.value !== "all") {
    filtered = filtered.filter(
      (customer) => customer.type === selectedType.value
    );
  }

  // Status filter
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (customer) => customer.activityStatus === selectedStatus.value
    );
  }

  // Location filter
  if (selectedLocation.value !== "all") {
    filtered = filtered.filter((customer) =>
      customer.address.province
        .toLowerCase()
        .includes(selectedLocation.value.replace("_", " "))
    );
  }

  return filtered;
});

const filteredStats = computed(() => {
  const customers = filteredCustomers.value;
  return {
    total: customers.length,
    vip: customers.filter((c) => c.type === "vip").length,
    active: customers.filter((c) => c.activityStatus === "active").length,
    totalValue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };
});

const selectAll = computed(() => {
  return (
    paginatedCustomers.value.length > 0 &&
    paginatedCustomers.value.every((customer) =>
      selectedCustomers.value.includes(customer.id)
    )
  );
});

const totalPages = computed(() => {
  return Math.ceil(
    filteredCustomers.value.length / parseInt(itemsPerPage.value)
  );
});

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value);
  const end = start + parseInt(itemsPerPage.value);
  return filteredCustomers.value.slice(start, end);
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

const getTypeVariant = (type) => {
  switch (type) {
    case "vip":
      return "default";
    case "corporate":
      return "secondary";
    case "regular":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case "active":
      return "default";
    case "inactive":
      return "secondary";
    case "at_risk":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "at_risk":
      return "At Risk";
    default:
      return "Unknown";
  }
};

const filterCustomers = () => {
  currentPage.value = 1;
  selectedCustomers.value = [];
};

const toggleSelectAll = (checked) => {
  if (checked) {
    selectedCustomers.value = [...paginatedCustomers.value.map((c) => c.id)];
  } else {
    selectedCustomers.value = [];
  }
};

const toggleCustomerSelection = (customerId) => {
  const index = selectedCustomers.value.indexOf(customerId);
  if (index > -1) {
    selectedCustomers.value.splice(index, 1);
  } else {
    selectedCustomers.value.push(customerId);
  }
};

const changePage = (page) => {
  currentPage.value = page;
  selectedCustomers.value = [];
};

const clearSelection = () => {
  selectedCustomers.value = [];
};

// Navigation methods
const navigateToAddCustomer = () => {
  console.log("Navigate to add customer");
};

const viewCustomer = (id) => {
  console.log("View customer:", id);
};

const editCustomer = (id) => {
  console.log("Edit customer:", id);
};

const sendEmail = (id) => {
  console.log("Send email to customer:", id);
};

const deleteCustomer = (id) => {
  console.log("Delete customer:", id);
};

// Bulk actions
const bulkEmail = () => {
  console.log("Send bulk email to:", selectedCustomers.value);
};

const bulkExport = () => {
  console.log("Export customers:", selectedCustomers.value);
};

const bulkDelete = () => {
  console.log("Bulk delete customers:", selectedCustomers.value);
};

// Initialize
onMounted(() => {
  // Load customers data
});
</script>

<style scoped>
/* Custom styles */
</style>
