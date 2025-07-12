<template>
  <div class="container mx-auto px-4 min-w-full">
    <!-- Header -->
    <HeadersContent
      title="Finance Dashboard"
      description="Monitor your business financial performance"
    />

    <!-- Date Range Selector -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <Select v-model="selectedPeriod">
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
          <Input type="date" v-model="customDateRange.start" class="w-40" />
          <span>to</span>
          <Input type="date" v-model="customDateRange.end" class="w-40" />
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
              }}{{ financialData.revenueGrowth }}%
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
              }}{{ financialData.expenseGrowth }}%
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
          <div class="text-xl font-bold">
            Rp {{ formatPrice(financialData.netProfit) }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{
              (
                (financialData.netProfit / financialData.totalRevenue) *
                100
              ).toFixed(1)
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
          <div class="text-xl font-bold">
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
                  {{ category.percentage }}%
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
        <Button
          variant="outline"
          @click="$router.push('/finance/transactions')"
        >
          View All
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
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
                  :is="transaction.icon"
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
                  {{ transaction.category }} •
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
} from "lucide-vue-next";
import HeadersContent from "~/components/ui/HeadersContent.vue";

definePageMeta({
  middleware: "auth",
});

// State
const selectedPeriod = ref("month");
const customDateRange = reactive({
  start: "",
  end: "",
});

const financialData = reactive({
  totalRevenue: 125000000,
  totalExpenses: 85000000,
  netProfit: 40000000,
  cashFlow: 15000000,
  revenueGrowth: 12.5,
  expenseGrowth: 8.3,
});

const expenseCategories = ref([
  {
    name: "Raw Materials",
    amount: 35000000,
    percentage: 41.2,
    color: "#ef4444",
  },
  { name: "Labor Costs", amount: 25000000, percentage: 29.4, color: "#f97316" },
  { name: "Operational", amount: 15000000, percentage: 17.6, color: "#eab308" },
  { name: "Marketing", amount: 7000000, percentage: 8.2, color: "#22c55e" },
  { name: "Others", amount: 3000000, percentage: 3.5, color: "#6366f1" },
]);

const recentTransactions = ref([
  {
    id: 1,
    type: "income",
    description: "Order Payment - ORD-001",
    category: "Sales",
    amount: 2500000,
    date: new Date(),
    status: "completed",
    icon: ShoppingCart,
  },
  {
    id: 2,
    type: "expense",
    description: "Raw Material Purchase",
    category: "Materials",
    amount: 1200000,
    date: new Date(Date.now() - 86400000),
    status: "completed",
    icon: Truck,
  },
  {
    id: 3,
    type: "expense",
    description: "Employee Salary",
    category: "Labor",
    amount: 8000000,
    date: new Date(Date.now() - 172800000),
    status: "completed",
    icon: Users,
  },
  {
    id: 4,
    type: "expense",
    description: "Office Rent",
    category: "Operational",
    amount: 3000000,
    date: new Date(Date.now() - 259200000),
    status: "pending",
    icon: Settings,
  },
  {
    id: 5,
    type: "income",
    description: "Order Payment - ORD-002",
    category: "Sales",
    amount: 1800000,
    date: new Date(Date.now() - 345600000),
    status: "completed",
    icon: CreditCard,
  },
]);

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

const refreshData = () => {
  // Implement data refresh logic
  console.log("Refreshing financial data...");
};

const exportData = () => {
  // Implement export functionality
  console.log("Exporting financial data...");
};

onMounted(() => {
  // Load financial data
  console.log("Loading finance dashboard...");
});
</script>
