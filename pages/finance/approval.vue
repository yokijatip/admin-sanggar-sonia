<template>
  <div class="container mx-auto px-4">
    <!-- Access Control Check -->
    <div
      v-if="!hasApprovalAccess"
      class="flex items-center justify-center min-h-[60vh]"
    >
      <Card class="max-w-md text-center">
        <CardContent class="pt-6">
          <ShieldX class="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 class="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p class="text-muted-foreground mb-4">
            You don't have permission to access this page. Only Owners and
            Managers can approve expenses.
          </p>
          <p class="text-sm text-muted-foreground">
            Your current role: <Badge variant="outline">{{ user?.role }}</Badge>
          </p>
          <Button @click="$router.push('/finance')" class="mt-4">
            Back to Finance Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Approval Interface (Only for Owner/Manager) -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-center justify-between">
        <HeadersContent
          title="Expense Approval Center"
          description="Review and approve pending expense requests"
        />
        <div class="flex items-center space-x-2">
          <Badge variant="outline" class="px-3 py-1">
            <Shield class="mr-1 h-3 w-3" />
            {{ user?.role }}
          </Badge>
          <Button variant="outline" @click="refreshData">
            <RefreshCw class="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <!-- Approval Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- Pending Expenses -->
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0"
          >
            <CardTitle class="text-sm font-medium">Pending Review</CardTitle>
            <Clock />
          </CardHeader>
          <CardContent>
            <div class="text-xl font-bold">
              {{ pendingExpenses.length }}
            </div>
            <p class="text-xs text-muted-foreground">Awaiting your approval</p>
          </CardContent>
        </Card>

        <!-- Total Amount -->
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0"
          >
            <CardTitle class="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign />
          </CardHeader>
          <CardContent>
            <div class="text-xl font-bold">
              Rp {{ formatPrice(totalPendingAmount) }}
            </div>
            <p class="text-xs text-muted-foreground">Pending approval value</p>
          </CardContent>
        </Card>

        <!-- Approved Today -->
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0"
          >
            <CardTitle class="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle class="text-green-500" />
          </CardHeader>
          <CardContent>
            <div class="text-xl font-bold text-green-600">
              {{ todayApprovedCount }}
            </div>
            <p class="text-xs text-muted-foreground">Expenses approved</p>
          </CardContent>
        </Card>

        <!-- Rejected Today -->
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0"
          >
            <CardTitle class="text-sm font-medium">Rejected Today</CardTitle>
            <XCircle class="text-red-500" />
          </CardHeader>
          <CardContent>
            <div class="text-xl font-bold text-red-600">
              {{ todayRejectedCount }}
            </div>
            <p class="text-xs text-muted-foreground">Expenses rejected</p>
          </CardContent>
        </Card>
        <!-- <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium flex items-center">
              <XCircle class="mr-2 h-4 w-4 text-red-600" />
              Rejected Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-red-600">
              {{ todayRejectedCount }}
            </div>
            <p class="text-xs text-muted-foreground">Expenses rejected</p>
          </CardContent>
        </Card> -->
      </div>

      <!-- Pending Expenses Table -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <AlertTriangle class="mr-2 h-5 w-5 text-orange-600" />
            Pending Expense Approvals
          </CardTitle>
          <CardDescription>
            Review and approve/reject expense requests from your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="pendingExpenses.length === 0" class="text-center py-8">
            <CheckCircle class="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-green-600 mb-2">
              All Caught Up!
            </h3>
            <p class="text-muted-foreground">
              No pending expenses to review at the moment.
            </p>
          </div>

          <Table v-else>
            <TableHeader>
              <TableRow>
                <TableHead>Expense Details</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead class="text-right">Amount</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="expense in pendingExpenses"
                :key="expense.id"
                class="hover:bg-muted/50"
              >
                <TableCell>
                  <div class="space-y-1">
                    <div class="font-medium">{{ expense.description }}</div>
                    <div class="flex items-center space-x-2">
                      <Badge variant="outline" class="text-xs">{{
                        getCategoryLabel(expense.category)
                      }}</Badge>
                      <span
                        v-if="expense.vendor"
                        class="text-xs text-muted-foreground"
                      >
                        Vendor: {{ expense.vendor }}
                      </span>
                    </div>
                    <div
                      v-if="expense.notes"
                      class="text-xs text-muted-foreground"
                    >
                      {{ expense.notes }}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <span class="text-xs font-medium">{{
                        expense.submittedBy.charAt(0)
                      }}</span>
                    </div>
                    <div>
                      <div class="font-medium text-sm">
                        {{ expense.submittedBy }}
                      </div>
                      <div class="text-xs text-muted-foreground">
                        {{ expense.department || "N/A" }}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="font-bold text-md">
                    Rp {{ formatPrice(expense.amount) }}
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {{ getPaymentMethodLabel(expense.paymentMethod) }}
                  </div>
                </TableCell>
                <TableCell>
                  <div class="text-sm">
                    {{ formatDate(expense.submittedDate) }}
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {{ getTimeAgo(expense.submittedDate) }}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    :variant="getPriorityVariant(expense.priority)"
                    class="text-xs"
                  >
                    {{ expense.priority || "Normal" }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="viewExpenseDetails(expense)"
                    >
                      <Eye class="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      @click="approveExpense(expense)"
                      class="bg-green-600 hover:bg-green-700"
                    >
                      <Check class="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      @click="rejectExpense(expense)"
                    >
                      <X class="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Recent Approval History -->
      <Card class="mt-6 mb-4">
        <CardHeader>
          <CardTitle class="flex items-center">
            <History class="mr-2 h-5 w-5" />
            Recent Approval History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="history in recentApprovalHistory"
              :key="history.id"
              class="flex items-center justify-between p-3 border rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="p-2 rounded-full"
                  :class="
                    history.action === 'approved'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  "
                >
                  <component
                    :is="history.action === 'approved' ? CheckCircle : XCircle"
                    :class="
                      history.action === 'approved'
                        ? 'text-green-600'
                        : 'text-red-600'
                    "
                    class="h-4 w-4"
                  />
                </div>
                <div>
                  <div class="font-medium">
                    {{ history.expenseDescription }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{
                      history.action === "approved" ? "Approved" : "Rejected"
                    }}
                    by {{ history.approvedBy }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div
                  class="font-bold"
                  :class="
                    history.action === 'approved'
                      ? 'text-green-600'
                      : 'text-red-600'
                  "
                >
                  Rp {{ formatPrice(history.amount) }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ formatDate(history.actionDate) }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Expense Details Modal -->
    <Dialog v-model:open="showDetailsModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Expense Approval Review</DialogTitle>
        </DialogHeader>
        <div v-if="selectedExpense" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="font-medium">Expense ID</Label>
              <p class="font-mono">{{ selectedExpense.expenseId }}</p>
            </div>
            <div>
              <Label class="font-medium">Amount</Label>
              <p class="text-lg font-bold">
                Rp {{ formatPrice(selectedExpense.amount) }}
              </p>
            </div>
          </div>
          <div>
            <Label class="font-medium">Description</Label>
            <p>{{ selectedExpense.description }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="font-medium">Category</Label>
              <Badge variant="outline">{{
                getCategoryLabel(selectedExpense.category)
              }}</Badge>
            </div>
            <div>
              <Label class="font-medium">Submitted By</Label>
              <p>{{ selectedExpense.submittedBy }}</p>
            </div>
          </div>
          <div v-if="selectedExpense.vendor">
            <Label class="font-medium">Vendor/Supplier</Label>
            <p>{{ selectedExpense.vendor }}</p>
          </div>
          <div v-if="selectedExpense.notes">
            <Label class="font-medium">Notes</Label>
            <p class="text-sm text-muted-foreground">
              {{ selectedExpense.notes }}
            </p>
          </div>
          <div class="flex justify-end space-x-2 pt-4">
            <Button variant="outline" @click="showDetailsModal = false"
              >Close</Button
            >
            <Button variant="destructive" @click="rejectExpenseFromModal">
              <X class="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              @click="approveExpenseFromModal"
              class="bg-green-600 hover:bg-green-700"
            >
              <Check class="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Rejection Reason Modal -->
    <Dialog v-model:open="showRejectionModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Expense</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="rejectionReason">Reason for Rejection *</Label>
            <Textarea
              id="rejectionReason"
              v-model="rejectionReason"
              placeholder="Please provide a reason for rejecting this expense..."
              rows="4"
              required
            />
          </div>
          <div class="flex justify-end space-x-2">
            <Button variant="outline" @click="showRejectionModal = false"
              >Cancel</Button
            >
            <Button variant="destructive" @click="confirmRejection">
              <X class="mr-2 h-4 w-4" />
              Reject Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldX, RefreshCw } from "lucide-vue-next";
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { useAuth } from "~/composables/useAuth";
import { definePageMeta } from "#imports";
import {
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Check,
  X,
  History,
} from "lucide-vue-next";

// Set page meta for role-based access
definePageMeta({
  middleware: ["auth", "role"],
  requiredRole: ["owner", "manager"], // Allow both owner and manager
});

const { user } = useAuth();

// Access control computed
const hasApprovalAccess = computed(() => {
  return (
    user.value && ["owner", "manager"].includes(user.value.role?.toLowerCase())
  );
});

// Sample pending expenses data
const pendingExpenses = computed(() => {
  // Implement logic to fetch pending expenses from API
  return [
    {
      id: 1,
      expenseId: "EXP-003",
      description: "Office Electricity Bill",
      category: "utilities",
      amount: 2500000000,
      vendor: "PLN",
      submittedBy: "Admin",
      department: "Operations",
      submittedDate: new Date(Date.now() - 86400000),
      paymentMethod: "bank_transfer",
      priority: "normal",
      notes: "Monthly electricity bill for main office",
    },
    {
      id: 2,
      expenseId: "EXP-006",
      description: "Emergency Equipment Repair",
      category: "operational",
      amount: 5000000,
      vendor: "Tech Solutions",
      submittedBy: "Production Manager",
      department: "Production",
      submittedDate: new Date(Date.now() - 43200000),
      paymentMethod: "cash",
      priority: "urgent",
      notes: "Oven repair needed immediately for production",
    },
    {
      id: 3,
      expenseId: "EXP-007",
      description: "Marketing Materials - Brochures",
      category: "marketing",
      amount: 1500000,
      vendor: "Print House",
      submittedBy: "Marketing Team",
      department: "Marketing",
      submittedDate: new Date(Date.now() - 172800000),
      paymentMethod: "credit_card",
      priority: "normal",
      notes: "New product brochures for Q4 campaign",
    },
  ];
});

const recentApprovalHistory = computed(() => {
  // Implement logic to fetch recent approval history from API
  return [
    {
      id: 1,
      expenseDescription: "Raw Material Purchase - Cotton",
      amount: 15000000,
      action: "approved",
      approvedBy: "Yoki Perkasa",
      actionDate: new Date(),
    },
    {
      id: 2,
      expenseDescription: "Unnecessary Software License",
      amount: 3000000,
      action: "rejected",
      approvedBy: "Yoki Perkasa",
      actionDate: new Date(Date.now() - 86400000),
    },
  ];
});

// State
const showDetailsModal = ref(false);
const showRejectionModal = ref(false);
const selectedExpense = ref(null);
const rejectionReason = ref("");
const expenseToReject = ref(null);

// Computed
const totalPendingAmount = computed(() => {
  return pendingExpenses.value.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
});

const todayApprovedCount = computed(() => {
  const today = new Date().toDateString();
  return recentApprovalHistory.value.filter(
    (h) => h.action === "approved" && h.actionDate.toDateString() === today
  ).length;
});

const todayRejectedCount = computed(() => {
  const today = new Date().toDateString();
  return recentApprovalHistory.value.filter(
    (h) => h.action === "rejected" && h.actionDate.toDateString() === today
  ).length;
});

// Methods
const formatPrice = (price) => {
  if (!price) return "0";
  return new Intl.NumberFormat("id-ID").format(price);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getTimeAgo = (date) => {
  const now = new Date();
  const diffHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const getCategoryLabel = (category) => {
  const labels = {
    materials: "Raw Materials",
    labor: "Labor Costs",
    operational: "Operational",
    marketing: "Marketing",
    utilities: "Utilities",
    transport: "Transportation",
  };
  return labels[category] || category;
};

const getPaymentMethodLabel = (method) => {
  const labels = {
    cash: "Cash",
    bank_transfer: "Bank Transfer",
    credit_card: "Credit Card",
  };
  return labels[method] || method;
};

const getPriorityVariant = (priority) => {
  const variants = {
    urgent: "destructive",
    high: "secondary",
    normal: "outline",
    low: "outline",
  };
  return variants[priority] || "outline";
};

const viewExpenseDetails = (expense) => {
  selectedExpense.value = expense;
  showDetailsModal.value = true;
};

const approveExpense = async (expense) => {
  try {
    // Here you would make API call to approve expense
    console.log("Approving expense:", expense.expenseId);

    // Remove from pending list
    const index = pendingExpenses.value.findIndex((e) => e.id === expense.id);
    if (index !== -1) {
      pendingExpenses.value.splice(index, 1);
    }

    // Add to approval history
    recentApprovalHistory.value.unshift({
      id: Date.now(),
      expenseDescription: expense.description,
      amount: expense.amount,
      action: "approved",
      approvedBy: user.value.name,
      actionDate: new Date(),
    });

    // Show success message (you can implement toast notification)
    alert(`Expense ${expense.expenseId} has been approved successfully!`);
  } catch (error) {
    console.error("Error approving expense:", error);
    alert("Failed to approve expense. Please try again.");
  }
};

const rejectExpense = (expense) => {
  expenseToReject.value = expense;
  rejectionReason.value = "";
  showRejectionModal.value = true;
};

const confirmRejection = async () => {
  if (!rejectionReason.value.trim()) {
    alert("Please provide a reason for rejection.");
    return;
  }

  try {
    const expense = expenseToReject.value;
    console.log(
      "Rejecting expense:",
      expense.expenseId,
      "Reason:",
      rejectionReason.value
    );

    // Remove from pending list
    const index = pendingExpenses.value.findIndex((e) => e.id === expense.id);
    if (index !== -1) {
      pendingExpenses.value.splice(index, 1);
    }

    // Add to approval history
    recentApprovalHistory.value.unshift({
      id: Date.now(),
      expenseDescription: expense.description,
      amount: expense.amount,
      action: "rejected",
      approvedBy: user.value.name,
      actionDate: new Date(),
    });

    showRejectionModal.value = false;
    alert(`Expense ${expense.expenseId} has been rejected.`);
  } catch (error) {
    console.error("Error rejecting expense:", error);
    alert("Failed to reject expense. Please try again.");
  }
};

const approveExpenseFromModal = () => {
  approveExpense(selectedExpense.value);
  showDetailsModal.value = false;
};

const rejectExpenseFromModal = () => {
  showDetailsModal.value = false;
  rejectExpense(selectedExpense.value);
};

const refreshData = () => {
  console.log("Refreshing approval data...");
};
</script>
