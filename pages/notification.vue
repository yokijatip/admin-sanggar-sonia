<template>
  <div class="container mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 mb-6">
      <HeadersContent
        title="Notifications"
        description="Stay updated with all your important activities and alerts"
      />
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          @click="markAllAsRead"
          :disabled="unreadCount === 0"
        >
          <CheckCircle class="mr-2 h-4 w-4" />
          Mark All Read
        </Button>
        <Button variant="outline" @click="showNotificationSettings = true">
          <Settings class="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 space-y-6">
      <!-- Notification Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent class="p-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ unreadCount }}</p>
              <p class="text-sm text-muted-foreground">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ todayCount }}</p>
              <p class="text-sm text-muted-foreground">Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-orange-600">
                {{ urgentCount }}
              </p>
              <p class="text-sm text-muted-foreground">Urgent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-600">{{ totalCount }}</p>
              <p class="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Filters -->
      <Card>
        <CardContent class="p-4">
          <div class="flex flex-wrap items-center gap-4">
            <!-- Search -->
            <div class="relative flex-1 min-w-64">
              <Search
                class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
              />
              <Input
                v-model="searchQuery"
                placeholder="Search notifications..."
                class="pl-10"
              />
            </div>

            <!-- Type Filter -->
            <Select v-model="selectedType">
              <SelectTrigger class="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="customer">Customers</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>

            <!-- Status Filter -->
            <Select v-model="selectedStatus">
              <SelectTrigger class="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <!-- Priority Filter -->
            <Select v-model="selectedPriority">
              <SelectTrigger class="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <!-- Notifications List -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center">
              <Bell class="mr-2 h-5 w-5" />
              Recent Notifications
            </CardTitle>
            <div class="flex items-center space-x-2">
              <Button variant="ghost" size="sm" @click="refreshNotifications">
                <RefreshCw class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" @click="toggleView">
                <List class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <div class="space-y-0">
            <div
              v-for="notification in filteredNotifications"
              :key="notification.id"
              :class="[
                'flex items-start space-x-4 p-6 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer',
                !notification.read
                  ? 'bg-blue-50/50 border-l-4 border-l-blue-500'
                  : '',
              ]"
              @click="markAsRead(notification.id)"
            >
              <!-- Icon -->
              <div
                :class="[
                  'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0',
                  getNotificationIconBg(notification.type),
                ]"
              >
                <component
                  :is="getNotificationIcon(notification.type)"
                  :class="[
                    'h-5 w-5',
                    getNotificationIconColor(notification.type),
                  ]"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <h4
                        :class="[
                          'font-medium',
                          !notification.read
                            ? 'text-foreground'
                            : 'text-muted-foreground',
                        ]"
                      >
                        {{ notification.title }}
                      </h4>
                      <Badge
                        :variant="getPriorityVariant(notification.priority)"
                        v-if="notification.priority !== 'normal'"
                      >
                        {{ notification.priority }}
                      </Badge>
                      <Badge :variant="getTypeVariant(notification.type)">
                        {{ notification.type }}
                      </Badge>
                    </div>
                    <p
                      :class="[
                        'text-sm mb-2',
                        !notification.read
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                      ]"
                    >
                      {{ notification.message }}
                    </p>
                    <div
                      class="flex items-center space-x-4 text-xs text-muted-foreground"
                    >
                      <span class="flex items-center">
                        <Clock class="mr-1 h-3 w-3" />
                        {{ formatRelativeTime(notification.createdAt) }}
                      </span>
                      <span v-if="notification.user" class="flex items-center">
                        <User class="mr-1 h-3 w-3" />
                        {{ notification.user }}
                      </span>
                      <span
                        v-if="notification.location"
                        class="flex items-center"
                      >
                        <MapPin class="mr-1 h-3 w-3" />
                        {{ notification.location }}
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-2 ml-4">
                    <Button
                      v-if="!notification.read"
                      variant="ghost"
                      size="sm"
                      @click.stop="markAsRead(notification.id)"
                      title="Mark as read"
                    >
                      <Eye class="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click.stop="archiveNotification(notification.id)"
                      title="Archive"
                    >
                      <Archive class="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click.stop="deleteNotification(notification.id)"
                      title="Delete"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                    <Button
                      v-if="notification.actionUrl"
                      variant="outline"
                      size="sm"
                      @click.stop="handleNotificationAction(notification)"
                    >
                      {{ notification.actionText || "View" }}
                      <ExternalLink class="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <!-- Additional Content -->
                <div
                  v-if="notification.metadata"
                  class="mt-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div
                    v-if="notification.type === 'order'"
                    class="grid grid-cols-2 gap-4 text-sm"
                  >
                    <div>
                      <span class="text-muted-foreground">Order ID:</span>
                      <span class="font-medium ml-1">{{
                        notification.metadata.orderId
                      }}</span>
                    </div>
                    <div>
                      <span class="text-muted-foreground">Amount:</span>
                      <span class="font-medium ml-1"
                        >Rp
                        {{ formatPrice(notification.metadata.amount) }}</span
                      >
                    </div>
                    <div>
                      <span class="text-muted-foreground">Customer:</span>
                      <span class="font-medium ml-1">{{
                        notification.metadata.customer
                      }}</span>
                    </div>
                    <div>
                      <span class="text-muted-foreground">Status:</span>
                      <Badge variant="outline" class="ml-1">{{
                        notification.metadata.status
                      }}</Badge>
                    </div>
                  </div>

                  <div
                    v-else-if="notification.type === 'billing'"
                    class="grid grid-cols-2 gap-4 text-sm"
                  >
                    <div>
                      <span class="text-muted-foreground">Invoice:</span>
                      <span class="font-medium ml-1">{{
                        notification.metadata.invoiceId
                      }}</span>
                    </div>
                    <div>
                      <span class="text-muted-foreground">Amount:</span>
                      <span class="font-medium ml-1"
                        >Rp
                        {{ formatPrice(notification.metadata.amount) }}</span
                      >
                    </div>
                  </div>

                  <div v-else-if="notification.type === 'team'" class="text-sm">
                    <span class="text-muted-foreground">Team Member:</span>
                    <span class="font-medium ml-1">{{
                      notification.metadata.memberName
                    }}</span>
                    <span class="text-muted-foreground ml-3">Role:</span>
                    <Badge variant="outline" class="ml-1">{{
                      notification.metadata.role
                    }}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="filteredNotifications.length === 0"
              class="text-center py-12"
            >
              <Bell class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 class="text-lg font-medium mb-2">No notifications found</h3>
              <p class="text-muted-foreground">
                {{
                  searchQuery
                    ? "Try adjusting your search or filters"
                    : "You're all caught up!"
                }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Load More -->
      <div v-if="hasMore" class="text-center">
        <Button variant="outline" @click="loadMore" :disabled="loading">
          <RefreshCw v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          <Plus v-else class="mr-2 h-4 w-4" />
          {{ loading ? "Loading..." : "Load More" }}
        </Button>
      </div>
    </div>

    <!-- Notification Settings Modal -->
    <Dialog v-model:open="showNotificationSettings">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Configure how and when you want to receive notifications
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-6">
          <!-- Email Notifications -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Email Notifications</h3>
            <div class="space-y-3">
              <div
                v-for="setting in emailSettings"
                :key="setting.id"
                class="flex items-center justify-between"
              >
                <div>
                  <Label class="text-base">{{ setting.title }}</Label>
                  <p class="text-sm text-muted-foreground">
                    {{ setting.description }}
                  </p>
                </div>
                <Switch v-model="setting.enabled" />
              </div>
            </div>
          </div>

          <!-- Push Notifications -->
          <div class="space-y-4 border-t pt-6">
            <h3 class="text-lg font-medium">Push Notifications</h3>
            <div class="space-y-3">
              <div
                v-for="setting in pushSettings"
                :key="setting.id"
                class="flex items-center justify-between"
              >
                <div>
                  <Label class="text-base">{{ setting.title }}</Label>
                  <p class="text-sm text-muted-foreground">
                    {{ setting.description }}
                  </p>
                </div>
                <Switch v-model="setting.enabled" />
              </div>
            </div>
          </div>

          <!-- Notification Schedule -->
          <div class="space-y-4 border-t pt-6">
            <h3 class="text-lg font-medium">Notification Schedule</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="quietStart">Quiet Hours Start</Label>
                <Input
                  id="quietStart"
                  v-model="notificationSchedule.quietStart"
                  type="time"
                />
              </div>
              <div>
                <Label for="quietEnd">Quiet Hours End</Label>
                <Input
                  id="quietEnd"
                  v-model="notificationSchedule.quietEnd"
                  type="time"
                />
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox
                id="weekendsOnly"
                v-model="notificationSchedule.weekendsOnly"
              />
              <Label for="weekendsOnly" class="text-sm">
                Apply quiet hours on weekends only
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showNotificationSettings = false">
            Cancel
          </Button>
          <Button @click="saveNotificationSettings">
            <Save class="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, computed, reactive } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bell,
  CheckCircle,
  Settings,
  Search,
  RefreshCw,
  List,
  Eye,
  Archive,
  Trash2,
  ExternalLink,
  Clock,
  User,
  MapPin,
  Plus,
  Save,
  ShoppingCart,
  Users,
  AlertTriangle,
  CreditCard,
  Shield,
  Zap,
} from "lucide-vue-next";

