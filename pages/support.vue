<template>
  <div class="container mx-auto">
    <!-- Header -->
    <div class="px-4 mb-6">
      <HeadersContent
        title="Support Center"
        description="Get help when you need it - we're here to support your success"
      />
    </div>

    <div class="max-w-6xl mx-auto px-4 space-y-6">
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="activeTab = 'tickets'"
        >
          <CardContent class="p-6 text-center">
            <div
              class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <Ticket class="h-6 w-6 text-blue-600" />
            </div>
            <h3 class="font-medium">Create Ticket</h3>
            <p class="text-sm text-muted-foreground">Get personalized help</p>
          </CardContent>
        </Card>

        <Card
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="activeTab = 'chat'"
        >
          <CardContent class="p-6 text-center">
            <div
              class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <MessageCircle class="h-6 w-6 text-green-600" />
            </div>
            <h3 class="font-medium">Live Chat</h3>
            <p class="text-sm text-muted-foreground">Chat with our team</p>
          </CardContent>
        </Card>

        <Card
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="activeTab = 'knowledge'"
        >
          <CardContent class="p-6 text-center">
            <div
              class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <BookOpen class="h-6 w-6 text-purple-600" />
            </div>
            <h3 class="font-medium">Knowledge Base</h3>
            <p class="text-sm text-muted-foreground">Find answers quickly</p>
          </CardContent>
        </Card>

        <Card
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="activeTab = 'status'"
        >
          <CardContent class="p-6 text-center">
            <div
              class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <Activity class="h-6 w-6 text-orange-600" />
            </div>
            <h3 class="font-medium">System Status</h3>
            <p class="text-sm text-muted-foreground">Check service health</p>
          </CardContent>
        </Card>
      </div>

      <!-- Support Tabs -->
      <Card>
        <CardHeader>
          <div class="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <button
              v-for="tab in supportTabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
            >
              <component :is="tab.icon" class="mr-2 h-4 w-4 inline" />
              {{ tab.name }}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <!-- Support Tickets -->
          <div v-if="activeTab === 'tickets'" class="space-y-6">
            <!-- Create New Ticket -->
            <div class="border rounded-lg p-6">
              <h3 class="text-lg font-medium mb-4">Create Support Ticket</h3>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label for="ticketSubject">Subject</Label>
                    <Input
                      id="ticketSubject"
                      v-model="newTicket.subject"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div>
                    <Label for="ticketPriority">Priority</Label>
                    <Select v-model="newTicket.priority">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label for="ticketCategory">Category</Label>
                  <Select v-model="newTicket.category">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing"
                        >Billing & Payments</SelectItem
                      >
                      <SelectItem value="account"
                        >Account Management</SelectItem
                      >
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="integration"
                        >Integration Support</SelectItem
                      >
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label for="ticketDescription">Description</Label>
                  <Textarea
                    id="ticketDescription"
                    v-model="newTicket.description"
                    placeholder="Please provide detailed information about your issue..."
                    rows="5"
                  />
                </div>
                <div>
                  <Label>Attachments (Optional)</Label>
                  <div
                    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                  >
                    <Upload class="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p class="text-sm text-muted-foreground">
                      Drop files here or click to upload
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                      Max file size: 10MB. Supported: PNG, JPG, PDF, TXT
                    </p>
                  </div>
                </div>
                <Button @click="createTicket" class="w-full">
                  <Send class="mr-2 h-4 w-4" />
                  Submit Ticket
                </Button>
              </div>
            </div>

            <!-- Existing Tickets -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium">Your Support Tickets</h3>
                <div class="flex items-center space-x-2">
                  <Select v-model="ticketFilter">
                    <SelectTrigger class="w-48">
                      <SelectValue placeholder="Filter tickets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tickets</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="ticket in filteredTickets"
                  :key="ticket.id"
                  class="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                      <Badge variant="outline" class="font-mono">{{
                        ticket.id
                      }}</Badge>
                      <Badge :variant="getPriorityVariant(ticket.priority)">
                        {{ ticket.priority }}
                      </Badge>
                      <Badge :variant="getStatusVariant(ticket.status)">
                        {{ ticket.status }}
                      </Badge>
                    </div>
                    <span class="text-sm text-muted-foreground">
                      {{ formatDate(ticket.createdAt) }}
                    </span>
                  </div>

                  <h4 class="font-medium mb-2">{{ ticket.subject }}</h4>
                  <p class="text-sm text-muted-foreground mb-3">
                    {{ ticket.description }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div
                      class="flex items-center space-x-4 text-sm text-muted-foreground"
                    >
                      <span>Category: {{ ticket.category }}</span>
                      <span
                        >Assigned to:
                        {{ ticket.assignedTo || "Unassigned" }}</span
                      >
                      <span
                        >Last updated:
                        {{ formatRelativeTime(ticket.updatedAt) }}</span
                      >
                    </div>
                    <div class="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        @click="viewTicket(ticket.id)"
                      >
                        <Eye class="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        v-if="ticket.status !== 'closed'"
                        variant="outline"
                        size="sm"
                        @click="updateTicket(ticket.id)"
                      >
                        <MessageCircle class="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Live Chat -->
          <div v-if="activeTab === 'chat'" class="space-y-6">
            <div class="text-center py-8">
              <div
                class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <MessageCircle class="h-8 w-8 text-green-600" />
              </div>
              <h3 class="text-xl font-bold mb-2">Live Chat Support</h3>
              <p class="text-muted-foreground mb-6">
                Get instant help from our support team
              </p>

              <!-- Chat Status -->
              <div class="max-w-md mx-auto mb-6">
                <div
                  class="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg"
                >
                  <div
                    class="h-2 w-2 bg-green-500 rounded-full animate-pulse"
                  ></div>
                  <span class="text-sm font-medium text-green-700"
                    >Support team is online</span
                  >
                </div>
              </div>

              <!-- Chat Options -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
              >
                <Card
                  class="cursor-pointer hover:shadow-md transition-shadow"
                  @click="startChat('general')"
                >
                  <CardContent class="p-6 text-center">
                    <HelpCircle class="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <h4 class="font-medium mb-2">General Support</h4>
                    <p class="text-sm text-muted-foreground">
                      Questions about features and usage
                    </p>
                  </CardContent>
                </Card>

                <Card
                  class="cursor-pointer hover:shadow-md transition-shadow"
                  @click="startChat('technical')"
                >
                  <CardContent class="p-6 text-center">
                    <Settings class="h-8 w-8 mx-auto mb-3 text-purple-600" />
                    <h4 class="font-medium mb-2">Technical Support</h4>
                    <p class="text-sm text-muted-foreground">
                      Technical issues and troubleshooting
                    </p>
                  </CardContent>
                </Card>

                <Card
                  class="cursor-pointer hover:shadow-md transition-shadow"
                  @click="startChat('billing')"
                >
                  <CardContent class="p-6 text-center">
                    <CreditCard class="h-8 w-8 mx-auto mb-3 text-green-600" />
                    <h4 class="font-medium mb-2">Billing Support</h4>
                    <p class="text-sm text-muted-foreground">
                      Payment and subscription questions
                    </p>
                  </CardContent>
                </Card>

                <Card
                  class="cursor-pointer hover:shadow-md transition-shadow"
                  @click="startChat('sales')"
                >
                  <CardContent class="p-6 text-center">
                    <Users class="h-8 w-8 mx-auto mb-3 text-orange-600" />
                    <h4 class="font-medium mb-2">Sales Inquiry</h4>
                    <p class="text-sm text-muted-foreground">
                      Upgrade plans and enterprise sales
                    </p>
                  </CardContent>
                </Card>
              </div>

              <!-- Business Hours -->
              <div class="mt-8 p-4 bg-muted rounded-lg max-w-md mx-auto">
                <h4 class="font-medium mb-2">Business Hours</h4>
                <div class="text-sm text-muted-foreground space-y-1">
                  <div>Monday - Friday: 9:00 AM - 6:00 PM (WIB)</div>
                  <div>Saturday: 10:00 AM - 4:00 PM (WIB)</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Knowledge Base -->
          <div v-if="activeTab === 'knowledge'" class="space-y-6">
            <!-- Search -->
            <div class="relative">
              <Search
                class="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
              />
              <Input
                v-model="knowledgeSearch"
                placeholder="Search knowledge base..."
                class="pl-10"
              />
            </div>

            <!-- Popular Articles -->
            <div>
              <h3 class="text-lg font-medium mb-4">Popular Articles</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  v-for="article in popularArticles"
                  :key="article.id"
                  class="cursor-pointer hover:shadow-md transition-shadow"
                  @click="viewArticle(article.id)"
                >
                  <CardContent class="p-4">
                    <div class="flex items-start space-x-3">
                      <div
                        class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                      >
                        <component
                          :is="article.icon"
                          class="h-5 w-5 text-blue-600"
                        />
                      </div>
                      <div class="flex-1">
                        <h4 class="font-medium mb-1">{{ article.title }}</h4>
                        <p class="text-sm text-muted-foreground mb-2">
                          {{ article.excerpt }}
                        </p>
                        <div
                          class="flex items-center space-x-4 text-xs text-muted-foreground"
                        >
                          <span>{{ article.views }} views</span>
                          <span>{{ article.helpful }}% helpful</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <!-- Categories -->
            <div>
              <h3 class="text-lg font-medium mb-4">Browse by Category</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  v-for="category in knowledgeCategories"
                  :key="category.id"
                  class="cursor-pointer hover:shadow-md transition-shadow"
                  @click="browseCategory(category.id)"
                >
                  <CardContent class="p-6 text-center">
                    <div
                      class="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3"
                    >
                      <component
                        :is="category.icon"
                        class="h-6 w-6 text-gray-600"
                      />
                    </div>
                    <h4 class="font-medium mb-2">{{ category.name }}</h4>
                    <p class="text-sm text-muted-foreground mb-2">
                      {{ category.description }}
                    </p>
                    <Badge variant="secondary"
                      >{{ category.articleCount }} articles</Badge
                    >
                  </CardContent>
                </Card>
              </div>
            </div>

            <!-- Recent Updates -->
            <div>
              <h3 class="text-lg font-medium mb-4">Recent Updates</h3>
              <div class="space-y-3">
                <div
                  v-for="update in recentUpdates"
                  :key="update.id"
                  class="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 class="font-medium">{{ update.title }}</h4>
                    <p class="text-sm text-muted-foreground">
                      {{ update.description }}
                    </p>
                  </div>
                  <div class="text-right">
                    <Badge
                      :variant="update.type === 'new' ? 'default' : 'secondary'"
                    >
                      {{ update.type }}
                    </Badge>
                    <div class="text-xs text-muted-foreground mt-1">
                      {{ formatDate(update.date) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div v-if="activeTab === 'status'" class="space-y-6">
            <!-- Overall Status -->
            <div class="text-center py-6">
              <div
                class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle class="h-8 w-8 text-green-600" />
              </div>
              <h3 class="text-xl font-bold mb-2">All Systems Operational</h3>
              <p class="text-muted-foreground">
                All services are running smoothly
              </p>
            </div>

            <!-- Service Status -->
            <div>
              <h3 class="text-lg font-medium mb-4">Service Status</h3>
              <div class="space-y-3">
                <div
                  v-for="service in systemServices"
                  :key="service.id"
                  class="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      :class="[
                        'h-3 w-3 rounded-full',
                        service.status === 'operational'
                          ? 'bg-green-500'
                          : service.status === 'degraded'
                          ? 'bg-yellow-500'
                          : service.status === 'outage'
                          ? 'bg-red-500'
                          : 'bg-gray-500',
                      ]"
                    ></div>
                    <div>
                      <h4 class="font-medium">{{ service.name }}</h4>
                      <p class="text-sm text-muted-foreground">
                        {{ service.description }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <Badge :variant="getServiceStatusVariant(service.status)">
                      {{ service.status }}
                    </Badge>
                    <div class="text-xs text-muted-foreground mt-1">
                      {{ service.uptime }}% uptime
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Incidents -->
            <div>
              <h3 class="text-lg font-medium mb-4">Recent Incidents</h3>
              <div class="space-y-3">
                <div
                  v-for="incident in recentIncidents"
                  :key="incident.id"
                  class="p-4 border rounded-lg"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium">{{ incident.title }}</h4>
                    <Badge :variant="getIncidentStatusVariant(incident.status)">
                      {{ incident.status }}
                    </Badge>
                  </div>
                  <p class="text-sm text-muted-foreground mb-2">
                    {{ incident.description }}
                  </p>
                  <div class="text-xs text-muted-foreground">
                    {{ formatDate(incident.date) }} • Affected:
                    {{ incident.affected.join(", ") }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Subscribe to Updates -->
            <div class="p-6 bg-muted rounded-lg text-center">
              <h4 class="font-medium mb-2">Stay Updated</h4>
              <p class="text-sm text-muted-foreground mb-4">
                Get notified about service updates and maintenance
              </p>
              <Button @click="subscribeToUpdates">
                <Bell class="mr-2 h-4 w-4" />
                Subscribe to Updates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Contact Information -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent class="p-6 text-center">
            <Mail class="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 class="font-medium mb-2">Email Support</h3>
            <p class="text-sm text-muted-foreground mb-3">Get help via email</p>
            <p class="text-sm font-medium">support@dlillah.com</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6 text-center">
            <Phone class="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 class="font-medium mb-2">Phone Support</h3>
            <p class="text-sm text-muted-foreground mb-3">
              Call us for urgent issues
            </p>
            <p class="text-sm font-medium">+62 21-1234-5678</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6 text-center">
            <Clock class="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 class="font-medium mb-2">Response Time</h3>
            <p class="text-sm text-muted-foreground mb-3">
              Average response time
            </p>
            <p class="text-sm font-medium">< 2 hours</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, computed, reactive } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ticket,
  MessageCircle,
  BookOpen,
  Activity,
  Upload,
  Send,
  Eye,
  Search,
  HelpCircle,
  Settings,
  CreditCard,
  Users,
  CheckCircle,
  Bell,
  Mail,
  Phone,
  Clock,
} from "lucide-vue-next";

definePageMeta({
  middleware: "auth",
});

// State
const activeTab = ref("tickets");
const knowledgeSearch = ref("");
const ticketFilter = ref("all");

// Support tabs
const supportTabs = [
  { id: "tickets", name: "Support Tickets", icon: Ticket },
  { id: "chat", name: "Live Chat", icon: MessageCircle },
  { id: "knowledge", name: "Knowledge Base", icon: BookOpen },
  { id: "status", name: "System Status", icon: Activity },
];

// New ticket form
const newTicket = reactive({
  subject: "",
  priority: "",
  category: "",
  description: "",
});

// Sample data
const supportTickets = ref([
  {
    id: "TKT-001",
    subject: "Unable to process payments",
    description: "Payment gateway integration is not working properly...",
    priority: "high",
    status: "in_progress",
    category: "technical",
    assignedTo: "John Doe",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "TKT-002",
    subject: "Question about billing cycle",
    description: "I need clarification about when my subscription renews...",
    priority: "medium",
    status: "resolved",
    category: "billing",
    assignedTo: "Jane Smith",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
  },
]);

const popularArticles = ref([
  {
    id: "1",
    title: "Getting Started with Your Dashboard",
    excerpt: "Learn how to navigate and use your admin dashboard effectively",
    icon: BookOpen,
    views: 1250,
    helpful: 95,
  },
  {
    id: "2",
    title: "Setting Up Payment Methods",
    excerpt: "Configure payment gateways and manage billing settings",
    icon: CreditCard,
    views: 980,
    helpful: 92,
  },
  {
    id: "3",
    title: "Managing Team Members",
    excerpt: "Add, remove, and manage permissions for your team",
    icon: Users,
    views: 750,
    helpful: 88,
  },
  {
    id: "4",
    title: "Order Management Best Practices",
    excerpt: "Tips for efficiently managing orders and customer requests",
    icon: Settings,
    views: 650,
    helpful: 90,
  },
]);

const knowledgeCategories = ref([
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Basic setup and onboarding guides",
    icon: BookOpen,
    articleCount: 12,
  },
  {
    id: "orders",
    name: "Order Management",
    description: "Managing orders and fulfillment",
    icon: Ticket,
    articleCount: 18,
  },
  {
    id: "billing",
    name: "Billing & Payments",
    description: "Subscription and payment help",
    icon: CreditCard,
    articleCount: 8,
  },
  {
    id: "integrations",
    name: "Integrations",
    description: "Third-party service connections",
    icon: Settings,
    articleCount: 15,
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    icon: HelpCircle,
    articleCount: 22,
  },
  {
    id: "api",
    name: "API Documentation",
    description: "Developer resources and guides",
    icon: BookOpen,
    articleCount: 25,
  },
]);

const recentUpdates = ref([
  {
    id: "1",
    title: "New Payment Gateway Integration",
    description: "Added support for Xendit payment gateway",
    type: "new",
    date: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Order Export Feature",
    description: "Updated order export functionality with new filters",
    type: "updated",
    date: "2024-01-12T00:00:00Z",
  },
]);

const systemServices = ref([
  {
    id: "api",
    name: "API Services",
    description: "Core application programming interface",
    status: "operational",
    uptime: 99.9,
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Web application dashboard",
    status: "operational",
    uptime: 99.8,
  },
  {
    id: "payments",
    name: "Payment Processing",
    description: "Payment gateway and billing services",
    status: "operational",
    uptime: 99.7,
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Email and SMS notification services",
    status: "operational",
    uptime: 99.5,
  },
]);

const recentIncidents = ref([
  {
    id: "1",
    title: "Scheduled Maintenance",
    description: "Routine database maintenance completed successfully",
    status: "resolved",
    date: "2024-01-10T02:00:00Z",
    affected: ["API Services", "Dashboard"],
  },
]);

// Computed
const filteredTickets = computed(() => {
  if (ticketFilter.value === "all") {
    return supportTickets.value;
  }
  return supportTickets.value.filter(
    (ticket) => ticket.status === ticketFilter.value
  );
});

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
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

const getPriorityVariant = (priority) => {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case "open":
      return "secondary";
    case "in_progress":
      return "default";
    case "resolved":
      return "default";
    case "closed":
      return "outline";
    default:
      return "outline";
  }
};

const getServiceStatusVariant = (status) => {
  switch (status) {
    case "operational":
      return "default";
    case "degraded":
      return "secondary";
    case "outage":
      return "destructive";
    default:
      return "outline";
  }
};

const getIncidentStatusVariant = (status) => {
  switch (status) {
    case "resolved":
      return "default";
    case "investigating":
      return "secondary";
    case "monitoring":
      return "secondary";
    default:
      return "outline";
  }
};

// Actions
const createTicket = () => {
  console.log("Creating ticket:", newTicket);
  // Reset form
  Object.assign(newTicket, {
    subject: "",
    priority: "",
    category: "",
    description: "",
  });
};

const viewTicket = (ticketId) => {
  console.log("View ticket:", ticketId);
};

const updateTicket = (ticketId) => {
  console.log("Update ticket:", ticketId);
};

const startChat = (type) => {
  console.log("Start chat:", type);
};

const viewArticle = (articleId) => {
  console.log("View article:", articleId);
};

const browseCategory = (categoryId) => {
  console.log("Browse category:", categoryId);
};

const subscribeToUpdates = () => {
  console.log("Subscribe to status updates");
};
</script>

<style scoped>
/* Custom styles */
</style>
