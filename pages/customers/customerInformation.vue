<template>
  <div class="container mx-auto min-w-full">
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
import { ref, computed, onMounted, watch } from "vue";
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
import { useNuxtApp } from "#app";
import { useRoute} from "#app";

// Firebase imports
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

definePageMeta({
  middleware: "auth",
});

// Firebase Instance
const { $firebase } = useNuxtApp();
// Route parameter and debugging
const route = useRoute();
const customerId = ref(null);


// State
const isLoading = ref(true);
const error = ref(null);
const orderFilter = ref("all");

// Data
const customer = ref(null); // This will hold the full customer object including stats
const orderHistory = ref([]);

// Watch for route params changes to load customer data
watch(
  () => route.params.id,
  (newId) => {
    console.log('Route param changed:', newId);
    customerId.value = newId;
    if (newId && newId !== 'undefined' && newId !== '') {
      loadCustomerData();
    } else {
      error.value = "Customer ID is missing in the URL.";
      isLoading.value = false;
    }
  },
  { immediate: true }
);

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
  if (!customer.value?.preferences?.dietary) return false;
  const dietary = customer.value.preferences.dietary;
  return (
    dietary.vegetarian ||
    dietary.vegan ||
    dietary.glutenFree ||
    dietary.sugarFree
  );
});

// Firebase Methods
const loadCustomerData = async () => {
  console.log('Loading customer data for ID:', customerId.value);
  if (!customerId.value || customerId.value === 'undefined' || customerId.value === '') {
    console.error('No valid customer ID provided for loadCustomerData:', customerId.value);
    error.value = "Customer ID is required. Please check the URL format.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;

    // Load customer data from 'customers' collection
    const customerDocRef = doc($firebase.firestore, "customers", customerId.value);
    const customerDoc = await getDoc(customerDocRef);

    if (customerDoc.exists()) {
      const customerData = customerDoc.data();
      console.log('Customer data from Firestore:', customerData);

      // Initialize customer object with safe defaults for nested properties
      customer.value = {
        id: customerDoc.id,
        name: customerData.fullName || customerData.firstName + ' ' + (customerData.lastName || '') || 'Unknown Customer',
        email: customerData.email || '',
        phone: customerData.phone || customerData.emergencyContact?.phone || '',
        type: customerData.customerType || 'regular',
        address: { // Ensure address is always an object
          street: customerData.address?.street || '',
          city: customerData.address?.city || '',
          province: customerData.address?.province || '',
          postalCode: customerData.address?.postalCode || ''
        },
        joinDate: customerData.createdAt,
        dateOfBirth: customerData.dateOfBirth,
        lastOrderDate: customerData.lastOrderDate,
        activityStatus: customerData.activityStatus || 'active',
        preferences: { // Ensure preferences is always an object
          emailNotifications: customerData.preferences?.emailNotifications ?? true,
          smsNotifications: customerData.preferences?.smsNotifications ?? false,
          promotionalEmails: customerData.preferences?.promotionalEmails ?? false,
          orderUpdates: customerData.preferences?.orderUpdates ?? true,
          dietary: { // Ensure dietary is always an object
            vegetarian: customerData.preferences?.dietary?.vegetarian ?? false,
            vegan: customerData.preferences?.dietary?.vegan ?? false,
            glutenFree: customerData.preferences?.dietary?.glutenFree ?? false,
            sugarFree: customerData.preferences?.dietary?.sugarFree ?? false
          }
        },
        notes: customerData.notes || '',
        recentActivity: customerData.recentActivity || [],
        emergencyContact: customerData.emergencyContact || {},
        // Initialize stats directly on customer object
        orderCount: customerData.totalOrders || 0, // Use existing totalOrders from customer doc
        totalSpent: customerData.totalSpent || 0, // Use existing totalSpent from customer doc
        avgOrderValue: 0, // Will be calculated from orders
        loyaltyPoints: 0, // Will be calculated from orders
        clv: 0, // Will be calculated from orders
        daysSinceLastOrder: 0, // Will be calculated from orders
        favoriteCategory: 'N/A' // Will be calculated from orders
      };
      console.log('Customer object set:', customer.value);

      // Load customer orders and calculate derived stats
      await loadCustomerOrders();

    } else {
      console.log('Customer not found in customers collection, trying orders collection...');
      // Fallback: Try to load customer info from orders if not found in 'customers' collection
      await loadCustomerFromOrders();
    }
  } catch (err) {
    console.error('Error loading customer data:', err);
    error.value = 'Failed to load customer data: ' + err.message;
  } finally {
    isLoading.value = false;
  }
};

