<template>
  <div class="container mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 mb-6">
      <HeadersContent
        title="Team Management"
        description="Manage your team members and their permissions"
      />
      <Button @click="showInviteModal = true" class="bg-primary">
        <UserPlus class="mr-2 h-4 w-4" />
        Invite Member
      </Button>
    </div>

    <!-- Team Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 px-4">
      <Card>
        <CardContent class="p-4">
          <div class="text-center">
            <p class="text-2xl font-bold">{{ teamStats.total }}</p>
            <p class="text-sm text-muted-foreground">Total Members</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">
              {{ teamStats.active }}
            </p>
            <p class="text-sm text-muted-foreground">Active Members</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-yellow-600">
              {{ teamStats.pending }}
            </p>
            <p class="text-sm text-muted-foreground">Pending Invites</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-blue-600">
              {{ teamStats.admins }}
            </p>
            <p class="text-sm text-muted-foreground">Administrators</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4 mb-6 px-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Search team members..."
          class="pl-8"
        />
      </div>

      <Select v-model="selectedRole">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="owner">Owner</SelectItem>
          <SelectItem value="admin">Administrator</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedStatus">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Team Members List -->
    <Card class="mx-4">
      <CardContent class="p-0">
        <div class="space-y-0">
          <div
            v-for="member in filteredMembers"
            :key="member.id"
            class="flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
          >
            <!-- Member Info -->
            <div class="flex items-center space-x-4">
              <div
                class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <span class="text-lg font-medium text-gray-600">
                  {{ member.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="font-medium">{{ member.name }}</h3>
                  <Badge v-if="member.role === 'owner'" variant="default">
                    <Crown class="mr-1 h-3 w-3" />
                    Owner
                  </Badge>
                  <Badge
                    v-else-if="member.role === 'admin'"
                    variant="secondary"
                  >
                    <Shield class="mr-1 h-3 w-3" />
                    Admin
                  </Badge>
                  <Badge v-else :variant="getRoleVariant(member.role)">
                    {{ member.role }}
                  </Badge>
                </div>
                <p class="text-sm text-muted-foreground">{{ member.email }}</p>
                <div class="flex items-center space-x-4 mt-1">
                  <span class="text-xs text-muted-foreground">
                    Joined {{ formatDate(member.joinedAt) }}
                  </span>
                  <span class="text-xs text-muted-foreground">
                    Last active {{ formatRelativeTime(member.lastActive) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Member Status & Actions -->
            <div class="flex items-center space-x-4">
              <!-- Status -->
              <div class="text-right">
                <Badge :variant="getStatusVariant(member.status)">
                  {{ member.status }}
                </Badge>
                <div class="text-xs text-muted-foreground mt-1">
                  {{ member.permissions.length }} permissions
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="viewMember(member.id)"
                  title="View Details"
                >
                  <Eye class="h-4 w-4" />
                </Button>
                <Button
                  v-if="member.role !== 'owner'"
                  variant="ghost"
                  size="sm"
                  @click="editMember(member.id)"
                  title="Edit Member"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button
                  v-if="member.status === 'pending'"
                  variant="ghost"
                  size="sm"
                  @click="resendInvite(member.id)"
                  title="Resend Invite"
                >
                  <Mail class="h-4 w-4" />
                </Button>
                <Button
                  v-if="member.role !== 'owner'"
                  variant="ghost"
                  size="sm"
                  @click="removeMember(member.id)"
                  title="Remove Member"
                >
                  <Trash2 class="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Roles & Permissions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4 mb-4">
      <!-- Roles -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Users class="mr-2 h-5 w-5" />
            Roles & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-for="role in roles"
            :key="role.id"
            class="border rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <div>
                <h4 class="font-medium">{{ role.name }}</h4>
                <p class="text-sm text-muted-foreground">
                  {{ role.description }}
                </p>
              </div>
              <Badge variant="outline">{{ role.memberCount }} members</Badge>
            </div>
            <div class="space-y-2">
              <div class="text-sm font-medium">Permissions:</div>
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="permission in role.permissions"
                  :key="permission"
                  variant="secondary"
                  class="text-xs"
                >
                  {{ permission }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Activity -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Activity class="mr-2 h-5 w-5" />
            Recent Team Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div
                class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-xs font-medium text-gray-600">
                  {{ activity.user.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm">
                  <span class="font-medium">{{ activity.user }}</span>
                  {{ activity.action }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ formatRelativeTime(activity.timestamp) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Invite Member Modal -->
    <Dialog v-model:open="showInviteModal">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your team
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="inviteEmail">Email Address</Label>
            <Input
              id="inviteEmail"
              v-model="inviteForm.email"
              type="email"
              placeholder="member@example.com"
            />
          </div>
          <div>
            <Label for="inviteRole">Role</Label>
            <Select v-model="inviteForm.role">
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="inviteMessage">Personal Message (Optional)</Label>
            <Textarea
              id="inviteMessage"
              v-model="inviteForm.message"
              placeholder="Add a personal message to the invitation..."
              rows="3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showInviteModal = false">
            Cancel
          </Button>
          <Button @click="sendInvite">
            <Send class="mr-2 h-4 w-4" />
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Member Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>
            Update member role and permissions
          </DialogDescription>
        </DialogHeader>
        <div v-if="editingMember" class="space-y-4">
          <div>
            <Label>Member</Label>
            <div class="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div
                class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-gray-600">
                  {{ editingMember.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="font-medium">{{ editingMember.name }}</div>
                <div class="text-sm text-muted-foreground">
                  {{ editingMember.email }}
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label for="editRole">Role</Label>
            <Select v-model="editForm.role">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select v-model="editForm.status">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showEditModal = false">
            Cancel
          </Button>
          <Button @click="updateMember">
            <Save class="mr-2 h-4 w-4" />
            Save Changes
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
import { Textarea } from "@/components/ui/textarea";
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
  UserPlus,
  Search,
  Crown,
  Shield,
  Eye,
  Pencil,
  Mail,
  Trash2,
  Users,
  Activity,
  Send,
  Save,
} from "lucide-vue-next";

// State
const searchQuery = ref("");
const selectedRole = ref("all");
const selectedStatus = ref("all");
const showInviteModal = ref(false);
const showEditModal = ref(false);
const editingMember = ref(null);

// Forms
const inviteForm = reactive({
  email: "",
  role: "",
  message: "",
});

const editForm = reactive({
  role: "",
  status: "",
});

// Sample data
const teamMembers = ref([
  {
    id: "1",
    name: "Ahmad Rizki",
    email: "ahmad@dlillah.com",
    role: "owner",
    status: "active",
    joinedAt: "2023-01-15T08:00:00Z",
    lastActive: "2024-01-17T10:30:00Z",
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    email: "siti@dlillah.com",
    role: "admin",
    status: "active",
    joinedAt: "2023-02-20T09:15:00Z",
    lastActive: "2024-01-17T09:45:00Z",
    permissions: ["orders", "products", "customers", "reports"],
  },
  {
    id: "3",
    name: "Budi Santoso",
    email: "budi@dlillah.com",
    role: "manager",
    status: "active",
    joinedAt: "2023-03-10T10:30:00Z",
    lastActive: "2024-01-16T16:20:00Z",
    permissions: ["orders", "products", "customers"],
  },
  {
    id: "4",
    name: "Maya Sari",
    email: "maya@dlillah.com",
    role: "staff",
    status: "active",
    joinedAt: "2023-04-05T11:45:00Z",
    lastActive: "2024-01-17T08:15:00Z",
    permissions: ["orders", "customers"],
  },
  {
    id: "5",
    name: "Dewi Lestari",
    email: "dewi@example.com",
    role: "staff",
    status: "pending",
    joinedAt: "2024-01-15T14:20:00Z",
    lastActive: null,
    permissions: ["orders"],
  },
]);

const roles = ref([
  {
    id: "owner",
    name: "Owner",
    description: "Full access to all features and settings",
    memberCount: 1,
    permissions: ["All Permissions"],
  },
  {
    id: "admin",
    name: "Administrator",
    description: "Manage team, orders, products, and view reports",
    memberCount: 1,
    permissions: ["Orders", "Products", "Customers", "Reports", "Team"],
  },
  {
    id: "manager",
    name: "Manager",
    description: "Manage orders, products, and customers",
    memberCount: 1,
    permissions: ["Orders", "Products", "Customers"],
  },
  {
    id: "staff",
    name: "Staff",
    description: "Handle orders and customer interactions",
    memberCount: 2,
    permissions: ["Orders", "Customers"],
  },
]);

const recentActivity = ref([
  {
    id: "1",
    user: "Siti Nurhaliza",
    action: "updated order ORD-156 status to completed",
    timestamp: "2024-01-17T10:30:00Z",
  },
  {
    id: "2",
    user: "Budi Santoso",
    action: "added new product 'Chocolate Cupcakes'",
    timestamp: "2024-01-17T09:15:00Z",
  },
  {
    id: "3",
    user: "Maya Sari",
    action: "processed customer inquiry from Siti Aminah",
    timestamp: "2024-01-16T16:45:00Z",
  },
  {
    id: "4",
    user: "Ahmad Rizki",
    action: "invited new team member Dewi Lestari",
    timestamp: "2024-01-15T14:20:00Z",
  },
]);

// Computed
const teamStats = computed(() => {
  const members = teamMembers.value;
  return {
    total: members.length,
    active: members.filter((m) => m.status === "active").length,
    pending: members.filter((m) => m.status === "pending").length,
    admins: members.filter((m) => ["owner", "admin"].includes(m.role)).length,
  };
});

const filteredMembers = computed(() => {
  let filtered = teamMembers.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
    );
  }

  // Role filter
  if (selectedRole.value !== "all") {
    filtered = filtered.filter((member) => member.role === selectedRole.value);
  }

  // Status filter
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (member) => member.status === selectedStatus.value
    );
  }

  return filtered;
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
  if (!timestamp) return "Never";

  const now = new Date();
  const time = new Date(timestamp);
  const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const getRoleVariant = (role) => {
  switch (role) {
    case "owner":
      return "default";
    case "admin":
      return "secondary";
    case "manager":
      return "outline";
    case "staff":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case "active":
      return "default";
    case "pending":
      return "secondary";
    case "inactive":
      return "destructive";
    default:
      return "outline";
  }
};

// Actions
const viewMember = (memberId) => {
  console.log("View member:", memberId);
};

const editMember = (memberId) => {
  const member = teamMembers.value.find((m) => m.id === memberId);
  if (member) {
    editingMember.value = member;
    editForm.role = member.role;
    editForm.status = member.status;
    showEditModal.value = true;
  }
};

const removeMember = (memberId) => {
  console.log("Remove member:", memberId);
  // Implement member removal
};

const resendInvite = (memberId) => {
  console.log("Resend invite:", memberId);
  // Implement invite resend
};

const sendInvite = () => {
  console.log("Sending invite:", inviteForm);
  // Implement invite sending
  showInviteModal.value = false;
  // Reset form
  Object.assign(inviteForm, { email: "", role: "", message: "" });
};

const updateMember = () => {
  console.log("Updating member:", editingMember.value.id, editForm);
  // Implement member update
  showEditModal.value = false;
  editingMember.value = null;
};
</script>

<style scoped>
/* Custom styles */
</style>
