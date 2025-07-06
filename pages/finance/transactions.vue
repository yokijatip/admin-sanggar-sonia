<template>
  <div class="container mx-auto px-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <HeadersContent
        title="Transaction Management"
        description="Monitor all financial transactions and cash flow"
      />
      <div class="flex space-x-2">
        <Button variant="outline" @click="showFilters = !showFilters">
          <Filter class="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline" @click="exportTransactions">
          <Download class="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button @click="showAddTransactionModal = true">
          <Plus class="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <Card v-if="showFilters" class="mb-6">
      <CardContent class="pt-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label>Transaction Type</Label>
            <Select v-model="filters.type">
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Category</Label>
            <Select v-model="filters.category">
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="materials">Materials</SelectItem>
                <SelectItem value="labor">Labor</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
        <div class="flex justify-between items-center mt-4">
          <div class="flex items-center space-x-2">
            <Label>Search:</Label>
            <Input
              v-model="filters.search"
              placeholder="Search transactions..."
              class="w-64"
            />
          </div>
          <div class="flex space-x-2">
            <Button variant="outline" @click="clearFilters">Clear</Button>
            <Button @click="applyFilters">Apply Filters</Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Transaction Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Total Income </CardTitle>
          <TrendingUp class="text-green-600" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold text-green-600">
            Rp {{ formatPrice(transactionSummary.totalIncome) }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{ transactionSummary.incomeCount }} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium flex items-center">
            Total Expenses
          </CardTitle>
          <TrendingDown class="text-red-600" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold text-red-600">
            Rp {{ formatPrice(transactionSummary.totalExpenses) }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{ transactionSummary.expenseCount }} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Net Flow </CardTitle>
          <DollarSign class="text-blue-600" />
        </CardHeader>
        <CardContent>
          <div
            class="text-xl font-bold"
            :class="
              transactionSummary.netFlow >= 0
                ? 'text-green-600'
                : 'text-red-600'
            "
          >
            Rp {{ formatPrice(transactionSummary.netFlow) }}
          </div>
          <p class="text-xs text-muted-foreground">Current period</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium"> Pending </CardTitle>
          <Clock class="text-orange-600" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold text-orange-600">
            {{ transactionSummary.pendingCount }}
          </div>
          <p class="text-xs text-muted-foreground">Awaiting completion</p>
        </CardContent>
      </Card>
    </div>

    <!-- Transactions Table -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Showing {{ filteredTransactions.length }} of
            {{ transactions.length }} transactions
          </CardDescription>
        </div>
        <div class="flex items-center space-x-2">
          <Select v-model="itemsPerPage">
            <SelectTrigger class="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span class="text-sm text-muted-foreground">per page</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-32">Transaction ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="transaction in paginatedTransactions"
              :key="transaction.id"
            >
              <TableCell class="font-mono text-sm">
                {{ transaction.transactionId }}
              </TableCell>
              <TableCell>
                <div class="flex items-center space-x-3">
                  <div
                    class="p-2 rounded-full"
                    :class="
                      transaction.type === 'income'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    "
                  >
                    <component
                      :is="getTransactionIcon(transaction.category)"
                      :class="
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      "
                      class="h-4 w-4"
                    />
                  </div>
                  <div>
                    <div class="font-medium">{{ transaction.description }}</div>
                    <div
                      v-if="transaction.reference"
                      class="text-sm text-muted-foreground"
                    >
                      Ref: {{ transaction.reference }}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  :variant="
                    transaction.type === 'income' ? 'default' : 'secondary'
                  "
                >
                  {{ transaction.type }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{{
                  getCategoryLabel(transaction.category)
                }}</Badge>
              </TableCell>
              <TableCell
                class="font-bold"
                :class="
                  transaction.type === 'income'
                    ? 'text-green-600'
                    : 'text-red-600'
                "
              >
                {{ transaction.type === "income" ? "+" : "-" }}Rp
                {{ formatPrice(transaction.amount) }}
              </TableCell>
              <TableCell>
                <div class="text-sm">
                  {{ formatDate(transaction.date) }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ formatTime(transaction.date) }}
                </div>
              </TableCell>
              <TableCell>
                <div class="flex items-center space-x-2">
                  <component
                    :is="getPaymentIcon(transaction.paymentMethod)"
                    class="h-4 w-4 text-muted-foreground"
                  />
                  <span class="text-sm">{{
                    getPaymentMethodLabel(transaction.paymentMethod)
                  }}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="getStatusVariant(transaction.status)">
                  {{ transaction.status }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="viewTransaction(transaction)"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="editTransaction(transaction)"
                  >
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="deleteTransaction(transaction.id)"
                    class="text-red-600"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-muted-foreground">
            Showing {{ (currentPage - 1) * parseInt(itemsPerPage) + 1 }} to
            {{
              Math.min(
                currentPage * parseInt(itemsPerPage),
                filteredTransactions.length
              )
            }}
            of {{ filteredTransactions.length }} results
          </div>
          <div class="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              @click="previousPage"
              :disabled="currentPage === 1"
            >
              <ChevronLeft class="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              Next
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Add/Edit Transaction Modal -->
    <Dialog v-model:open="showAddTransactionModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{
            editingTransaction ? "Edit Transaction" : "Add New Transaction"
          }}</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="saveTransaction" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="type" class="mb-2">Transaction Type *</Label>
              <Select v-model="transactionForm.type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="category" class="mb-2">Category *</Label>
              <Select v-model="transactionForm.category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="labor">Labor</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label for="description" class="mb-2">Description *</Label>
            <Input
              id="description"
              v-model="transactionForm.description"
              required
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="amount" class="mb-2">Amount (Rp) *</Label>
              <Input
                id="amount"
                type="number"
                v-model="transactionForm.amount"
                required
              />
            </div>
            <div>
              <Label for="date" class="mb-2">Date *</Label>
              <Input
                id="date"
                type="datetime-local"
                v-model="transactionForm.date"
                required
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="paymentMethod" class="mb-2">Payment Method *</Label>
              <Select v-model="transactionForm.paymentMethod" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="status" class="mb-2">Status</Label>
              <Select v-model="transactionForm.status">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label for="reference" class="mb-2">Reference Number</Label>
            <Input
              id="reference"
              v-model="transactionForm.reference"
              placeholder="Order ID, Invoice number, etc."
            />
          </div>
          <div>
            <Label for="notes" class="mb-2">Notes</Label>
            <Textarea id="notes" v-model="transactionForm.notes" rows="3" />
          </div>
          <div class="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              @click="closeTransactionModal"
              >Cancel</Button
            >
            <Button type="submit"
              >{{ editingTransaction ? "Update" : "Save" }} Transaction</Button
            >
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- View Transaction Modal -->
    <Dialog v-model:open="showViewModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div v-if="selectedTransaction" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="font-medium mb-2">Transaction ID</Label>
              <p class="font-mono">{{ selectedTransaction.transactionId }}</p>
            </div>
            <div>
              <Label class="font-medium mb-2">Type</Label>
              <Badge
                :variant="
                  selectedTransaction.type === 'income'
                    ? 'default'
                    : 'secondary'
                "
              >
                {{ selectedTransaction.type }}
              </Badge>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="font-medium mb-2">Amount</Label>
              <p
                class="text-lg font-bold"
                :class="
                  selectedTransaction.type === 'income'
                    ? 'text-green-600'
                    : 'text-red-600'
                "
              >
                {{ selectedTransaction.type === "income" ? "+" : "-" }}Rp
                {{ formatPrice(selectedTransaction.amount) }}
              </p>
            </div>
            <div>
              <Label class="font-medium mb-2">Status</Label>
              <Badge :variant="getStatusVariant(selectedTransaction.status)">
                {{ selectedTransaction.status }}
              </Badge>
            </div>
          </div>
          <div>
            <Label class="font-medium mb-2">Description</Label>
            <p>{{ selectedTransaction.description }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="font-medium mb-2">Category</Label>
              <p>{{ getCategoryLabel(selectedTransaction.category) }}</p>
            </div>
            <div>
              <Label class="font-medium mb-2">Payment Method</Label>
              <p>
                {{ getPaymentMethodLabel(selectedTransaction.paymentMethod) }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="font-medium mb-2">Date</Label>
              <p>
                {{ formatDate(selectedTransaction.date) }}
                {{ formatTime(selectedTransaction.date) }}
              </p>
            </div>
            <div v-if="selectedTransaction.reference">
              <Label class="font-medium mb-2">Reference</Label>
              <p>{{ selectedTransaction.reference }}</p>
            </div>
          </div>
          <div v-if="selectedTransaction.notes">
            <Label class="font-medium mb-2">Notes</Label>
            <p class="text-sm text-muted-foreground">
              {{ selectedTransaction.notes }}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Download,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Truck,
  Users,
  Settings,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  FileText,
  Zap,
  Car,
} from "lucide-vue-next";
import HeadersContent from "~/components/ui/HeadersContent.vue";

// State
const showFilters = ref(false);
const showAddTransactionModal = ref(false);
const showViewModal = ref(false);
const editingTransaction = ref(null);
const selectedTransaction = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref("25");

const filters = reactive({
  type: "all",
  category: "all",
  status: "all",
  dateFrom: "",
  dateTo: "",
  search: "",
});

const transactionForm = reactive({
  type: "",
  category: "",
  description: "",
  amount: "",
  date: "",
  paymentMethod: "",
  status: "completed",
  reference: "",
  notes: "",
});

const transactions = ref([
  {
    id: 1,
    transactionId: "TXN-001",
    type: "income",
    description: "Order Payment - ORD-001",
    category: "sales",
    amount: 2500000,
    date: new Date(),
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "ORD-001",
    notes: "Payment for custom cake order",
  },
  {
    id: 2,
    transactionId: "TXN-002",
    type: "expense",
    description: "Raw Material Purchase - Flour & Sugar",
    category: "materials",
    amount: 1200000,
    date: new Date(Date.now() - 86400000),
    paymentMethod: "cash",
    status: "completed",
    reference: "INV-2024-001",
    notes: "Monthly ingredient stock",
  },
  {
    id: 3,
    transactionId: "TXN-003",
    type: "expense",
    description: "Employee Salary - Production Team",
    category: "labor",
    amount: 8000000,
    date: new Date(Date.now() - 172800000),
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "SAL-2024-01",
    notes: "Monthly salary payment",
  },
  {
    id: 4,
    transactionId: "TXN-004",
    type: "expense",
    description: "Office Rent Payment",
    category: "operational",
    amount: 3000000,
    date: new Date(Date.now() - 259200000),
    paymentMethod: "bank_transfer",
    status: "pending",
    reference: "RENT-2024-01",
    notes: "Monthly office rent",
  },
  {
    id: 5,
    transactionId: "TXN-005",
    type: "income",
    description: "Order Payment - ORD-002",
    category: "sales",
    amount: 1800000,
    date: new Date(Date.now() - 345600000),
    paymentMethod: "credit_card",
    status: "completed",
    reference: "ORD-002",
    notes: "Wedding cake order",
  },
  {
    id: 6,
    transactionId: "TXN-006",
    type: "expense",
    description: "Marketing Campaign - Social Media Ads",
    category: "marketing",
    amount: 500000,
    date: new Date(Date.now() - 432000000),
    paymentMethod: "credit_card",
    status: "completed",
    reference: "MKT-2024-001",
    notes: "Facebook and Instagram ads",
  },
  {
    id: 7,
    transactionId: "TXN-007",
    type: "expense",
    description: "Electricity Bill",
    category: "utilities",
    amount: 750000,
    date: new Date(Date.now() - 518400000),
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "PLN-2024-01",
    notes: "Monthly electricity bill",
  },
  {
    id: 8,
    transactionId: "TXN-008",
    type: "expense",
    description: "Delivery Service",
    category: "transport",
    amount: 300000,
    date: new Date(Date.now() - 604800000),
    paymentMethod: "cash",
    status: "completed",
    reference: "DEL-2024-001",
    notes: "Customer delivery charges",
  },
]);

// Computed
const filteredTransactions = computed(() => {
  let filtered = transactions.value;

  if (filters.type !== "all") {
    filtered = filtered.filter((t) => t.type === filters.type);
  }
  if (filters.category !== "all") {
    filtered = filtered.filter((t) => t.category === filters.category);
  }
  if (filters.status !== "all") {
    filtered = filtered.filter((t) => t.status === filters.status);
  }
  if (filters.dateFrom) {
    filtered = filtered.filter(
      (t) => new Date(t.date) >= new Date(filters.dateFrom)
    );
  }
  if (filters.dateTo) {
    filtered = filtered.filter(
      (t) => new Date(t.date) <= new Date(filters.dateTo)
    );
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(search) ||
        t.transactionId.toLowerCase().includes(search) ||
        (t.reference && t.reference.toLowerCase().includes(search))
    );
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
});

const totalPages = computed(() => {
  return Math.ceil(
    filteredTransactions.value.length / parseInt(itemsPerPage.value)
  );
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value);
  const end = start + parseInt(itemsPerPage.value);
  return filteredTransactions.value.slice(start, end);
});

