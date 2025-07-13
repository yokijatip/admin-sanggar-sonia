<template>
  <div class="container mx-auto px-4 min-w-full">
    <!-- Header -->
    <HeadersContent
      title="Finance Dashboard"
      description="Monitor your business financial performance"
    />

    <!-- Alert Messages -->
    <Alert
      v-if="message"
      :class="messageType === 'error' ? 'border-red-500' : 'border-green-500'"
      class="mb-6"
    >
      <AlertDescription>{{ message }}</AlertDescription>
    </Alert>

    <!-- Date Range Selector -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <Select
          v-model="selectedPeriod"
          @update:model-value="loadFinancialData"
        >
          <SelectTrigger class="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        <div
          v-if="selectedPeriod === 'custom'"
          class="flex items-center space-x-2"
        >
          <Input
            type="date"
            v-model="customDateRange.start"
            class="w-40"
            @change="loadFinancialData"
          />
          <span>to</span>
          <Input
            type="date"
            v-model="customDateRange.end"
            class="w-40"
            @change="loadFinancialData"
          />
        </div>
      </div>

      <div class="flex space-x-2">
        <Button variant="outline" @click="exportData">
          <Download class="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button @click="refreshData">
          <RefreshCw class="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>

    <!-- Financial Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Revenue -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
          <TrendingUp class="text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold text-green-600">
            Rp {{ formatPrice(financialData.totalRevenue) }}
          </div>
          <p class="text-xs text-muted-foreground">
            <span
              :class="
                financialData.revenueGrowth >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              {{ financialData.revenueGrowth >= 0 ? "+" : ""
              }}{{ financialData.revenueGrowth.toFixed(1) }}%
            </span>
            from last period
          </p>
        </CardContent>
      </Card>

      <!-- Total Expenses -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown class="text-red-500" />
        </CardHeader>
        <CardContent>
          <div class="text-xl font-bold text-red-600">
            Rp {{ formatPrice(financialData.totalExpenses) }}
          </div>
          <p class="text-xs text-muted-foreground">
            <span
              :class="
                financialData.expenseGrowth <= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              {{ financialData.expenseGrowth >= 0 ? "+" : ""
              }}{{ financialData.expenseGrowth.toFixed(1) }}%
            </span>
            from last period
          </p>
        </CardContent>
      </Card>

      <!-- Net Profit -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium">Net Profit</CardTitle>
          <DollarSign />
        </CardHeader>
        <CardContent>
          <div
            class="text-xl font-bold"
            :class="
              financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
            "
          >
            Rp {{ formatPrice(financialData.netProfit) }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{
              financialData.totalRevenue > 0
                ? (
                    (financialData.netProfit / financialData.totalRevenue) *
                    100
                  ).toFixed(1)
                : 0
            }}% profit margin
          </p>
        </CardContent>
      </Card>

      <!-- Cash Flow -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0"
        >
          <CardTitle class="text-sm font-medium">Cash Flow</CardTitle>
          <Wallet />
        </CardHeader>
        <CardContent>
          <div
            class="text-xl font-bold"
            :class="
              financialData.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'
            "
          >
            Rp {{ formatPrice(financialData.cashFlow) }}
          </div>
          <p class="text-xs text-muted-foreground">Current cash position</p>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Revenue vs Expenses Chart -->
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
          <CardDescription>Monthly comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-80 flex items-center justify-center bg-gray-50 rounded">
            <div class="text-center">
              <BarChart3 class="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500">
                Chart will be implemented with Chart.js
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Expense Categories -->
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>Breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="category in expenseCategories"
              :key="category.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-4 h-4 rounded"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <span class="text-sm font-medium">{{ category.name }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold">
                  Rp {{ formatPrice(category.amount) }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ category.percentage.toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Transactions -->
    <Card class="mb-4">
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest financial activities</CardDescription>
        </div>
        <Button variant="outline" @click="$router.push('/admin/transaction')">
          View All
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div v-if="loadingTransactions" class="text-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
          ></div>
          <p class="mt-2 text-sm text-muted-foreground">
            Loading transactions...
          </p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            class="flex items-center justify-between p-4 border rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <div
                class="p-2 rounded-full"
                :class="
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
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
                <div class="text-sm text-muted-foreground">
                  {{ getCategoryLabel(transaction.category) }} •
                  {{ formatDate(transaction.date) }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div
                class="font-bold"
                :class="
                  transaction.type === 'income'
                    ? 'text-green-600'
                    : 'text-red-600'
                "
              >
                {{ transaction.type === "income" ? "+" : "-" }}Rp
                {{ formatPrice(transaction.amount) }}
              </div>
              <Badge
                :variant="
                  transaction.status === 'completed' ? 'default' : 'secondary'
                "
              >
                {{ transaction.status }}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Download,
  RefreshCw,
  BarChart3,
  ArrowRight,
  ShoppingCart,
  Truck,
  Users,
  Settings,
  CreditCard,
  Smartphone,
  Zap,
  Car,
  FileText,
} from "lucide-vue-next";
import HeadersContent from "~/components/ui/HeadersContent.vue";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

definePageMeta({
  middleware: "auth",
});

// State
const selectedPeriod = ref("month");
const customDateRange = reactive({
  start: "",
  end: "",
});
const message = ref("");
const messageType = ref("");
const loadingTransactions = ref(false);

const financialData = reactive({
  totalRevenue: 0,
  totalExpenses: 0,
  netProfit: 0,
  cashFlow: 0,
  revenueGrowth: 0,
  expenseGrowth: 0,
});

const expenseCategories = ref([]);
const recentTransactions = ref([]);

// Helper function to get date range based on selected period
const getDateRange = () => {
  const now = new Date();
  let startDate, endDate;

  switch (selectedPeriod.value) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case "week":
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      startDate = new Date(
        weekStart.getFullYear(),
        weekStart.getMonth(),
        weekStart.getDate()
      );
      endDate = new Date(
        weekStart.getFullYear(),
        weekStart.getMonth(),
        weekStart.getDate() + 7
      );
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    case "quarter":
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterStart, 1);
      endDate = new Date(now.getFullYear(), quarterStart + 3, 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 1);
      break;
    case "custom":
      if (customDateRange.start && customDateRange.end) {
        startDate = new Date(customDateRange.start);
        endDate = new Date(customDateRange.end);
        endDate.setDate(endDate.getDate() + 1); // Include end date
      } else {
        // Default to current month if custom dates not set
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      }
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  return { startDate, endDate };
};

// Function to fetch financial data from Firestore
const loadFinancialData = async () => {
  try {
    const { $firebase } = useNuxtApp();
    const { startDate, endDate } = getDateRange();

    // Fetch transactions within date range
    const transactionsQuery = query(
      collection($firebase.firestore, "transactions"),
      where("date", ">=", startDate),
      where("date", "<", endDate),
      orderBy("date", "desc")
    );

    const transactionsSnapshot = await getDocs(transactionsQuery);
    const transactions = transactionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
      };
    });

    // Calculate revenue (only sales income)
    const revenue = transactions
      .filter((t) => t.type === "income" && t.category === "sales")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total expenses (all expense transactions)
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate net profit
    const netProfit = revenue - expenses;

    // Calculate cash flow (all income - all expenses)
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const cashFlow = totalIncome - totalExpenses;

    // Update financial data
    Object.assign(financialData, {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: netProfit,
      cashFlow: cashFlow,
      revenueGrowth: 12.5, // TODO: Calculate actual growth
      expenseGrowth: 8.3, // TODO: Calculate actual growth
    });

    // Calculate expense categories
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      });

    const categoryColors = {
      materials: "#ef4444",
      labor: "#f97316",
      operational: "#eab308",
      marketing: "#22c55e",
      utilities: "#6366f1",
      transportation: "#8b5cf6",
      others: "#64748b",
    };

    expenseCategories.value = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: getCategoryLabel(category),
        amount,
        percentage: expenses > 0 ? (amount / expenses) * 100 : 0,
        color: categoryColors[category] || "#64748b",
      }))
      .sort((a, b) => b.amount - a.amount);

    // Get recent transactions (last 5)
    recentTransactions.value = transactions.slice(0, 5);

    console.log("Financial data loaded:", financialData);
  } catch (error) {
    console.error("Error loading financial data:", error);
    showMessage("Failed to load financial data", "error");
  }
};

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
    sales: "Sales",
    materials: "Raw Materials",
    labor: "Labor Costs",
    operational: "Operational",
    marketing: "Marketing",
    utilities: "Utilities",
    transportation: "Transportation",
    others: "Others",
  };
  return labels[category] || category;
};

const getTransactionIcon = (category) => {
  const icons = {
    sales: ShoppingCart,
    materials: Truck,
    labor: Users,
    operational: Settings,
    marketing: Smartphone,
    utilities: Zap,
    transportation: Car,
    others: FileText,
  };
  return icons[category] || FileText;
};

const showMessage = (msg, type) => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
    messageType.value = "";
  }, 5000);
};

const refreshData = () => {
  loadFinancialData();
  showMessage("Financial data refreshed successfully!", "success");
};

const exportData = () => {
  // TODO: Implement export functionality
  console.log("Exporting financial data...");
  showMessage("Export functionality will be implemented soon", "info");
};

onMounted(() => {
  console.log("Loading finance dashboard...");
  loadFinancialData();
});
</script>
