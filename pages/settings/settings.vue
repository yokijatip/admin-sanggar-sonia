<template>
  <div class="container mx-auto">
    <!-- Header -->
    <div class="px-4 mb-6">
      <HeadersContent
        title="Settings"
        description="Manage your account and application preferences"
      />
    </div>

    <div class="max-w-6xl mx-auto px-4 mb-4">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Settings Navigation -->
        <Card class="lg:col-span-1">
          <CardContent class="p-0">
            <nav class="space-y-1">
              <button
                v-for="section in settingSections"
                :key="section.id"
                @click="activeSection = section.id"
                :class="[
                  'w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-none border-r-2 transition-colors',
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:bg-muted/50',
                ]"
              >
                <component :is="section.icon" class="mr-3 h-4 w-4" />
                {{ section.name }}
              </button>
            </nav>
          </CardContent>
        </Card>

        <!-- Settings Content -->
        <div class="lg:col-span-3 space-y-6">
          <!-- General Settings -->
          <Card v-if="activeSection === 'general'">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription
                >Manage your basic account information and
                preferences</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Business Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Business Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label for="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      v-model="settings.general.businessName"
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <Label for="businessType">Business Type</Label>
                    <Select v-model="settings.general.businessType">
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bakery">Bakery</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="cafe">Cafe</SelectItem>
                        <SelectItem value="catering">Catering</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label for="businessEmail">Business Email</Label>
                    <Input
                      id="businessEmail"
                      v-model="settings.general.businessEmail"
                      type="email"
                      placeholder="business@example.com"
                    />
                  </div>
                  <div>
                    <Label for="businessPhone">Business Phone</Label>
                    <Input
                      id="businessPhone"
                      v-model="settings.general.businessPhone"
                      placeholder="+62 21-1234-5678"
                    />
                  </div>
                </div>
                <div>
                  <Label for="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    v-model="settings.general.businessAddress"
                    placeholder="Enter your complete business address"
                    rows="3"
                  />
                </div>
              </div>

              <!-- Timezone & Currency -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Regional Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label for="timezone">Timezone</Label>
                    <Select v-model="settings.general.timezone">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Jakarta"
                          >Asia/Jakarta (WIB)</SelectItem
                        >
                        <SelectItem value="Asia/Makassar"
                          >Asia/Makassar (WITA)</SelectItem
                        >
                        <SelectItem value="Asia/Jayapura"
                          >Asia/Jayapura (WIT)</SelectItem
                        >
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label for="currency">Currency</Label>
                    <Select v-model="settings.general.currency">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR"
                          >Indonesian Rupiah (IDR)</SelectItem
                        >
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <!-- Language & Date Format -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Display Preferences</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label for="language">Language</Label>
                    <Select v-model="settings.general.language">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label for="dateFormat">Date Format</Label>
                    <Select v-model="settings.general.dateFormat">
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <Button @click="saveGeneralSettings">
                  <Save class="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Notifications Settings -->
          <Card v-if="activeSection === 'notifications'">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription
                >Configure how you receive notifications</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Email Notifications -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Email Notifications</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">New Orders</Label>
                      <p class="text-sm text-muted-foreground">
                        Get notified when new orders are placed
                      </p>
                    </div>
                    <Switch v-model="settings.notifications.email.newOrders" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Order Updates</Label>
                      <p class="text-sm text-muted-foreground">
                        Get notified when order status changes
                      </p>
                    </div>
                    <Switch
                      v-model="settings.notifications.email.orderUpdates"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Low Stock Alerts</Label>
                      <p class="text-sm text-muted-foreground">
                        Get notified when products are running low
                      </p>
                    </div>
                    <Switch v-model="settings.notifications.email.lowStock" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Daily Reports</Label>
                      <p class="text-sm text-muted-foreground">
                        Receive daily sales and performance reports
                      </p>
                    </div>
                    <Switch
                      v-model="settings.notifications.email.dailyReports"
                    />
                  </div>
                </div>
              </div>

              <!-- Push Notifications -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Push Notifications</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Browser Notifications</Label>
                      <p class="text-sm text-muted-foreground">
                        Show notifications in your browser
                      </p>
                    </div>
                    <Switch v-model="settings.notifications.push.browser" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Mobile App Notifications</Label>
                      <p class="text-sm text-muted-foreground">
                        Send notifications to mobile app
                      </p>
                    </div>
                    <Switch v-model="settings.notifications.push.mobile" />
                  </div>
                </div>
              </div>

              <!-- SMS Notifications -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">SMS Notifications</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Critical Alerts</Label>
                      <p class="text-sm text-muted-foreground">
                        Urgent notifications via SMS
                      </p>
                    </div>
                    <Switch v-model="settings.notifications.sms.critical" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Order Confirmations</Label>
                      <p class="text-sm text-muted-foreground">
                        SMS confirmation for new orders
                      </p>
                    </div>
                    <Switch v-model="settings.notifications.sms.orders" />
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <Button @click="saveNotificationSettings">
                  <Save class="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Security Settings -->
          <Card v-if="activeSection === 'security'">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription
                >Manage your account security and privacy</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Password Change -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Change Password</h3>
                <div class="space-y-3 max-w-md">
                  <div>
                    <Label for="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      v-model="passwordForm.current"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <Label for="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      v-model="passwordForm.new"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Label for="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      v-model="passwordForm.confirm"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button @click="changePassword" class="w-full">
                    <Lock class="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </div>

              <!-- Two-Factor Authentication -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Two-Factor Authentication</h3>
                <div
                  class="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <Label class="text-base">Enable 2FA</Label>
                    <p class="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Badge
                      :variant="
                        settings.security.twoFactorEnabled
                          ? 'default'
                          : 'secondary'
                      "
                    >
                      {{
                        settings.security.twoFactorEnabled
                          ? "Enabled"
                          : "Disabled"
                      }}
                    </Badge>
                    <Button variant="outline" size="sm" @click="toggle2FA">
                      {{
                        settings.security.twoFactorEnabled
                          ? "Disable"
                          : "Enable"
                      }}
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Session Management -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Active Sessions</h3>
                <div class="space-y-3">
                  <div
                    v-for="session in activeSessions"
                    :key="session.id"
                    class="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <Monitor class="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div class="font-medium">{{ session.device }}</div>
                        <div class="text-sm text-muted-foreground">
                          {{ session.location }} • {{ session.lastActive }}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Badge
                        :variant="session.current ? 'default' : 'secondary'"
                      >
                        {{ session.current ? "Current" : "Active" }}
                      </Badge>
                      <Button
                        v-if="!session.current"
                        variant="outline"
                        size="sm"
                        @click="revokeSession(session.id)"
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" @click="revokeAllSessions">
                  <LogOut class="mr-2 h-4 w-4" />
                  Revoke All Other Sessions
                </Button>
              </div>

              <!-- API Keys -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">API Keys</h3>
                <div class="space-y-3">
                  <div
                    v-for="apiKey in apiKeys"
                    :key="apiKey.id"
                    class="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div class="font-medium">{{ apiKey.name }}</div>
                      <div class="text-sm text-muted-foreground">
                        Created {{ apiKey.created }} • Last used
                        {{ apiKey.lastUsed }}
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Badge
                        :variant="
                          apiKey.status === 'active' ? 'default' : 'secondary'
                        "
                      >
                        {{ apiKey.status }}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        @click="revokeApiKey(apiKey.id)"
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
                <Button @click="createApiKey">
                  <Plus class="mr-2 h-4 w-4" />
                  Create New API Key
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Integrations Settings -->
          <Card v-if="activeSection === 'integrations'">
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription
                >Connect with third-party services and tools</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Payment Gateways -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Payment Gateways</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="gateway in paymentGateways"
                    :key="gateway.id"
                    class="border rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center space-x-3">
                        <div
                          class="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center"
                        >
                          <component :is="gateway.icon" class="h-6 w-6" />
                        </div>
                        <div>
                          <div class="font-medium">{{ gateway.name }}</div>
                          <div class="text-sm text-muted-foreground">
                            {{ gateway.description }}
                          </div>
                        </div>
                      </div>
                      <Switch
                        v-model="gateway.enabled"
                        @update:modelValue="togglePaymentGateway(gateway.id)"
                      />
                    </div>
                    <div v-if="gateway.enabled" class="space-y-2">
                      <Input v-model="gateway.apiKey" placeholder="API Key" />
                      <Input
                        v-model="gateway.secretKey"
                        placeholder="Secret Key"
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Email Services -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Email Services</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="service in emailServices"
                    :key="service.id"
                    class="border rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center space-x-3">
                        <div
                          class="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center"
                        >
                          <Mail class="h-6 w-6" />
                        </div>
                        <div>
                          <div class="font-medium">{{ service.name }}</div>
                          <div class="text-sm text-muted-foreground">
                            {{ service.description }}
                          </div>
                        </div>
                      </div>
                      <Switch
                        v-model="service.enabled"
                        @update:modelValue="toggleEmailService(service.id)"
                      />
                    </div>
                    <div v-if="service.enabled" class="space-y-2">
                      <Input v-model="service.apiKey" placeholder="API Key" />
                      <Input
                        v-model="service.fromEmail"
                        placeholder="From Email"
                        type="email"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Analytics -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Analytics & Tracking</h3>
                <div class="space-y-3">
                  <div
                    class="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <Label class="text-base">Google Analytics</Label>
                      <p class="text-sm text-muted-foreground">
                        Track website and app analytics
                      </p>
                    </div>
                    <Switch
                      v-model="settings.integrations.googleAnalytics.enabled"
                    />
                  </div>
                  <div v-if="settings.integrations.googleAnalytics.enabled">
                    <Input
                      v-model="settings.integrations.googleAnalytics.trackingId"
                      placeholder="GA Tracking ID"
                    />
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <Button @click="saveIntegrationSettings">
                  <Save class="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Backup & Export -->
          <Card v-if="activeSection === 'backup'">
            <CardHeader>
              <CardTitle>Backup & Export</CardTitle>
              <CardDescription
                >Manage your data backups and exports</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Automatic Backups -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Automatic Backups</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Enable Automatic Backups</Label>
                      <p class="text-sm text-muted-foreground">
                        Automatically backup your data daily
                      </p>
                    </div>
                    <Switch v-model="settings.backup.autoBackup" />
                  </div>
                  <div v-if="settings.backup.autoBackup">
                    <Label for="backupTime">Backup Time</Label>
                    <Select v-model="settings.backup.backupTime">
                      <SelectTrigger class="w-48">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00:00">12:00 AM</SelectItem>
                        <SelectItem value="02:00">2:00 AM</SelectItem>
                        <SelectItem value="04:00">4:00 AM</SelectItem>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <!-- Recent Backups -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Recent Backups</h3>
                <div class="space-y-3">
                  <div
                    v-for="backup in recentBackups"
                    :key="backup.id"
                    class="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <Database class="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div class="font-medium">{{ backup.name }}</div>
                        <div class="text-sm text-muted-foreground">
                          {{ backup.date }} • {{ backup.size }}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Badge
                        :variant="
                          backup.status === 'completed'
                            ? 'default'
                            : 'secondary'
                        "
                      >
                        {{ backup.status }}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        @click="downloadBackup(backup.id)"
                      >
                        <Download class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Manual Backup -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Manual Backup</h3>
                <div class="flex items-center space-x-4">
                  <Button @click="createBackup">
                    <Database class="mr-2 h-4 w-4" />
                    Create Backup Now
                  </Button>
                  <Button variant="outline" @click="exportData">
                    <Download class="mr-2 h-4 w-4" />
                    Export All Data
                  </Button>
                </div>
              </div>

              <!-- Data Import -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Data Import</h3>
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                >
                  <Upload class="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p class="text-lg font-medium mb-2">Import Data</p>
                  <p class="text-sm text-muted-foreground mb-4">
                    Upload a backup file to restore your data
                  </p>
                  <Button @click="importData">
                    <Upload class="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, reactive } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Plug,
  Database,
  Save,
  Lock,
  Monitor,
  LogOut,
  Plus,
  Mail,
  Download,
  Upload,
  CreditCard,
  Smartphone,
} from "lucide-vue-next";