const loadCustomerFromOrders = async () => {
  try {
    console.log('Attempting to load customer from orders collection as fallback...');
    const ordersCollection = collection($firebase.firestore, "orders");

    // Try to query by customerEmail first (assuming customerId might be an email)
    let customerOrdersQuery = query(
      ordersCollection,
      where("customerEmail", "==", customerId.value),
      orderBy("createdAt", "desc"),
      limit(1) // Get the most recent order to extract customer info
    );
    let querySnapshot = await getDocs(customerOrdersQuery);

    // If no orders found by email, try by customerName
    if (querySnapshot.empty) {
      console.log('No orders found by email, trying by customerName...');
      customerOrdersQuery = query(
        ordersCollection,
        where("customerName", "==", customerId.value),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      querySnapshot = await getDocs(customerOrdersQuery);
    }

    if (querySnapshot.empty) {
      error.value = `Customer not found. Searched for: ${customerId.value}`;
      return;
    }

    const firstOrder = querySnapshot.docs[0].data();
    console.log('Customer info derived from first order:', firstOrder);

    // Create a temporary customer object from order data
    customer.value = {
      id: customerId.value, // Use customerId from URL as ID
      name: firstOrder.customerName || 'Unknown Customer',
      email: firstOrder.customerEmail || '',
      phone: firstOrder.customerPhone || '',
      type: firstOrder.customerType || 'regular',
      address: { street: firstOrder.shippingAddress || '', city: '', province: '', postalCode: '' },
      joinDate: firstOrder.createdAt,
      lastOrderDate: null, // Will be updated by calculateCustomerStats
      activityStatus: 'active',
      preferences: { emailNotifications: true, smsNotifications: false, promotionalEmails: false, orderUpdates: true, dietary: {} },
      notes: '',
      recentActivity: [],
      emergencyContact: {},
      // Initialize stats directly on customer object
      orderCount: 0,
      totalSpent: 0,
      avgOrderValue: 0,
      loyaltyPoints: 0,
      clv: 0,
      daysSinceLastOrder: 0,
      favoriteCategory: 'N/A'
    };

    // Now load all orders for this customer (using email/name from the derived customer object)
    await loadCustomerOrders();

  } catch (err) {
    console.error('Error loading customer from orders as fallback:', err);
    error.value = 'Failed to load customer data from orders: ' + err.message;
  }
};

const loadCustomerOrders = async () => {
  if (!customer.value) return; // Ensure customer object exists

  try {
    const ordersCollection = collection($firebase.firestore, "orders");
    let customerOrdersQuery;

    // Prioritize querying by customerId if it's a valid Firestore document ID
    if (customer.value.id && customer.value.id !== 'undefined' && customer.value.id !== '') {
      customerOrdersQuery = query(
        ordersCollection,
        where("customerId", "==", customer.value.id),
        orderBy("createdAt", "desc")
      );
    } else if (customer.value.email) { // Fallback to email if no customerId or it's not a doc ID
      customerOrdersQuery = query(
        ordersCollection,
        where("customerEmail", "==", customer.value.email),
        orderBy("createdAt", "desc")
      );
    } else if (customer.value.name) { // Fallback to name if no email
      customerOrdersQuery = query(
        ordersCollection,
        where("customerName", "==", customer.value.name),
        orderBy("createdAt", "desc")
      );
    } else {
      console.warn("Cannot load customer orders: No valid customer ID, email, or name available.");
      orderHistory.value = [];
      calculateCustomerStats([]); // Calculate stats with empty orders
      return;
    }

    const querySnapshot = await getDocs(customerOrdersQuery);
    console.log('Orders found for customer:', querySnapshot.size);

    const orders = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.orderId || doc.id, // Use orderId if available, otherwise doc.id
        orderDate: data.createdAt,
        status: data.status,
        total: data.grandTotal || data.total || data.subtotal || 0, // Use grandTotal
        items: data.products || data.items || [], // Use products or items
        timeline: {
          ordered: data.createdAt,
          processing: data.processingStarted,
          completed: data.completedAt || data.completionDate,
        }
      };
    });

    orderHistory.value = orders.sort((a, b) => {
      const dateA = a.orderDate?.toDate ? a.orderDate.toDate() : new Date(a.orderDate);
      const dateB = b.orderDate?.toDate ? b.orderDate.toDate() : new Date(b.orderDate);
      return dateB - dateA;
    });

    calculateCustomerStats(orderHistory.value); // Pass the loaded orders to calculate stats
  } catch (err) {
    console.error('Error loading customer orders:', err);
    error.value = 'Failed to load customer orders: ' + err.message;
  }
};

