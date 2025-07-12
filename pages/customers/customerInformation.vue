<template>
  <div class="container mx-auto">
    <HeadersContent
      class="px-4"
      :title="customer?.name || 'Customer Information'"
      :description="`Customer ID: ${customer?.id || 'Loading...'}`"
    />

    <!-- Action Button -->
    <div class="flex items-center justify-between px-4 mb-6">
      <div class="flex items-center space-x-4">
        <Button @click="navigateBack" variant="outline" size="sm">
          <ArrowLeft class="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div class="flex gap-2">
        <Button @click="sendEmail" variant="outline">
          <Mail class="mr-2 h-4 w-4" />
          Send Email
        </Button>
        <Button @click="editCustomer" variant="outline">
          <Pencil class="mr-2 h-4 w-4" />
          Edit Customer
        </Button>
        <Button @click="createOrder" class="bg-primary">
          <Plus class="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <RefreshCw class="animate-spin h-8 w-8 mr-3" />
      <span>Loading customer information...</span>
    </div>

    <div v-else-if="customer" class="space-y-6 px-4">
      <!-- Customer Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Customer Profile -->
        <Card class="lg:col-span-1">
          <CardHeader>
            <CardTitle class="flex items-center">
              <User class="mr-2" />
              Customer Profile
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Avatar and Basic Info -->
            <div class="text-center">
              <div
                class="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-2xl font-bold text-gray-600">
                  {{ customer.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <h3 class="text-xl font-bold">{{ customer.name }}</h3>
              <div class="flex items-center justify-center mt-2">
                <Badge
                  :variant="getTypeVariant(customer.type)"
                  class="capitalize"
                >
                  <Crown v-if="customer.type === 'vip'" class="mr-1 h-3 w-3" />
                  <Building
                    v-if="customer.type === 'corporate'"
                    class="mr-1 h-3 w-3"
                  />
                  {{ customer.type }} Customer
                </Badge>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <Mail class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm">{{ customer.email }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <Phone class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm">{{ customer.phone }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <MapPin class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm"
                  >{{ customer.address.city }},
                  {{ customer.address.province }}</span
                >
              </div>
              <div class="flex items-center space-x-3">
                <Calendar class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm"
                  >Joined {{ formatDate(customer.joinDate) }}</span
                >
              </div>
            </div>

            <!-- Activity Status -->
            <div class="pt-4 border-t">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Activity Status</span>
                <Badge :variant="getStatusVariant(customer.activityStatus)">
                  {{ getStatusLabel(customer.activityStatus) }}
                </Badge>
              </div>
              <div class="text-xs text-muted-foreground mt-1">
                Last order:
                {{
                  customer.lastOrderDate
                    ? formatDate(customer.lastOrderDate)
                    : "Never"
                }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Customer Statistics -->
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle class="flex items-center">
              <BarChart3 class="mr-2" />
              Customer Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div class="text-start p-4 bg-blue-50 rounded-lg">
                <div class="text-xl font-bold text-blue-600">
                  {{ customer.orderCount }}
                </div>
                <div class="text-sm text-blue-700">Total Orders</div>
              </div>
              <div class="text-start p-4 bg-green-50 rounded-lg">
                <div class="text-xl font-bold text-green-600">
                  Rp {{ formatPrice(customer.totalSpent) }}
                </div>
                <div class="text-sm text-green-700">Total Spent</div>
              </div>
              <div class="text-start p-4 bg-purple-50 rounded-lg">
                <div class="text-xl font-bold text-purple-600">
                  Rp {{ formatPrice(customer.avgOrderValue) }}
                </div>
                <div class="text-sm text-purple-700">Avg Order Value</div>
              </div>
              <div class="text-start p-4 bg-orange-50 rounded-lg">
                <div class="text-xl font-bold text-orange-600">
                  {{ customer.loyaltyPoints }}
                </div>
                <div class="text-sm text-orange-700">Loyalty Points</div>
              </div>
            </div>

            <!-- Customer Insights -->
            <div class="mt-6 space-y-3">
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <span class="text-sm font-medium">Customer Lifetime Value</span>
                <span class="font-bold"
                  >Rp {{ formatPrice(customer.clv) }}</span
                >
              </div>
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <span class="text-sm font-medium">Days Since Last Order</span>
                <span class="font-bold"
                  >{{ customer.daysSinceLastOrder }} days</span
                >
              </div>
              <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <span class="text-sm font-medium"
                  >Favorite Product Category</span
                >
                <span class="font-bold">{{ customer.favoriteCategory }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Order History -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center">
              <ShoppingCart class="mr-2 h-5 w-5" />
              Order History ({{ orderHistory.length }} orders)
            </CardTitle>
            <div class="flex gap-2">
              <Select v-model="orderFilter" @update:modelValue="filterOrders">
                <SelectTrigger class="w-48">
                  <SelectValue placeholder="Filter orders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" @click="exportOrderHistory">
                <Download class="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-if="filteredOrderHistory.length === 0"
              class="text-center py-8 text-gray-500"
            >
              <ShoppingCart class="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p class="text-lg font-medium">No orders found</p>
              <p class="text-sm">This customer hasn't placed any orders yet</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="order in filteredOrderHistory"
                :key="order.id"
                class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <Badge variant="outline" class="font-mono">{{
                      order.id
                    }}</Badge>
                    <Badge :variant="getOrderStatusVariant(order.status)">
                      {{ order.status }}
                    </Badge>
                    <span class="text-sm text-muted-foreground">
                      {{ formatDateTime(order.orderDate) }}
                    </span>
                  </div>
                  <div class="text-right">
                    <div class="font-bold">
                      Rp {{ formatPrice(order.total) }}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {{ order.items.length }} items
                    </div>
                  </div>
                </div>

                <!-- Order Items -->
                <div class="space-y-2">
                  <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="flex items-center justify-between text-sm"
                  >
                    <div class="flex items-center space-x-2">
                      <span class="font-medium">{{ item.name }}</span>
                      <span class="text-muted-foreground"
                        >x{{ item.quantity }}</span
                      >
                    </div>
                    <span>Rp {{ formatPrice(item.subtotal) }}</span>
                  </div>
                </div>

                <!-- Order Timeline -->
                <div v-if="order.timeline" class="mt-3 pt-3 border-t">
                  <div
                    class="flex items-center space-x-4 text-xs text-muted-foreground"
                  >
                    <div
                      v-if="order.timeline.ordered"
                      class="flex items-center space-x-1"
                    >
                      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span
                        >Ordered: {{ formatTime(order.timeline.ordered) }}</span
                      >
                    </div>
                    <div
                      v-if="order.timeline.processing"
                      class="flex items-center space-x-1"
                    >
                      <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span
                        >Processing:
                        {{ formatTime(order.timeline.processing) }}</span
                      >
                    </div>
                    <div
                      v-if="order.timeline.completed"
                      class="flex items-center space-x-1"
                    >
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span
                        >Completed:
                        {{ formatTime(order.timeline.completed) }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Order Actions -->
                <div
                  class="flex items-center justify-end space-x-2 mt-3 pt-3 border-t"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="viewOrderDetails(order.id)"
                  >
                    <Eye class="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    v-if="order.status === 'completed'"
                    variant="ghost"
                    size="sm"
                    @click="reorderItems(order.id)"
                  >
                    <RotateCcw class="h-4 w-4 mr-1" />
                    Reorder
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="downloadInvoice(order.id)"
                  >
                    <Download class="h-4 w-4 mr-1" />
                    Invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Customer Preferences & Notes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <!-- Preferences -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <Settings class="mr-2 h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label class="font-medium">Communication</Label>
              <div class="mt-2 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm">Email Notifications</span>
                  <Badge
                    :variant="
                      customer.preferences.emailNotifications
                        ? 'default'
                        : 'secondary'
                    "
                  >
                    {{
                      customer.preferences.emailNotifications
                        ? "Enabled"
                        : "Disabled"
                    }}
                  </Badge>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">SMS Notifications</span>
                  <Badge
                    :variant="
                      customer.preferences.smsNotifications
                        ? 'default'
                        : 'secondary'
                    "
                  >
                    {{
                      customer.preferences.smsNotifications
                        ? "Enabled"
                        : "Disabled"
                    }}
                  </Badge>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Promotional Emails</span>
                  <Badge
                    :variant="
                      customer.preferences.promotionalEmails
                        ? 'default'
                        : 'secondary'
                    "
                  >
                    {{
                      customer.preferences.promotionalEmails
                        ? "Enabled"
                        : "Disabled"
                    }}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <Label class="font-medium">Dietary Preferences</Label>
              <div class="mt-2 flex flex-wrap gap-2">
                <Badge
                  v-if="customer.preferences.dietary.vegetarian"
                  variant="outline"
                  >Vegetarian</Badge
                >
                <Badge
                  v-if="customer.preferences.dietary.vegan"
                  variant="outline"
                  >Vegan</Badge
                >
                <Badge
                  v-if="customer.preferences.dietary.glutenFree"
                  variant="outline"
                  >Gluten-free</Badge
                >
                <Badge
                  v-if="customer.preferences.dietary.sugarFree"
                  variant="outline"
                  >Sugar-free</Badge
                >
                <span
                  v-if="!hasAnyDietaryPreference"
                  class="text-sm text-muted-foreground"
                  >No dietary restrictions</span
                >
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Notes & Activity -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <FileText class="mr-2 h-5 w-5" />
              Notes & Activity
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label class="font-medium">Customer Notes</Label>
              <div class="mt-2 p-3 bg-gray-50 rounded text-sm">
                {{ customer.notes || "No notes available" }}
              </div>
            </div>

            <div>
              <Label class="font-medium">Recent Activity</Label>
              <div class="mt-2 space-y-2">
                <div
                  v-for="activity in customer.recentActivity"
                  :key="activity.id"
                  class="flex items-start space-x-2 text-sm"
                >
                  <div
                    class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"
                  ></div>
                  <div>
                    <div>{{ activity.description }}</div>
                    <div class="text-muted-foreground">
                      {{ formatRelativeTime(activity.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, computed, onMounted } from "vue";
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
  ArrowLeft,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  User,
  Crown,
  Building,
  Phone,
  MapPin,
  Calendar,
  BarChart3,
  ShoppingCart,
  Download,
  Eye,
  RotateCcw,
  Settings,
  FileText,
} from "lucide-vue-next";

definePageMeta({
  middleware: "auth",
});

// Props (in real app, this would come from route params)
const customerId = ref("CUST-001");

// State
const isLoading = ref(true);
const orderFilter = ref("all");

// Sample customer data
const customer = ref(null);
const orderHistory = ref([]);

// Sample data
const sampleCustomer = {
  id: "CUST-001",
  name: "Siti Aminah",
  email: "siti.aminah@email.com",
  phone: "+62 812-3456-7890",
  type: "vip",
  address: {
    street: "Jl. Sudirman No. 123",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postalCode: "12190",
  },
  orderCount: 15,
  totalSpent: 12500000,
  avgOrderValue: 833333,
  loyaltyPoints: 1250,
  clv: 15000000,
  lastOrderDate: "2024-01-15T10:30:00Z",
  daysSinceLastOrder: 3,
  favoriteCategory: "Custom Cakes",
  activityStatus: "active",
  joinDate: "2023-03-15T08:00:00Z",
  preferences: {
    emailNotifications: true,
    smsNotifications: true,
    promotionalEmails: false,
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      sugarFree: false,
    },
  },
  notes:
    "VIP customer with gluten-free dietary requirements. Prefers custom wedding cakes. Very responsive to email communications.",
  recentActivity: [
    {
      id: "ACT-001",
      description: "Placed order ORD-156 for Wedding Cake 3 Tier",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: "ACT-002",
      description: "Updated delivery address",
      timestamp: "2024-01-10T14:20:00Z",
    },
    {
      id: "ACT-003",
      description: "Left 5-star review for previous order",
      timestamp: "2024-01-08T16:45:00Z",
    },
  ],
};

const sampleOrderHistory = [
  {
    id: "ORD-156",
    orderDate: "2024-01-15T10:30:00Z",
    status: "processing",
    total: 2500000,
    items: [
      { id: "P1", name: "Wedding Cake 3 Tier", quantity: 1, subtotal: 2500000 },
    ],
    timeline: {
      ordered: "2024-01-15T10:30:00Z",
      processing: "2024-01-15T12:00:00Z",
    },
  },
  {
    id: "ORD-142",
    orderDate: "2024-01-08T14:20:00Z",
    status: "completed",
    total: 850000,
    items: [
      { id: "P2", name: "Birthday Cake Custom", quantity: 1, subtotal: 600000 },
      { id: "P3", name: "Cupcakes", quantity: 25, subtotal: 250000 },
    ],
    timeline: {
      ordered: "2024-01-08T14:20:00Z",
      processing: "2024-01-08T16:00:00Z",
      completed: "2024-01-09T10:30:00Z",
    },
  },
  {
    id: "ORD-128",
    orderDate: "2023-12-20T09:15:00Z",
    status: "completed",
    total: 1200000,
    items: [
      {
        id: "P4",
        name: "Christmas Cake Special",
        quantity: 1,
        subtotal: 800000,
      },
      { id: "P5", name: "Cookies Gift Box", quantity: 2, subtotal: 400000 },
    ],
    timeline: {
      ordered: "2023-12-20T09:15:00Z",
      processing: "2023-12-20T11:00:00Z",
      completed: "2023-12-21T15:30:00Z",
    },
  },
];

// Computed
const filteredOrderHistory = computed(() => {
  if (orderFilter.value === "all") {
    return orderHistory.value;
  }
  return orderHistory.value.filter(
    (order) => order.status === orderFilter.value
  );
});

const hasAnyDietaryPreference = computed(() => {
  if (!customer.value) return false;
  const dietary = customer.value.preferences.dietary;
  return (
    dietary.vegetarian ||
    dietary.vegan ||
    dietary.glutenFree ||
    dietary.sugarFree
  );
});

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
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

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
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

const getOrderStatusVariant = (status) => {
  switch (status) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const filterOrders = () => {
  // Filter logic is handled by computed property
};

// Actions
const navigateBack = () => {
  console.log("Navigate back to customer list");
};

const sendEmail = () => {
  console.log("Send email to customer:", customer.value.id);
};

const editCustomer = () => {
  console.log("Edit customer:", customer.value.id);
};

const createOrder = () => {
  console.log("Create order for customer:", customer.value.id);
};

const exportOrderHistory = () => {
  console.log("Export order history for customer:", customer.value.id);
};

const viewOrderDetails = (orderId) => {
  console.log("View order details:", orderId);
};

const reorderItems = (orderId) => {
  console.log("Reorder items from order:", orderId);
};

const downloadInvoice = (orderId) => {
  console.log("Download invoice for order:", orderId);
};

// Load customer data
const loadCustomerData = async () => {
  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    customer.value = sampleCustomer;
    orderHistory.value = sampleOrderHistory;
  } catch (error) {
    console.error("Error loading customer data:", error);
  } finally {
    isLoading.value = false;
  }
};

// Initialize
onMounted(() => {
  loadCustomerData();
});
</script>

<style scoped>
/* Custom styles */
</style>
