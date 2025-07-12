<template>
  <div class="container mx-auto min-w-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-4">
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
      <div class="relative flex-1 w-full">
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
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 px-4">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Total Customers</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ filteredStats.total }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">VIP Customers</CardTitle>
          <CrownIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ filteredStats.vip }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Active Customers</CardTitle>
          <Activity class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ filteredStats.active }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium"
            >Total Customer Value</CardTitle
          >
          <ChartBarIncreasing class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            Rp {{ formatPrice(filteredStats.totalValue) }}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="text-lg">Loading customers...</div>
    </div>

    <!-- Customer Table -->
    <div v-else class="border rounded-lg">
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
                    {{ getCustomerInitial(customer) }}
                  </span>
                </div>
                <div>
                  <div class="font-medium">{{ getCustomerName(customer) }}</div>
                  <div class="text-sm text-muted-foreground">
                    ID: {{ customer.id }}
                  </div>
                </div>
              </div>
            </TableCell>

            <!-- Contact -->
            <TableCell>
              <div class="text-sm">
                <div>{{ customer.email || "No email" }}</div>
                <div class="text-muted-foreground">
                  {{ customer.phone || customer.phoneNumber || "No phone" }}
                </div>
              </div>
            </TableCell>

            <!-- Type -->
            <TableCell>
              <Badge
                :variant="getTypeVariant(getCustomerType(customer))"
                class="capitalize"
              >
                <Crown
                  v-if="getCustomerType(customer) === 'vip'"
                  class="mr-1 h-3 w-3"
                />
                <Building
                  v-if="getCustomerType(customer) === 'corporate'"
                  class="mr-1 h-3 w-3"
                />
                {{ getCustomerType(customer) }}
              </Badge>
            </TableCell>

            <!-- Location -->
            <TableCell>
              <div class="text-sm">
                <div>{{ getCustomerCity(customer) }}</div>
                <div class="text-muted-foreground">
                  {{ getCustomerProvince(customer) }}
                </div>
              </div>
            </TableCell>

            <!-- Orders -->
            <TableCell class="text-center">
              <div class="font-medium">{{ customer.totalOrders || 0 }}</div>
              <div class="text-xs text-muted-foreground">orders</div>
            </TableCell>

            <!-- Total Spent -->
            <TableCell class="font-medium">
              Rp {{ formatPrice(customer.totalSpent || 0) }}
            </TableCell>

            <!-- Status -->
            <TableCell>
              <Badge :variant="getStatusVariant(getCustomerStatus(customer))">
                {{ getStatusLabel(getCustomerStatus(customer)) }}
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
                  @click="
                    confirmDeleteCustomer(
                      customer.id,
                      getCustomerName(customer)
                    )
                  "
                  title="Delete Customer"
                  :disabled="deleting"
                >
                  <Trash2 class="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && filteredCustomers.length === 0"
      class="text-center py-8"
    >
      <p class="text-lg text-muted-foreground">No customers found</p>
      <p class="text-sm text-muted-foreground">
        Try adjusting your search or filters
      </p>
    </div>

    <!-- Pagination -->
    <div
      v-if="filteredCustomers.length > 0"
      class="flex items-center justify-between space-x-2 p-4 mx-4"
    >
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
          <Button
            variant="secondary"
            size="sm"
            @click="confirmBulkDelete"
            :disabled="deleting"
          >
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
  Users,
  CrownIcon,
  Activity,
  ChartBarIncreasing,
} from "lucide-vue-next";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

definePageMeta({
  middleware: "auth",
});

// Firebase
const { $firebase } = useNuxtApp();

// Reactive data
const allCustomers = ref([]);
const loading = ref(false);
const deleting = ref(false);
const searchQuery = ref("");
const selectedType = ref("all");
const selectedStatus = ref("all");
const selectedLocation = ref("all");
const selectedCustomers = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref("10");

// Helper functions to handle different data structures
const getCustomerName = (customer) => {
  return (
    customer.fullName ||
    customer.name ||
    customer.firstName + " " + (customer.lastName || "") ||
    "Unknown"
  );
};

const getCustomerInitial = (customer) => {
  const name = getCustomerName(customer);
  return name.charAt(0).toUpperCase();
};

const getCustomerType = (customer) => {
  return customer.customerType || customer.type || "regular";
};

const getCustomerStatus = (customer) => {
  return customer.activityStatus || customer.status || "active";
};

const getCustomerCity = (customer) => {
  if (customer.address && customer.address.city) {
    return customer.address.city;
  }
  return customer.city || "Unknown";
};