// State
const searchQuery = ref("");
const selectedType = ref("all");
const selectedStatus = ref("all");
const selectedPriority = ref("all");
const showNotificationSettings = ref(false);
const loading = ref(false);
const hasMore = ref(true);

// Sample notifications data
const notifications = ref([
  {
    id: "1",
    type: "order",
    priority: "urgent",
    title: "New urgent order received",
    message:
      "Order #ORD-2024-156 requires immediate attention - customer requested same-day delivery",
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 300000),
    user: "Siti Aminah",
    location: "Jakarta Selatan",
    actionUrl: "/orders/ORD-2024-156",
    actionText: "View Order",
    metadata: {
      orderId: "ORD-2024-156",
      amount: 450000,
      customer: "Siti Aminah",
      status: "pending",
    },
  },
  {
    id: "2",
    type: "customer",
    priority: "normal",
    title: "New customer registered",
    message:
      "Budi Santoso has created a new account and placed their first order",
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 1800000),
    user: "Budi Santoso",
    location: "Bandung",
    actionUrl: "/customers/new",
    actionText: "View Profile",
    metadata: {
      customerId: "CUST-2024-089",
      firstOrder: "ORD-2024-157",
      amount: 125000,
    },
  },
  {
    id: "3",
    type: "system",
    priority: "high",
    title: "System maintenance scheduled",
    message:
      "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM WIB",
    read: true,
    archived: false,
    createdAt: new Date(Date.now() - 3600000),
    actionUrl: "/system/maintenance",
    actionText: "Learn More",
  },
  {
    id: "4",
    type: "billing",
    priority: "normal",
    title: "Invoice payment received",
    message: "Payment for invoice INV-2024-001 has been successfully processed",
    read: true,
    archived: false,
    createdAt: new Date(Date.now() - 7200000),
    actionUrl: "/billing/invoices/INV-2024-001",
    actionText: "View Invoice",
    metadata: {
      invoiceId: "INV-2024-001",
      amount: 299000,
      paymentMethod: "Credit Card",
    },
  },
  {
    id: "5",
    type: "security",
    priority: "high",
    title: "New login detected",
    message: "A new login was detected from Chrome on Windows in Jakarta",
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 10800000),
    location: "Jakarta",
    actionUrl: "/account/security",
    actionText: "Review Activity",
  },
  {
    id: "6",
    type: "team",
    priority: "normal",
    title: "Team member added",
    message: "Maya Sari has been added to your team with Staff role",
    read: true,
    archived: false,
    createdAt: new Date(Date.now() - 14400000),
    user: "Ahmad Rizki",
    actionUrl: "/team/members",
    actionText: "View Team",
    metadata: {
      memberName: "Maya Sari",
      role: "Staff",
      addedBy: "Ahmad Rizki",
    },
  },
  {
    id: "7",
    type: "order",
    priority: "normal",
    title: "Order completed",
    message: "Order #ORD-2024-155 has been marked as completed and delivered",
    read: true,
    archived: false,
    createdAt: new Date(Date.now() - 18000000),
    actionUrl: "/orders/ORD-2024-155",
    actionText: "View Order",
    metadata: {
      orderId: "ORD-2024-155",
      amount: 275000,
      customer: "Dewi Lestari",
      status: "completed",
    },
  },
  {
    id: "8",
    type: "system",
    priority: "low",
    title: "Weekly report available",
    message: "Your weekly business report for January 8-14, 2024 is now ready",
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 21600000),
    actionUrl: "/reports/weekly",
    actionText: "View Report",
  },
]);

