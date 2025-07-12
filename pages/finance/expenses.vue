<template>
  <div class="container mx-auto px-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <HeadersContent
        title="Expense Management"
        description="Track and manage your business expenses"
      />
      <div class="flex space-x-2">
        <Button variant="outline" @click="showFilters = !showFilters">
          <Filter class="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Button @click="showAddExpenseModal = true">
          <Plus class="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <Card v-if="showFilters" class="mb-6">
      <CardContent class="pt-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Category</Label>
            <Select v-model="filters.category">
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="materials">Raw Materials</SelectItem>
                <SelectItem value="labor">Labor Costs</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="transport">Transportation</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date From</Label>
            <Input type="date" v-model="filters.dateFrom" />
          </div>
          <div>
            <Label>Date To</Label>
            <Input type="date" v-model="filters.dateTo" />
          </div>
        </div>
        <div class="flex justify-end mt-4 space-x-2">
          <Button variant="outline" @click="clearFilters">Clear</Button>
          <Button @click="applyFilters">Apply Filters</Button>
        </div>
      </CardContent>
    </Card>

    <!-- Expense Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold">
            Rp {{ formatPrice(expenseSummary.total) }}
          </div>
          <p class="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium">Pending Approval</CardTitle>
          <Clock />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold text-orange-600">
            {{ expenseSummary.pending }}
          </div>
          <p class="text-xs text-muted-foreground">Awaiting approval</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium">Approved</CardTitle>
          <CheckCircle />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold text-green-600">
            {{ expenseSummary.approved }}
          </div>
          <p class="text-xs text-muted-foreground">Ready for payment</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium">Paid</CardTitle>
          <CreditCard />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold text-blue-600">
            {{ expenseSummary.paid }}
          </div>
          <p class="text-xs text-muted-foreground">Completed</p>
        </CardContent>
      </Card>
    </div>

    <!-- Expenses Table -->
    <Card>
      <CardHeader>
        <CardTitle>Expense Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expense ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="expense in filteredExpenses" :key="expense.id">
              <TableCell class="font-mono">{{ expense.expenseId }}</TableCell>
              <TableCell>
                <div>
                  <div class="font-medium">{{ expense.description }}</div>
                  <div
                    v-if="expense.vendor"
                    class="text-sm text-muted-foreground"
                  >
                    Vendor: {{ expense.vendor }}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{{
                  getCategoryLabel(expense.category)
                }}</Badge>
              </TableCell>
              <TableCell class="font-bold"
                >Rp {{ formatPrice(expense.amount) }}</TableCell
              >
              <TableCell>{{ formatDate(expense.date) }}</TableCell>
              <TableCell>{{ expense.submittedBy }}</TableCell>
              <TableCell>
                <Badge :variant="getStatusVariant(expense.status)">
                  {{ expense.status }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="viewExpense(expense)"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="editExpense(expense)"
                  >
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="deleteExpense(expense.id)"
                    class="text-red-600"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Add/Edit Expense Modal -->
    <Dialog v-model:open="showAddExpenseModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{
            editingExpense ? "Edit Expense" : "Add New Expense"
          }}</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="saveExpense" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="description" class="mb-2">Description *</Label>
              <Input
                id="description"
                v-model="expenseForm.description"
                required
              />
            </div>
            <div>
              <Label for="category" class="mb-2">Category *</Label>
              <Select v-model="expenseForm.category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materials">Raw Materials</SelectItem>
                  <SelectItem value="labor">Labor Costs</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="transport">Transportation</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="amount" class="mb-2">Amount (Rp) *</Label>
              <Input
                id="amount"
                type="number"
                v-model="expenseForm.amount"
                required
              />
            </div>
            <div>
              <Label for="date" class="mb-2">Date *</Label>
              <Input
                id="date"
                type="date"
                v-model="expenseForm.date"
                required
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="vendor" class="mb-2">Vendor/Supplier</Label>
              <Input id="vendor" v-model="expenseForm.vendor" />
            </div>
            <div>
              <Label for="paymentMethod" class="mb-2">Payment Method</Label>
              <Select v-model="expenseForm.paymentMethod">
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label for="notes" class="mb-2">Notes</Label>
            <Textarea id="notes" v-model="expenseForm.notes" rows="3" />
          </div>
          <div>
            <Label for="receipt" class="mb-2">Receipt/Invoice</Label>
            <Input
              id="receipt"
              type="file"
              accept="image/*,application/pdf"
              @change="handleFileUpload"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <Button type="button" variant="outline" @click="closeExpenseModal"
              >Cancel</Button
            >
            <Button type="submit"
              >{{ editingExpense ? "Update" : "Save" }} Expense</Button
            >
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  CheckCircle,
  CreditCard,
} from "lucide-vue-next";
import HeadersContent from "~/components/ui/HeadersContent.vue";

definePageMeta({
  middleware: "auth",
});

// State
const showFilters = ref(false);
const showAddExpenseModal = ref(false);
const editingExpense = ref(null);

const filters = reactive({
  category: "all",
  status: "all",
  dateFrom: "",
  dateTo: "",
});

const expenseForm = reactive({
  description: "",
  category: "",
  amount: "",
  date: "",
  vendor: "",
  paymentMethod: "",
  notes: "",
  receipt: null,
});