const getCustomerProvince = (customer) => {
  if (customer.address && customer.address.province) {
    return customer.address.province;
  }
  return customer.province || "Unknown";
};

// Computed properties
const filteredCustomers = computed(() => {
  let filtered = allCustomers.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (customer) =>
        getCustomerName(customer).toLowerCase().includes(query) ||
        (customer.email && customer.email.toLowerCase().includes(query)) ||
        (customer.phone && customer.phone.includes(query)) ||
        (customer.phoneNumber && customer.phoneNumber.includes(query)) ||
        customer.id.toLowerCase().includes(query)
    );
  }

  // Type filter
  if (selectedType.value !== "all") {
    filtered = filtered.filter(
      (customer) => getCustomerType(customer) === selectedType.value
    );
  }

  // Status filter
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (customer) => getCustomerStatus(customer) === selectedStatus.value
    );
  }

  // Location filter
  if (selectedLocation.value !== "all") {
    const locationMap = {
      jakarta: "jakarta",
      west_java: "west java",
      central_java: "central java",
      east_java: "east java",
      banten: "banten",
    };

    const searchLocation = locationMap[selectedLocation.value];
    filtered = filtered.filter((customer) => {
      const province = getCustomerProvince(customer).toLowerCase();
      return (
        province.includes(searchLocation) ||
        province.includes(selectedLocation.value.replace("_", " "))
      );
    });
  }

  return filtered;
});

const filteredStats = computed(() => {
  const customers = filteredCustomers.value;
  return {
    total: customers.length,
    vip: customers.filter((c) => getCustomerType(c) === "vip").length,
    active: customers.filter((c) => getCustomerStatus(c) === "active").length,
    totalValue: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
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
  return new Intl.NumberFormat("id-ID").format(price || 0);
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
  navigateTo("/customers/addCustomer");
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

// Delete functions
const confirmDeleteCustomer = (id, name) => {
  if (
    confirm(
      `Are you sure you want to delete customer "${name}"? This action cannot be undone.`
    )
  ) {
    deleteCustomer(id);
  }
};

const deleteCustomer = async (id) => {
  try {
    deleting.value = true;

    // Delete from Firestore
    await deleteDoc(doc($firebase.firestore, "customers", id));

    // Remove from local array
    const index = allCustomers.value.findIndex(
      (customer) => customer.id === id
    );
    if (index > -1) {
      allCustomers.value.splice(index, 1);
    }

    // Remove from selection if selected
    const selectionIndex = selectedCustomers.value.indexOf(id);
    if (selectionIndex > -1) {
      selectedCustomers.value.splice(selectionIndex, 1);
    }

    console.log("Customer deleted successfully");

    // If current page is empty after deletion, go to previous page
    if (paginatedCustomers.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    alert("Failed to delete customer. Please try again.");
  } finally {
    deleting.value = false;
  }
};

const confirmBulkDelete = () => {
  const count = selectedCustomers.value.length;
  if (
    confirm(
      `Are you sure you want to delete ${count} customer(s)? This action cannot be undone.`
    )
  ) {
    bulkDelete();
  }
};

const bulkDelete = async () => {
  try {
    deleting.value = true;

    // Delete all selected customers
    const deletePromises = selectedCustomers.value.map((id) =>
      deleteDoc(doc($firebase.firestore, "customers", id))
    );

    await Promise.all(deletePromises);

    // Remove from local array
    allCustomers.value = allCustomers.value.filter(
      (customer) => !selectedCustomers.value.includes(customer.id)
    );

    // Clear selection
    selectedCustomers.value = [];

    console.log("Customers deleted successfully");

    // If current page is empty after deletion, go to previous page
    if (paginatedCustomers.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    console.error("Error deleting customers:", error);
    alert("Failed to delete some customers. Please try again.");
  } finally {
    deleting.value = false;
  }
};

// Other bulk actions
const bulkEmail = () => {
  console.log("Send bulk email to:", selectedCustomers.value);
};

const bulkExport = () => {
  console.log("Export customers:", selectedCustomers.value);
};

// Fetch customers from Firebase
const fetchCustomers = async () => {
  try {
    loading.value = true;
    const customersCollection = collection($firebase.firestore, "customers");
    const q = query(customersCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const customers = [];
    querySnapshot.forEach((doc) => {
      customers.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    allCustomers.value = customers;
    console.log("Customers loaded successfully:", allCustomers.value.length);
  } catch (error) {
    console.error("Error fetching customers:", error);
    alert("Failed to load customers. Please refresh the page.");
  } finally {
    loading.value = false;
  }
};

// Initialize
onMounted(() => {
  fetchCustomers();
});
</script>

<style scoped>
/* Custom styles */
</style>