// Notification settings
const emailSettings = ref([
  {
    id: "new_orders",
    title: "New Orders",
    description: "Get notified when new orders are placed",
    enabled: true,
  },
  {
    id: "order_updates",
    title: "Order Updates",
    description: "Notifications about order status changes",
    enabled: true,
  },
  {
    id: "customer_messages",
    title: "Customer Messages",
    description: "When customers send messages or feedback",
    enabled: true,
  },
  {
    id: "billing_updates",
    title: "Billing Updates",
    description: "Invoice and payment notifications",
    enabled: true,
  },
  {
    id: "security_alerts",
    title: "Security Alerts",
    description: "Login attempts and security-related notifications",
    enabled: true,
  },
  {
    id: "team_updates",
    title: "Team Updates",
    description: "Team member changes and activities",
    enabled: false,
  },
]);

const pushSettings = ref([
  {
    id: "urgent_orders",
    title: "Urgent Orders",
    description: "High-priority orders that need immediate attention",
    enabled: true,
  },
  {
    id: "team_mentions",
    title: "Team Mentions",
    description: "When team members mention you in comments",
    enabled: true,
  },
  {
    id: "system_updates",
    title: "System Updates",
    description: "Important system maintenance and updates",
    enabled: false,
  },
  {
    id: "marketing_updates",
    title: "Marketing Updates",
    description: "New features and promotional content",
    enabled: false,
  },
]);