// Active section
const activeSection = ref("general");

// Setting sections
const settingSections = [
  { id: "general", name: "General", icon: SettingsIcon },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "security", name: "Security", icon: Shield },
  { id: "integrations", name: "Integrations", icon: Plug },
  { id: "backup", name: "Backup & Export", icon: Database },
];

// Settings data
const settings = reactive({
  general: {
    businessName: "Dlillah Cake Shop",
    businessType: "bakery",
    businessEmail: "admin@dlillah.com",
    businessPhone: "+62 21-1234-5678",
    businessAddress: "Jl. Raya Bogor No. 123, Jakarta Timur, DKI Jakarta 13750",
    timezone: "Asia/Jakarta",
    currency: "IDR",
    language: "id",
    dateFormat: "DD/MM/YYYY",
  },
  notifications: {
    email: {
      newOrders: true,
      orderUpdates: true,
      lowStock: true,
      dailyReports: false,
    },
    push: {
      browser: true,
      mobile: false,
    },
    sms: {
      critical: true,
      orders: false,
    },
  },
  security: {
    twoFactorEnabled: false,
  },
  integrations: {
    googleAnalytics: {
      enabled: false,
      trackingId: "",
    },
  },
  backup: {
    autoBackup: true,
    backupTime: "02:00",
  },
});