const transactionSummary = computed(() => {
  const income = filteredTransactions.value.filter((t) => t.type === "income");
  const expenses = filteredTransactions.value.filter(
    (t) => t.type === "expense"
  );
  const pending = filteredTransactions.value.filter(
    (t) => t.status === "pending"
  );

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    netFlow: totalIncome - totalExpenses,
    incomeCount: income.length,
    expenseCount: expenses.length,
    pendingCount: pending.length,
  };
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

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getCategoryLabel = (category) => {
  const labels = {
    sales: "Sales",
    materials: "Materials",
    labor: "Labor",
    operational: "Operational",
    marketing: "Marketing",
    utilities: "Utilities",
    transport: "Transport",
    others: "Others",
  };
  return labels[category] || category;
};

const getPaymentMethodLabel = (method) => {
  const labels = {
    cash: "Cash",
    bank_transfer: "Bank Transfer",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    check: "Check",
    digital_wallet: "Digital Wallet",
  };
  return labels[method] || method;
};

const getStatusVariant = (status) => {
  const variants = {
    completed: "default",
    pending: "secondary",
    cancelled: "destructive",
  };
  return variants[status] || "secondary";
};

const getTransactionIcon = (category) => {
  const icons = {
    sales: ShoppingCart,
    materials: Truck,
    labor: Users,
    operational: Settings,
    marketing: Smartphone,
    utilities: Zap,
    transport: Car,
    others: FileText,
  };
  return icons[category] || FileText;
};

const getPaymentIcon = (method) => {
  const icons = {
    cash: Banknote,
    bank_transfer: Building,
    credit_card: CreditCard,
    debit_card: CreditCard,
    check: FileText,
    digital_wallet: Smartphone,
  };
  return icons[method] || CreditCard;
};

const clearFilters = () => {
  Object.assign(filters, {
    type: "all",
    category: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  currentPage.value = 1;
};

const applyFilters = () => {
  currentPage.value = 1;
  showFilters.value = false;
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const viewTransaction = (transaction) => {
  selectedTransaction.value = transaction;
  showViewModal.value = true;
};

const editTransaction = (transaction) => {
  editingTransaction.value = transaction;
  Object.assign(transactionForm, {
    type: transaction.type,
    category: transaction.category,
    description: transaction.description,
    amount: transaction.amount,
    date: new Date(transaction.date).toISOString().slice(0, 16),
    paymentMethod: transaction.paymentMethod,
    status: transaction.status,
    reference: transaction.reference || "",
    notes: transaction.notes || "",
  });
  showAddTransactionModal.value = true;
};

const deleteTransaction = (transactionId) => {
  if (confirm("Are you sure you want to delete this transaction?")) {
    const index = transactions.value.findIndex((t) => t.id === transactionId);
    if (index !== -1) {
      transactions.value.splice(index, 1);
    }
  }
};

const saveTransaction = () => {
  if (editingTransaction.value) {
    // Update existing transaction
    const index = transactions.value.findIndex(
      (t) => t.id === editingTransaction.value.id
    );
    if (index !== -1) {
      transactions.value[index] = {
        ...transactions.value[index],
        ...transactionForm,
        date: new Date(transactionForm.date),
      };
    }
  } else {
    // Add new transaction
    const newTransaction = {
      id: Date.now(),
      transactionId: `TXN-${String(transactions.value.length + 1).padStart(
        3,
        "0"
      )}`,
      ...transactionForm,
      date: new Date(transactionForm.date),
    };
    transactions.value.unshift(newTransaction);
  }
  closeTransactionModal();
};

const closeTransactionModal = () => {
  showAddTransactionModal.value = false;
  editingTransaction.value = null;
  Object.assign(transactionForm, {
    type: "",
    category: "",
    description: "",
    amount: "",
    date: "",
    paymentMethod: "",
    status: "completed",
    reference: "",
    notes: "",
  });
};

const exportTransactions = () => {
  // Implement export functionality
  console.log("Exporting transactions...");
};

onMounted(() => {
  console.log("Transaction management loaded");
});
</script>