const notificationSchedule = reactive({
  quietStart: "22:00",
  quietEnd: "07:00",
  weekendsOnly: false,
});

// Computed properties
const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read && !n.archived).length;
});

const todayCount = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return notifications.value.filter((n) => {
    const notificationDate = new Date(n.createdAt);
    notificationDate.setHours(0, 0, 0, 0);
    return notificationDate.getTime() === today.getTime();
  }).length;
});

const urgentCount = computed(() => {
  return notifications.value.filter(
    (n) => n.priority === "urgent" && !n.archived
  ).length;
});

const totalCount = computed(() => {
  return notifications.value.filter((n) => !n.archived).length;
});

const filteredNotifications = computed(() => {
  let filtered = notifications.value.filter((n) => !n.archived);

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (notification) =>
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        (notification.user && notification.user.toLowerCase().includes(query))
    );
  }

  // Type filter
  if (selectedType.value !== "all") {
    filtered = filtered.filter(
      (notification) => notification.type === selectedType.value
    );
  }

  // Status filter
  if (selectedStatus.value !== "all") {
    if (selectedStatus.value === "unread") {
      filtered = filtered.filter((notification) => !notification.read);
    } else if (selectedStatus.value === "read") {
      filtered = filtered.filter((notification) => notification.read);
    }
  }

  // Priority filter
  if (selectedPriority.value !== "all") {
    filtered = filtered.filter(
      (notification) => notification.priority === selectedPriority.value
    );
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

// Methods
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now - time) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return time.toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "order":
      return ShoppingCart;
    case "customer":
      return Users;
    case "system":
      return Zap;
    case "billing":
      return CreditCard;
    case "security":
      return Shield;
    case "team":
      return Users;
    default:
      return Bell;
  }
};

const getNotificationIconBg = (type) => {
  switch (type) {
    case "order":
      return "bg-blue-100";
    case "customer":
      return "bg-green-100";
    case "system":
      return "bg-orange-100";
    case "billing":
      return "bg-purple-100";
    case "security":
      return "bg-red-100";
    case "team":
      return "bg-indigo-100";
    default:
      return "bg-gray-100";
  }
};

const getNotificationIconColor = (type) => {
  switch (type) {
    case "order":
      return "text-blue-600";
    case "customer":
      return "text-green-600";
    case "system":
      return "text-orange-600";
    case "billing":
      return "text-purple-600";
    case "security":
      return "text-red-600";
    case "team":
      return "text-indigo-600";
    default:
      return "text-gray-600";
  }
};

const getPriorityVariant = (priority) => {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "secondary";
    case "normal":
      return "outline";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

const getTypeVariant = (type) => {
  switch (type) {
    case "order":
      return "default";
    case "customer":
      return "secondary";
    case "system":
      return "outline";
    case "billing":
      return "outline";
    case "security":
      return "destructive";
    case "team":
      return "outline";
    default:
      return "outline";
  }
};

// Actions
const markAsRead = (notificationId) => {
  const notification = notifications.value.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    if (!notification.archived) {
      notification.read = true;
    }
  });
};

const archiveNotification = (notificationId) => {
  const notification = notifications.value.find((n) => n.id === notificationId);
  if (notification) {
    notification.archived = true;
  }
};

const deleteNotification = (notificationId) => {
  const index = notifications.value.findIndex((n) => n.id === notificationId);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

const handleNotificationAction = (notification) => {
  console.log("Handling notification action:", notification.actionUrl);
  markAsRead(notification.id);
};

const refreshNotifications = () => {
  console.log("Refreshing notifications");
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const toggleView = () => {
  console.log("Toggling view");
};

const loadMore = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    // Simulate no more notifications
    hasMore.value = false;
  }, 1000);
};

const saveNotificationSettings = () => {
  console.log("Saving notification settings");
  showNotificationSettings.value = false;
};
</script>

<style scoped>
/* Custom styles */
</style>
