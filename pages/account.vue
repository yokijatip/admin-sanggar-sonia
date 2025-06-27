<template>
  <div class="container mx-auto">
    <!-- Header -->
    <div class="px-4 mb-6">
      <HeadersContent
        title="Account Settings"
        description="Manage your personal information, security, and preferences"
      />
    </div>

    <div class="mx-auto px-4 space-y-6 mb-4">
      <!-- Profile Overview -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center space-x-6">
            <!-- Profile Picture -->
            <div class="relative">
              <div
                class="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
              >
                <span class="text-2xl font-bold text-white">
                  {{ userProfile.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <button
                @click="showAvatarModal = true"
                class="absolute -bottom-2 -right-2 h-8 w-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Camera class="h-4 w-4 text-primary-foreground" />
              </button>
            </div>

            <!-- Basic Info -->
            <div class="flex-1">
              <h2 class="text-2xl font-bold">{{ userProfile.name }}</h2>
              <p class="text-muted-foreground">{{ userProfile.email }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <Badge variant="default">{{ userProfile.plan }} Plan</Badge>
                <Badge variant="outline">{{ userProfile.role }}</Badge>
                <span class="text-sm text-muted-foreground">
                  Member since {{ formatDate(userProfile.joinedAt) }}
                </span>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                @click="activeTab = 'security'"
              >
                <Shield class="mr-2 h-4 w-4" />
                Security
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="activeTab = 'billing'"
              >
                <CreditCard class="mr-2 h-4 w-4" />
                Billing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Account Navigation -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar Navigation -->
        <Card class="lg:col-span-1">
          <CardContent class="p-0">
            <nav class="space-y-1">
              <button
                v-for="tab in accountTabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-none border-r-2 transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:bg-muted/50',
                ]"
              >
                <component :is="tab.icon" class="mr-3 h-4 w-4" />
                {{ tab.name }}
                <Badge
                  v-if="tab.badge"
                  :variant="tab.badgeVariant"
                  class="ml-auto"
                >
                  {{ tab.badge }}
                </Badge>
              </button>
            </nav>
          </CardContent>
        </Card>

        <!-- Content Area -->
        <div class="lg:col-span-3">
          <!-- Personal Information -->
          <Card v-if="activeTab === 'personal'">
            <CardHeader>
              <CardTitle class="flex items-center">
                <User class="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription
                >Update your personal details and contact
                information</CardDescription
              >
            </CardHeader>
            <CardContent>
              <form @submit.prevent="updatePersonalInfo" class="space-y-6">
                <!-- Basic Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label for="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      v-model="personalForm.firstName"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <Label for="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      v-model="personalForm.lastName"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label for="email">Email Address</Label>
                  <Input
                    id="email"
                    v-model="personalForm.email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                  <p class="text-xs text-muted-foreground mt-1">
                    We'll send a verification email if you change this
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label for="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      v-model="personalForm.phone"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                  <div>
                    <Label for="timezone">Timezone</Label>
                    <Select v-model="personalForm.timezone">
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
                </div>

                <!-- Business Information -->
                <div class="border-t pt-6">
                  <h3 class="text-lg font-medium mb-4">Business Information</h3>
                  <div class="space-y-4">
                    <div>
                      <Label for="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        v-model="personalForm.businessName"
                        placeholder="Your bakery name"
                      />
                    </div>
                    <div>
                      <Label for="businessType">Business Type</Label>
                      <Select v-model="personalForm.businessType">
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bakery">Bakery</SelectItem>
                          <SelectItem value="cafe">Cafe</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="catering">Catering</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label for="businessAddress">Business Address</Label>
                      <Textarea
                        id="businessAddress"
                        v-model="personalForm.businessAddress"
                        placeholder="Complete business address"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex justify-end">
                  <Button type="submit">
                    <Save class="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <!-- Security Settings -->
          <Card v-if="activeTab === 'security'">
            <CardHeader>
              <CardTitle class="flex items-center">
                <Shield class="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription
                >Manage your password and security preferences</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Change Password -->
              <div class="border rounded-lg p-4">
                <h3 class="text-lg font-medium mb-4">Change Password</h3>
                <form @submit.prevent="changePassword" class="space-y-4">
                  <div>
                    <Label for="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      v-model="securityForm.currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div>
                    <Label for="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      v-model="securityForm.newPassword"
                      type="password"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div>
                    <Label for="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      v-model="securityForm.confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <Button type="submit">
                    <Key class="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </form>
              </div>

              <!-- Two-Factor Authentication -->
              <div class="border rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-medium">
                      Two-Factor Authentication
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Badge
                    :variant="
                      userProfile.twoFactorEnabled ? 'default' : 'outline'
                    "
                  >
                    {{ userProfile.twoFactorEnabled ? "Enabled" : "Disabled" }}
                  </Badge>
                </div>

                <div v-if="!userProfile.twoFactorEnabled" class="space-y-4">
                  <p class="text-sm text-muted-foreground">
                    Secure your account with two-factor authentication using an
                    authenticator app.
                  </p>
                  <Button @click="enableTwoFactor">
                    <Smartphone class="mr-2 h-4 w-4" />
                    Enable 2FA
                  </Button>
                </div>

                <div v-else class="space-y-4">
                  <div
                    class="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <CheckCircle class="h-5 w-5 text-green-600" />
                    <span class="text-sm text-green-800"
                      >Two-factor authentication is active</span
                    >
                  </div>
                  <div class="flex space-x-2">
                    <Button variant="outline" @click="showBackupCodes">
                      <FileText class="mr-2 h-4 w-4" />
                      View Backup Codes
                    </Button>
                    <Button variant="destructive" @click="disableTwoFactor">
                      <X class="mr-2 h-4 w-4" />
                      Disable 2FA
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Login Sessions -->
              <div class="border rounded-lg p-4">
                <h3 class="text-lg font-medium mb-4">Active Sessions</h3>
                <div class="space-y-3">
                  <div
                    v-for="session in activeSessions"
                    :key="session.id"
                    class="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <div
                        class="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center"
                      >
                        <Monitor
                          v-if="session.device === 'desktop'"
                          class="h-5 w-5 text-gray-600"
                        />
                        <Smartphone v-else class="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div class="font-medium">
                          {{ session.browser }} on {{ session.os }}
                        </div>
                        <div class="text-sm text-muted-foreground">
                          {{ session.location }} •
                          {{ formatRelativeTime(session.lastActive) }}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Badge v-if="session.current" variant="default"
                        >Current</Badge
                      >
                      <Button
                        v-else
                        variant="outline"
                        size="sm"
                        @click="revokeSession(session.id)"
                      >
                        <LogOut class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Notification Preferences -->
          <Card v-if="activeTab === 'notifications'">
            <CardHeader>
              <CardTitle class="flex items-center">
                <Bell class="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription
                >Choose how and when you want to be notified</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Email Notifications -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Email Notifications</h3>
                <div class="space-y-3">
                  <div
                    v-for="notification in emailNotifications"
                    :key="notification.id"
                    class="flex items-center justify-between"
                  >
                    <div>
                      <Label class="text-base">{{ notification.title }}</Label>
                      <p class="text-sm text-muted-foreground">
                        {{ notification.description }}
                      </p>
                    </div>
                    <Switch v-model="notification.enabled" />
                  </div>
                </div>
              </div>

              <!-- Push Notifications -->
              <div class="space-y-4 border-t pt-6">
                <h3 class="text-lg font-medium">Push Notifications</h3>
                <div class="space-y-3">
                  <div
                    v-for="notification in pushNotifications"
                    :key="notification.id"
                    class="flex items-center justify-between"
                  >
                    <div>
                      <Label class="text-base">{{ notification.title }}</Label>
                      <p class="text-sm text-muted-foreground">
                        {{ notification.description }}
                      </p>
                    </div>
                    <Switch v-model="notification.enabled" />
                  </div>
                </div>
              </div>

              <!-- Notification Schedule -->
              <div class="space-y-4 border-t pt-6">
                <h3 class="text-lg font-medium">Notification Schedule</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label for="quietHoursStart">Quiet Hours Start</Label>
                    <Input
                      id="quietHoursStart"
                      v-model="notificationSettings.quietHoursStart"
                      type="time"
                    />
                  </div>
                  <div>
                    <Label for="quietHoursEnd">Quiet Hours End</Label>
                    <Input
                      id="quietHoursEnd"
                      v-model="notificationSettings.quietHoursEnd"
                      type="time"
                    />
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <Checkbox
                    id="weekendsOnly"
                    v-model="notificationSettings.weekendsOnly"
                  />
                  <Label for="weekendsOnly" class="text-sm">
                    Apply quiet hours on weekends only
                  </Label>
                </div>
              </div>

              <div class="flex justify-end">
                <Button @click="saveNotificationSettings">
                  <Save class="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Privacy Settings -->
          <Card v-if="activeTab === 'privacy'">
            <CardHeader>
              <CardTitle class="flex items-center">
                <Lock class="mr-2 h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription
                >Control your privacy and data sharing
                preferences</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Profile Visibility -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Profile Visibility</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Public Profile</Label>
                      <p class="text-sm text-muted-foreground">
                        Allow others to see your basic profile information
                      </p>
                    </div>
                    <Switch v-model="privacySettings.publicProfile" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Show Online Status</Label>
                      <p class="text-sm text-muted-foreground">
                        Let others see when you're online
                      </p>
                    </div>
                    <Switch v-model="privacySettings.showOnlineStatus" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Show Activity</Label>
                      <p class="text-sm text-muted-foreground">
                        Display your recent activity to team members
                      </p>
                    </div>
                    <Switch v-model="privacySettings.showActivity" />
                  </div>
                </div>
              </div>

              <!-- Data Sharing -->
              <div class="space-y-4 border-t pt-6">
                <h3 class="text-lg font-medium">Data Sharing</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Analytics Data</Label>
                      <p class="text-sm text-muted-foreground">
                        Help improve our service by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch v-model="privacySettings.shareAnalytics" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <Label class="text-base">Marketing Communications</Label>
                      <p class="text-sm text-muted-foreground">
                        Receive updates about new features and promotions
                      </p>
                    </div>
                    <Switch v-model="privacySettings.marketingEmails" />
                  </div>
                </div>
              </div>

              <!-- Data Export & Deletion -->
              <div class="space-y-4 border-t pt-6">
                <h3 class="text-lg font-medium">Data Management</h3>
                <div class="space-y-3">
                  <div
                    class="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <Label class="text-base">Export Your Data</Label>
                      <p class="text-sm text-muted-foreground">
                        Download a copy of all your data
                      </p>
                    </div>
                    <Button variant="outline" @click="exportData">
                      <Download class="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                  <div
                    class="flex items-center justify-between p-4 border border-red-200 rounded-lg"
                  >
                    <div>
                      <Label class="text-base text-red-600"
                        >Delete Account</Label
                      >
                      <p class="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      @click="showDeleteAccountModal = true"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <Button @click="savePrivacySettings">
                  <Save class="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Billing Information -->
          <Card v-if="activeTab === 'billing'">
            <CardHeader>
              <CardTitle class="flex items-center">
                <CreditCard class="mr-2 h-5 w-5" />
                Billing Information
              </CardTitle>
              <CardDescription
                >Manage your subscription and payment details</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Current Plan -->
              <div class="border rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-medium">Current Plan</h3>
                    <p class="text-sm text-muted-foreground">
                      {{ userProfile.plan }} Plan
                    </p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label class="text-sm text-muted-foreground"
                      >Monthly Cost</Label
                    >
                    <p class="text-lg font-bold">
                      Rp {{ formatPrice(299000) }}
                    </p>
                  </div>
                  <div>
                    <Label class="text-sm text-muted-foreground"
                      >Next Billing</Label
                    >
                    <p class="text-lg font-medium">
                      {{ formatDate(userProfile.nextBilling) }}
                    </p>
                  </div>
                  <div>
                    <Label class="text-sm text-muted-foreground"
                      >Payment Method</Label
                    >
                    <p class="text-lg font-medium">•••• 4242</p>
                  </div>
                </div>
                <div class="flex space-x-2 mt-4">
                  <Button variant="outline">
                    <CreditCard class="mr-2 h-4 w-4" />
                    Update Payment
                  </Button>
                  <Button variant="outline">
                    <Package class="mr-2 h-4 w-4" />
                    Change Plan
                  </Button>
                </div>
              </div>

              <!-- Billing History -->
              <div class="border rounded-lg p-4">
                <h3 class="text-lg font-medium mb-4">Recent Invoices</h3>
                <div class="space-y-3">
                  <div
                    v-for="invoice in recentInvoices"
                    :key="invoice.id"
                    class="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div class="font-medium">{{ invoice.description }}</div>
                      <div class="text-sm text-muted-foreground">
                        {{ formatDate(invoice.date) }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-medium">
                        Rp {{ formatPrice(invoice.amount) }}
                      </div>
                      <Badge
                        :variant="
                          invoice.status === 'paid' ? 'default' : 'secondary'
                        "
                      >
                        {{ invoice.status }}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" class="w-full mt-4">
                  <FileText class="mr-2 h-4 w-4" />
                  View All Invoices
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- API & Integrations -->
          <Card v-if="activeTab === 'api'">
            <CardHeader>
              <CardTitle class="flex items-center">
                <Code class="mr-2 h-5 w-5" />
                API & Integrations
              </CardTitle>
              <CardDescription
                >Manage API keys and third-party integrations</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- API Keys -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium">API Keys</h3>
                  <Button @click="showCreateApiKeyModal = true">
                    <Plus class="mr-2 h-4 w-4" />
                    Create API Key
                  </Button>
                </div>
                <div class="space-y-3">
                  <div
                    v-for="apiKey in apiKeys"
                    :key="apiKey.id"
                    class="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div class="font-medium">{{ apiKey.name }}</div>
                      <div class="text-sm text-muted-foreground font-mono">
                        {{ apiKey.key }}
                      </div>
                      <div class="text-xs text-muted-foreground mt-1">
                        Created {{ formatRelativeTime(apiKey.createdAt) }} •
                        Last used {{ formatRelativeTime(apiKey.lastUsed) }}
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
                        @click="copyApiKey(apiKey.key)"
                      >
                        <Copy class="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        @click="revokeApiKey(apiKey.id)"
                      >
                        <Trash2 class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Webhooks -->
              <div class="space-y-4 border-t pt-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium">Webhooks</h3>
                  <Button
                    variant="outline"
                    @click="showCreateWebhookModal = true"
                  >
                    <Plus class="mr-2 h-4 w-4" />
                    Add Webhook
                  </Button>
                </div>
                <div class="space-y-3">
                  <div
                    v-for="webhook in webhooks"
                    :key="webhook.id"
                    class="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div class="font-medium">{{ webhook.name }}</div>
                      <div class="text-sm text-muted-foreground">
                        {{ webhook.url }}
                      </div>
                      <div class="text-xs text-muted-foreground mt-1">
                        Events: {{ webhook.events.join(", ") }}
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Badge
                        :variant="
                          webhook.status === 'active' ? 'default' : 'secondary'
                        "
                      >
                        {{ webhook.status }}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        @click="testWebhook(webhook.id)"
                      >
                        <Zap class="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        @click="editWebhook(webhook.id)"
                      >
                        <Pencil class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Avatar Upload Modal -->
    <Dialog v-model:open="showAvatarModal">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture or choose from our avatars
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="text-center">
            <div
              class="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-4xl font-bold text-white">
                {{ userProfile.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <Input type="file" accept="image/*" class="mb-4" />
            <p class="text-xs text-muted-foreground">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showAvatarModal = false">
            Cancel
          </Button>
          <Button @click="updateAvatar">
            <Upload class="mr-2 h-4 w-4" />
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Account Modal -->
    <Dialog v-model:open="showDeleteAccountModal">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle class="text-red-600">Delete Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and all associated data.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 class="font-medium text-red-800 mb-2">What will be deleted:</h4>
            <ul class="text-sm text-red-700 space-y-1">
              <li>• All your orders and customer data</li>
              <li>• Team members and permissions</li>
              <li>• Billing history and invoices</li>
              <li>• API keys and integrations</li>
              <li>• All settings and preferences</li>
            </ul>
          </div>
          <div>
            <Label for="confirmDelete">Type "DELETE" to confirm</Label>
            <Input
              id="confirmDelete"
              v-model="deleteConfirmation"
              placeholder="DELETE"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showDeleteAccountModal = false">
            Cancel
          </Button>
          <Button
            variant="destructive"
            :disabled="deleteConfirmation !== 'DELETE'"
            @click="deleteAccount"
          >
            <Trash2 class="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Create API Key Modal -->
    <Dialog v-model:open="showCreateApiKeyModal">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Generate a new API key for integrations
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="apiKeyName">API Key Name</Label>
            <Input
              id="apiKeyName"
              v-model="apiKeyForm.name"
              placeholder="e.g., Mobile App Integration"
              required
            />
          </div>
          <div>
            <Label for="apiKeyPermissions">Permissions</Label>
            <div class="space-y-2 mt-2">
              <div
                v-for="permission in availablePermissions"
                :key="permission"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :id="permission"
                  v-model="apiKeyForm.permissions"
                  :value="permission"
                />
                <Label :for="permission" class="text-sm">{{
                  permission
                }}</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showCreateApiKeyModal = false">
            Cancel
          </Button>
          <Button @click="createApiKey">
            <Plus class="mr-2 h-4 w-4" />
            Create API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
import { Checkbox } from "@/components/ui/checkbox";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Camera,
  Shield,
  CreditCard,
  Bell,
  Lock,
  Code,
  Save,
  Key,
  Smartphone,
  CheckCircle,
  FileText,
  X,
  Monitor,
  LogOut,
  Download,
  Trash2,
  Upload,
  Plus,
  Copy,
  Zap,
  Pencil,
  Package,
} from "lucide-vue-next";

// State
const activeTab = ref("personal");
const showAvatarModal = ref(false);
const showDeleteAccountModal = ref(false);
const showCreateApiKeyModal = ref(false);
const showCreateWebhookModal = ref(false);
const deleteConfirmation = ref("");

// Account tabs
const accountTabs = [
  { id: "personal", name: "Personal Info", icon: User },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    badge: "2FA",
    badgeVariant: "default",
  },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "privacy", name: "Privacy", icon: Lock },
  { id: "billing", name: "Billing", icon: CreditCard },
  { id: "api", name: "API & Integrations", icon: Code },
];

// User profile data
const userProfile = ref({
  name: "Ahmad Rizki",
  email: "ahmad@dlillah.com",
  plan: "Professional",
  role: "Owner",
  joinedAt: "2023-01-15T08:00:00Z",
  nextBilling: "2024-02-17T00:00:00Z",
  twoFactorEnabled: true,
});

// Forms
const personalForm = reactive({
  firstName: "Ahmad",
  lastName: "Rizki",
  email: "ahmad@dlillah.com",
  phone: "+62 812-3456-7890",
  timezone: "Asia/Jakarta",
  businessName: "Dlillah Cake Shop",
  businessType: "bakery",
  businessAddress: "Jl. Raya Bogor No. 123, Jakarta Timur, DKI Jakarta 13750",
});

const securityForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const apiKeyForm = reactive({
  name: "",
  permissions: [],
});

// Notification settings
const emailNotifications = ref([
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
]);

const pushNotifications = ref([
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
]);

const notificationSettings = reactive({
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  weekendsOnly: false,
});

// Privacy settings
const privacySettings = reactive({
  publicProfile: false,
  showOnlineStatus: true,
  showActivity: true,
  shareAnalytics: true,
  marketingEmails: false,
});

// Active sessions
const activeSessions = ref([
  {
    id: "1",
    device: "desktop",
    browser: "Chrome",
    os: "Windows",
    location: "Jakarta, Indonesia",
    lastActive: new Date(Date.now() - 300000),
    current: true,
  },
  {
    id: "2",
    device: "mobile",
    browser: "Safari",
    os: "iOS",
    location: "Jakarta, Indonesia",
    lastActive: new Date(Date.now() - 3600000),
    current: false,
  },
]);

// Recent invoices
const recentInvoices = ref([
  {
    id: "INV-2024-001",
    description: "Professional Plan - January 2024",
    date: "2024-01-17T00:00:00Z",
    amount: 299000,
    status: "paid",
  },
  {
    id: "INV-2023-012",
    description: "Professional Plan - December 2023",
    date: "2023-12-17T00:00:00Z",
    amount: 299000,
    status: "paid",
  },
]);

// API Keys
const apiKeys = ref([
  {
    id: "1",
    name: "Mobile App Integration",
    key: "dlh_sk_1234567890abcdef",
    status: "active",
    createdAt: new Date("2024-01-10T10:30:00Z"),
    lastUsed: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    name: "Analytics Dashboard",
    key: "dlh_sk_abcdef1234567890",
    status: "active",
    createdAt: new Date("2024-01-05T14:20:00Z"),
    lastUsed: new Date(Date.now() - 86400000),
  },
]);

// Webhooks
const webhooks = ref([
  {
    id: "1",
    name: "Order Notifications",
    url: "https://api.example.com/webhooks/orders",
    events: ["order.created", "order.updated"],
    status: "active",
  },
  {
    id: "2",
    name: "Customer Updates",
    url: "https://api.example.com/webhooks/customers",
    events: ["customer.created", "customer.updated"],
    status: "inactive",
  },
]);

const availablePermissions = [
  "Read Orders",
  "Write Orders",
  "Read Customers",
  "Write Customers",
  "Read Analytics",
  "Read Products",
  "Write Products",
];

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
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

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

// Actions
const updatePersonalInfo = () => {
  console.log("Updating personal info:", personalForm);
};

const changePassword = () => {
  console.log("Changing password:", securityForm);
  // Reset form
  Object.assign(securityForm, {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
};

const enableTwoFactor = () => {
  console.log("Enabling 2FA");
  userProfile.value.twoFactorEnabled = true;
};

const disableTwoFactor = () => {
  console.log("Disabling 2FA");
  userProfile.value.twoFactorEnabled = false;
};

const showBackupCodes = () => {
  console.log("Showing backup codes");
};

const revokeSession = (sessionId) => {
  console.log("Revoking session:", sessionId);
  activeSessions.value = activeSessions.value.filter((s) => s.id !== sessionId);
};

const saveNotificationSettings = () => {
  console.log("Saving notification settings");
};

const savePrivacySettings = () => {
  console.log("Saving privacy settings:", privacySettings);
};

const exportData = () => {
  console.log("Exporting user data");
};

const deleteAccount = () => {
  console.log("Deleting account");
  showDeleteAccountModal.value = false;
  deleteConfirmation.value = "";
};

const updateAvatar = () => {
  console.log("Updating avatar");
  showAvatarModal.value = false;
};

const createApiKey = () => {
  console.log("Creating API key:", apiKeyForm);
  showCreateApiKeyModal.value = false;
  // Reset form
  Object.assign(apiKeyForm, { name: "", permissions: [] });
};

const copyApiKey = (key) => {
  navigator.clipboard.writeText(key);
  console.log("Copied API key:", key);
};

const revokeApiKey = (keyId) => {
  console.log("Revoking API key:", keyId);
  apiKeys.value = apiKeys.value.filter((k) => k.id !== keyId);
};

const testWebhook = (webhookId) => {
  console.log("Testing webhook:", webhookId);
};

const editWebhook = (webhookId) => {
  console.log("Editing webhook:", webhookId);
};
</script>

<style scoped>
/* Custom styles */
</style>