const calculateCustomerStats = (orders) => {
  if (!customer.value) return; // Safety check

  const completedOrders = orders.filter(order => order.status === 'complete' || order.status === 'completed');
  const totalSpent = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const orderCount = completedOrders.length;
  const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;

  let daysSinceLastOrder = 0;
  if (orders.length > 0) {
    const lastOrderDate = orders[0].orderDate?.toDate ? orders[0].orderDate.toDate() : new Date(orders[0].orderDate);
    const now = new Date();
    daysSinceLastOrder = Math.floor((now - lastOrderDate) / (1000 * 60 * 60 * 24));
    customer.value.lastOrderDate = orders[0].orderDate; // Update customer's last order date directly
  } else {
    customer.value.lastOrderDate = null; // No orders, so no last order date
  }

  const categoryCount = {};
  orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const category = item.category || 'Uncategorized';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    }
  });
  const favoriteCategory = Object.keys(categoryCount).length > 0
    ? Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b)
    : 'N/A';

  // Update customer.value directly with calculated stats
  customer.value.orderCount = orderCount;
  customer.value.totalSpent = totalSpent;
  customer.value.avgOrderValue = avgOrderValue;
  customer.value.loyaltyPoints = Math.floor(totalSpent / 10000); // 1 point per 10k spent
  customer.value.clv = totalSpent * 1.2; // Simple CLV calculation
  customer.value.daysSinceLastOrder = daysSinceLastOrder;
  customer.value.favoriteCategory = favoriteCategory;
};

// Utility Methods
const formatPrice = (price) => {
  if (typeof price !== 'number') return "0"; // Ensure price is a number
  return new Intl.NumberFormat("id-ID").format(price);
};

const formatDate = (dateInput) => {
  if (!dateInput) return "N/A";
  let date;
  if (dateInput.toDate && typeof dateInput.toDate === "function") {
    date = dateInput.toDate();
  } else if (typeof dateInput === "string" || typeof dateInput === "number") {
    date = new Date(dateInput);
  } else {
    date = new Date(); // Fallback to current date if invalid
  }
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateInput) => {
  if (!dateInput) return "N/A";
  let date;
  if (dateInput.toDate && typeof dateInput.toDate === "function") {
    date = dateInput.toDate();
  } else if (typeof dateInput === "string" || typeof dateInput === "number") {
    date = new Date(dateInput);
  } else {
    date = new Date(); // Fallback to current date if invalid
  }
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (dateInput) => {
  if (!dateInput) return "N/A";
  let date;
  if (dateInput.toDate && typeof dateInput.toDate === "function") {
    date = dateInput.toDate();
  } else if (typeof dateInput === "string" || typeof dateInput === "number") {
    date = new Date(dateInput);
  } else {
    date = new Date(); // Fallback to current date if invalid
  }
  return date.toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "N/A";
  const now = new Date();
  const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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
    case "complete":
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
  navigateTo('/customers/listCustomer');
};

const sendEmail = () => {
  console.log("Send email to customer:", customer.value.id);
};

const editCustomer = () => {
  navigateTo(`/customers/${customer.value.id}/edit`);
};

const createOrder = () => {
  navigateTo(`/orders/add?customerId=${customer.value.id}`);
};

const exportOrderHistory = () => {
  console.log("Export order history for customer:", customer.value.id);
  // Implement CSV/Excel export for customer's orders
  const csvData = orderHistory.value.map(order => ({
    'Order ID': order.id,
    'Order Date': formatDateTime(order.orderDate),
    'Status': order.status,
    'Total': order.total,
    'Items': order.items.map(item => `${item.name} x${item.quantity}`).join('; ')
  }));

  const csv = convertToCSV(csvData);
  downloadCSV(csv, `customer-${customer.value.id}-orders.csv`);
};

const viewOrderDetails = (orderId) => {
  navigateTo(`/orders/${orderId}`);
};

const reorderItems = (orderId) => {
  navigateTo(`/orders/add?reorder=${orderId}`);
};

const downloadInvoice = (orderId) => {
  console.log("Download invoice for order:", orderId);
};

const convertToCSV = (data) => {
  if (!data.length) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${String(row[header]).replace(/"/g, '""')}"`).join(','))
  ].join('n');

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
</script>

<style scoped>
/* Custom styles */
</style>