// Password form
const passwordForm = reactive({
  current: "",
  new: "",
  confirm: "",
});

// Sample data
const activeSessions = ref([
  {
    id: "1",
    device: "Chrome on Windows",
    location: "Jakarta, Indonesia",
    lastActive: "Active now",
    current: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "Jakarta, Indonesia",
    lastActive: "2 hours ago",
    current: false,
  },
]);

const apiKeys = ref([
  {
    id: "1",
    name: "Production API",
    created: "Jan 15, 2024",
    lastUsed: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    name: "Development API",
    created: "Jan 10, 2024",
    lastUsed: "1 week ago",
    status: "active",
  },
]);

const paymentGateways = ref([
  {
    id: "midtrans",
    name: "Midtrans",
    description: "Indonesian payment gateway",
    icon: CreditCard,
    enabled: true,
    apiKey: "",
    secretKey: "",
  },
  {
    id: "xendit",
    name: "Xendit",
    description: "Southeast Asian payment platform",
    icon: CreditCard,
    enabled: false,
    apiKey: "",
    secretKey: "",
  },
]);

const emailServices = ref([
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Email delivery service",
    enabled: true,
    apiKey: "",
    fromEmail: "",
  },
  {
    id: "mailgun",
    name: "Mailgun",
    description: "Email automation service",
    enabled: false,
    apiKey: "",
    fromEmail: "",
  },
]);