const expenseSummary = reactive({
  total: 85000000,
  pending: 12,
  approved: 8,
  paid: 45,
});

const expenses = ref([
  {
    id: 1,
    expenseId: "EXP-001",
    description: "Raw Material Purchase - Cotton",
    category: "materials",
    amount: 15000000,
    date: new Date(),
    vendor: "PT Textile Indonesia",
    submittedBy: "John Doe",
    status: "approved",
    paymentMethod: "bank_transfer",
    notes: "Monthly cotton supply",
  },
  {
    id: 2,
    expenseId: "EXP-002",
    description: "Employee Salary - Production Team",
    category: "labor",
    amount: 25000000,
    date: new Date(Date.now() - 86400000),
    submittedBy: "HR Department",
    status: "paid",
    paymentMethod: "bank_transfer",
    notes: "Monthly salary payment",
  },
  {
    id: 3,
    expenseId: "EXP-003",
    description: "Office Electricity Bill",
    category: "utilities",
    amount: 2500000,
    date: new Date(Date.now() - 172800000),
    vendor: "PLN",
    submittedBy: "Admin",
    status: "pending",
    paymentMethod: "bank_transfer",
    notes: "Monthly electricity bill",
  },
  {
    id: 4,
    expenseId: "EXP-004",
    description: "Marketing Campaign - Social Media",
    category: "marketing",
    amount: 5000000,
    date: new Date(Date.now() - 259200000),
    vendor: "Digital Agency XYZ",
    submittedBy: "Marketing Team",
    status: "approved",
    paymentMethod: "credit_card",
    notes: "Q1 social media campaign",
  },
  {
    id: 5,
    expenseId: "EXP-005",
    description: "Delivery Truck Fuel",
    category: "transport",
    amount: 1200000,
    date: new Date(Date.now() - 345600000),
    vendor: "Pertamina",
    submittedBy: "Logistics",
    status: "paid",
    paymentMethod: "cash",
    notes: "Weekly fuel refill",
  },
]);

// Computed
const filteredExpenses = computed(() => {
  let filtered = expenses.value;

  if (filters.category !== "all") {
    filtered = filtered.filter(
      (expense) => expense.category === filters.category
    );
  }
  if (filters.status !== "all") {
    filtered = filtered.filter((expense) => expense.status === filters.status);
  }
  if (filters.dateFrom) {
    filtered = filtered.filter(
      (expense) => new Date(expense.date) >= new Date(filters.dateFrom)
    );
  }
  if (filters.dateTo) {
    filtered = filtered.filter(
      (expense) => new Date(expense.date) <= new Date(filters.dateTo)
    );
  }

  return filtered;
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

const getCategoryLabel = (category) => {
  const labels = {
    materials: "Raw Materials",
    labor: "Labor Costs",
    operational: "Operational",
    marketing: "Marketing",
    utilities: "Utilities",
    transport: "Transportation",
    others: "Others",
  };
  return labels[category] || category;
};

const getStatusVariant = (status) => {
  const variants = {
    pending: "secondary",
    approved: "default",
    paid: "outline",
    rejected: "destructive",
  };
  return variants[status] || "secondary";
};

const clearFilters = () => {
  Object.assign(filters, {
    category: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
};

const applyFilters = () => {
  // Filters are applied automatically through computed property
  showFilters.value = false;
};

const viewExpense = (expense) => {
  // Implement view expense details
  console.log("Viewing expense:", expense);
};

const editExpense = (expense) => {
  editingExpense.value = expense;
  Object.assign(expenseForm, {
    description: expense.description,
    category: expense.category,
    amount: expense.amount,
    date: expense.date.toISOString().split("T")[0],
    vendor: expense.vendor || "",
    paymentMethod: expense.paymentMethod || "",
    notes: expense.notes || "",
  });
  showAddExpenseModal.value = true;
};

const deleteExpense = (expenseId) => {
  if (confirm("Are you sure you want to delete this expense?")) {
    const index = expenses.value.findIndex(
      (expense) => expense.id === expenseId
    );
    if (index !== -1) {
      expenses.value.splice(index, 1);
    }
  }
};

const saveExpense = () => {
  if (editingExpense.value) {
    // Update existing expense
    const index = expenses.value.findIndex(
      (expense) => expense.id === editingExpense.value.id
    );
    if (index !== -1) {
      expenses.value[index] = {
        ...expenses.value[index],
        ...expenseForm,
        date: new Date(expenseForm.date),
      };
    }
  } else {
    // Add new expense
    const newExpense = {
      id: Date.now(),
      expenseId: `EXP-${String(expenses.value.length + 1).padStart(3, "0")}`,
      ...expenseForm,
      date: new Date(expenseForm.date),
      submittedBy: "Current User",
      status: "pending",
    };
    expenses.value.unshift(newExpense);
  }
  closeExpenseModal();
};

const closeExpenseModal = () => {
  showAddExpenseModal.value = false;
  editingExpense.value = null;
  Object.assign(expenseForm, {
    description: "",
    category: "",
    amount: "",
    date: "",
    vendor: "",
    paymentMethod: "",
    notes: "",
    receipt: null,
  });
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    expenseForm.receipt = file;
  }
};

onMounted(() => {
  console.log("Expense management loaded");
});
</script>