const recentBackups = ref([
  {
    id: "1",
    name: "Daily Backup - January 17, 2024",
    date: "Jan 17, 2024 02:00 AM",
    size: "45.2 MB",
    status: "completed",
  },
  {
    id: "2",
    name: "Daily Backup - January 16, 2024",
    date: "Jan 16, 2024 02:00 AM",
    size: "44.8 MB",
    status: "completed",
  },
  {
    id: "3",
    name: "Manual Backup - January 15, 2024",
    date: "Jan 15, 2024 10:30 AM",
    size: "44.5 MB",
    status: "completed",
  },
]);

// Methods
const saveGeneralSettings = () => {
  console.log("Saving general settings:", settings.general);
  // Implement save logic
};

const saveNotificationSettings = () => {
  console.log("Saving notification settings:", settings.notifications);
  // Implement save logic
};

const changePassword = () => {
  console.log("Changing password");
  // Implement password change logic
};

const toggle2FA = () => {
  settings.security.twoFactorEnabled = !settings.security.twoFactorEnabled;
  console.log("2FA toggled:", settings.security.twoFactorEnabled);
};

const revokeSession = (sessionId) => {
  console.log("Revoking session:", sessionId);
  // Implement session revocation
};

const revokeAllSessions = () => {
  console.log("Revoking all sessions");
  // Implement bulk session revocation
};

const createApiKey = () => {
  console.log("Creating new API key");
  // Implement API key creation
};

const revokeApiKey = (keyId) => {
  console.log("Revoking API key:", keyId);
  // Implement API key revocation
};

const togglePaymentGateway = (gatewayId) => {
  console.log("Toggling payment gateway:", gatewayId);
  // Implement payment gateway toggle
};

const toggleEmailService = (serviceId) => {
  console.log("Toggling email service:", serviceId);
  // Implement email service toggle
};

const saveIntegrationSettings = () => {
  console.log("Saving integration settings");
  // Implement save logic
};

const createBackup = () => {
  console.log("Creating manual backup");
  // Implement backup creation
};

const downloadBackup = (backupId) => {
  console.log("Downloading backup:", backupId);
  // Implement backup download
};

const exportData = () => {
  console.log("Exporting all data");
  // Implement data export
};

const importData = () => {
  console.log("Importing data");
  // Implement data import
};
</script>

<style scoped>
/* Custom styles */
</style>
