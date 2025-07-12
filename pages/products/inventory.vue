<template>
  <div class="container mx-auto px-4 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between px-4">
      <HeadersContent
        title="Inventory Management"
        description="Monitor and manage your stock levels"
      />
      <div class="flex gap-2">
        <Button @click="openStockAdjustment" variant="outline">
          <Package class="mr-2 h-4 w-4" />
          Stock Adjustment
        </Button>
        <Button @click="exportInventory">
          <Download class="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>

    <!-- Stock Overview Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Total Items</CardTitle>
          <Package class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ totalItems }}</div>
          <p class="text-xs text-muted-foreground">Active products</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Low Stock Items</CardTitle>
          <AlertTriangle class="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-orange-600">
            {{ lowStockCount }}
          </div>
          <p class="text-xs text-muted-foreground">Need reorder</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Out of Stock</CardTitle>
          <XCircle class="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-600">
            {{ outOfStockCount }}
          </div>
          <p class="text-xs text-muted-foreground">Items unavailable</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Total Value</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            ${{ totalInventoryValue.toLocaleString() }}
          </div>
          <p class="text-xs text-muted-foreground">Current inventory value</p>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Alerts -->
    <div v-if="alerts.length > 0" class="space-y-2 px-4">
      <Alert v-for="alert in alerts" :key="alert.id" :variant="alert.type">
        <AlertTriangle class="h-4 w-4" />
        <AlertTitle>{{ alert.title }}</AlertTitle>
        <AlertDescription>{{ alert.description }}</AlertDescription>
      </Alert>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-wrap items-center gap-4 px-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Search by product name or SKU..."
          class="pl-8"
          @input="filterInventory"
        />
      </div>

      <Select v-model="selectedStatus" @update:modelValue="filterInventory">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Stock Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="normal">Normal Stock</SelectItem>
          <SelectItem value="low">Low Stock</SelectItem>
          <SelectItem value="out">Out of Stock</SelectItem>
          <SelectItem value="overstocked">Overstocked</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedCategory" @update:modelValue="filterInventory">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedLocation" @update:modelValue="filterInventory">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="warehouse-a">Warehouse A</SelectItem>
          <SelectItem value="warehouse-b">Warehouse B</SelectItem>
          <SelectItem value="store-front">Store Front</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Tabs for different views -->
    <div class="border-b px-4">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300',
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Stock Management Table -->
    <div v-if="activeTab === 'stock'" class="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">
              <Checkbox
                :checked="selectAll"
                @update:checked="toggleSelectAll"
              />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead class="text-center">Current Stock</TableHead>
            <TableHead class="text-center">Min Level</TableHead>
            <TableHead class="text-center">Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="item in paginatedInventory"
            :key="item.id"
            class="hover:bg-muted/50"
          >
            <TableCell>
              <Checkbox
                :checked="selectedItems.includes(item.id)"
                @update:checked="toggleItemSelection(item.id)"
              />
            </TableCell>
            <TableCell>
              <div class="flex flex-col">
                <span class="font-medium">{{ item.productName }}</span>
                <span class="text-sm text-muted-foreground">{{
                  item.category
                }}</span>
              </div>
            </TableCell>
            <TableCell class="font-mono text-sm">{{ item.sku }}</TableCell>
            <TableCell class="text-center">
              <Badge
                :variant="
                  getStockBadgeVariant(item.currentStock, item.minLevel)
                "
              >
                {{ item.currentStock }}
              </Badge>
            </TableCell>
            <TableCell class="text-center">{{ item.minLevel }}</TableCell>
            <TableCell class="text-center">
              <Badge :variant="getStatusVariant(item.status)">
                {{ item.status.replace("_", " ") }}
              </Badge>
            </TableCell>
            <TableCell>{{ item.location }}</TableCell>
            <TableCell class="text-sm text-muted-foreground">
              {{ formatDate(item.lastUpdated) }}
            </TableCell>
            <TableCell class="text-right">
              <div class="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" @click="adjustStock(item.id)">
                  <Edit class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" @click="viewHistory(item.id)">
                  <History class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Stock Movement History -->
    <div v-if="activeTab === 'history'" class="border">
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">Stock Movement History</h3>
          <div class="flex gap-2">
            <Select
              v-model="historyFilter"
              @update:modelValue="filterStockMovements"
            >
              <SelectTrigger class="w-48">
                <SelectValue placeholder="Filter Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="return">Return</SelectItem>
              </SelectContent>
            </Select>
            <Button @click="refreshStockMovements" variant="outline" size="sm">
              <History class="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead class="text-center">Quantity</TableHead>
            <TableHead class="text-center">Before</TableHead>
            <TableHead class="text-center">After</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="filteredStockMovements.length === 0">
            <TableCell
              colspan="9"
              class="text-center py-8 text-muted-foreground"
            >
              No stock movement history found
            </TableCell>
          </TableRow>
          <TableRow
            v-for="movement in paginatedStockMovements"
            :key="movement.id"
          >
            <TableCell class="text-sm">{{
              formatDateTime(movement.date)
            }}</TableCell>
            <TableCell>{{ movement.productName }}</TableCell>
            <TableCell>
              <Badge :variant="getMovementTypeVariant(movement.type)">
                {{ movement.type }}
              </Badge>
            </TableCell>
            <TableCell class="text-center">
              <span
                :class="
                  movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ movement.quantity > 0 ? "+" : "" }}{{ movement.quantity }}
              </span>
            </TableCell>
            <TableCell class="text-center">{{
              movement.stockBefore
            }}</TableCell>
            <TableCell class="text-center">{{ movement.stockAfter }}</TableCell>
            <TableCell class="text-sm">{{ movement.reference }}</TableCell>
            <TableCell class="text-sm">{{ movement.user }}</TableCell>
            <TableCell class="text-sm text-muted-foreground">{{
              movement.notes
            }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <!-- Pagination for Stock Movements -->
      <div
        class="flex items-center justify-between space-x-2 py-4 px-4 border-t"
      >
        <div class="text-sm text-muted-foreground">
          Showing {{ (currentMovementPage - 1) * movementsPerPage + 1 }} -
          {{
            Math.min(
              currentMovementPage * movementsPerPage,
              filteredStockMovements.length
            )
          }}
          of {{ filteredStockMovements.length }} movements
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            @click="currentMovementPage--"
            :disabled="currentMovementPage === 1"
          >
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <span class="text-sm">
            {{ currentMovementPage }} / {{ totalMovementPages }}
          </span>
          <Button
            variant="outline"
            size="sm"
            @click="currentMovementPage++"
            :disabled="currentMovementPage === totalMovementPages"
          >
            <ChevronRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Low Stock Alerts -->
    <div v-if="activeTab === 'alerts'" class="space-y-4">
      <div
        v-for="alert in lowStockItems"
        :key="alert.id"
        class="border rounded-lg p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <AlertTriangle class="h-5 w-5 text-orange-500" />
            <div>
              <h3 class="font-medium">{{ alert.productName }}</h3>
              <p class="text-sm text-muted-foreground">SKU: {{ alert.sku }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-medium">
                Current: {{ alert.currentStock }}
              </p>
              <p class="text-sm text-muted-foreground">
                Min: {{ alert.minLevel }}
              </p>
            </div>
            <Button size="sm" @click="reorderProduct(alert.id)">
              <ShoppingCart class="h-4 w-4 mr-1" />
              Reorder
            </Button>
          </div>
        </div>
      </div>
    </div>
    <!-- Low Stock Alerts -->
    <div v-if="activeTab === 'alerts'" class="space-y-4">
      <div
        v-if="lowStockItems.length === 0"
        class="text-center py-8 text-muted-foreground"
      >
        <AlertTriangle
          class="h-12 w-12 mx-auto mb-4 text-muted-foreground/50"
        />
        <p>No low stock alerts at the moment</p>
      </div>
      <div
        v-for="alert in lowStockItems"
        :key="alert.id"
        class="border rounded-lg p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <AlertTriangle class="h-5 w-5 text-orange-500" />
            <div>
              <h3 class="font-medium">{{ alert.productName }}</h3>
              <p class="text-sm text-muted-foreground">SKU: {{ alert.sku }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-medium">
                Current: {{ alert.currentStock }}
              </p>
              <p class="text-sm text-muted-foreground">
                Min: {{ alert.minLevel }}
              </p>
            </div>
            <Button size="sm" @click="reorderProduct(alert.id)">
              <ShoppingCart class="h-4 w-4 mr-1" />
              Reorder
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics -->
    <div
      v-if="activeTab === 'analytics'"
      class="grid gap-6 md:grid-cols-2 px-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Stock Turnover</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="item in topMovingItems"
              :key="item.id"
              class="flex justify-between items-center"
            >
              <span class="text-sm">{{ item.name }}</span>
              <Badge variant="outline">{{ item.turnoverRate }}x</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dead Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="item in deadStockItems"
              :key="item.id"
              class="flex justify-between items-center"
            >
              <span class="text-sm">{{ item.name }}</span>
              <span class="text-sm text-muted-foreground"
                >{{ item.daysStagnant }} days</span
              >
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between space-x-2 py-4 px-4">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select v-model="itemsPerPage" @update:modelValue="changePage(1)">
          <SelectTrigger class="h-8 w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex items-center space-x-6 lg:space-x-8">
        <div class="flex w-32 items-center justify-center text-sm font-medium">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            <ChevronRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Stock Adjustment Modal -->
    <div
      v-if="showAdjustmentModal"
      class="fixed inset-0 bg-slate-900/70 bg-opacity-50 flex items-center justify-center z-50"
    >
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle>Stock Adjustment</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="relative">
            <Label class="pb-1">Product</Label>
            <Input
              v-model="adjustmentSearchInput"
              type="text"
              placeholder="Search product name"
              @input="showAdjustmentDropdown = true"
              @focus="showAdjustmentDropdown = true"
              @blur="hideAdjustmentDropdown"
            />
            <!-- Dropdown List -->
            <div
              v-if="
                showAdjustmentDropdown && filteredAdjustmentProducts.length > 0
              "
              class="absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1"
            >
              <div
                v-for="item in filteredAdjustmentProducts"
                :key="item.id"
                @mousedown.prevent="selectAdjustmentProduct(item)"
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {{ item.productName }}
              </div>
            </div>
          </div>

          <div>
            <Label class="mb-2">Adjustment Type</Label>
            <Select v-model="adjustmentForm.type">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase">Increase Stock</SelectItem>
                <SelectItem value="decrease">Decrease Stock</SelectItem>
                <SelectItem value="set">Set Stock Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label class="mb-2">Quantity</Label>
            <Input
              v-model="adjustmentForm.quantity"
              type="number"
              placeholder="Enter quantity"
            />
          </div>

          <!-- Field Min Level yang baru ditambahkan -->
          <div>
            <Label class="mb-2">Min Level</Label>
            <Input
              v-model="adjustmentForm.minLevel"
              type="number"
              placeholder="Enter minimum stock level"
              min="0"
            />
            <p class="text-xs text-muted-foreground mt-1">
              Stock will be marked as "Low Stock" when below this level
            </p>
          </div>

          <div>
            <Label class="mb-2">Reason</Label>
            <Select v-model="adjustmentForm.reason">
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="correction">Correction</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label class="mb-2">Notes</Label>
            <Textarea
              v-model="adjustmentForm.notes"
              placeholder="Additional notes..."
            />
          </div>
        </CardContent>
        <CardHeader>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="closeAdjustmentModal"
              >Cancel</Button
            >
            <Button @click="submitAdjustment">Submit</Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  Search,
  Download,
  Edit,
  History,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import HeadersContent from "~/components/ui/HeadersContent.vue";

import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
  getDoc,
  where,
  limit,
} from "firebase/firestore";

definePageMeta({
  middleware: "auth",
});

// Firebase
const { $firebase } = useNuxtApp();

//categories
const categories = ref([]);

// Fetch categories from Firebase
const fetchCategories = () => {
  const q = query(
    collection($firebase.firestore, "categories"),
    orderBy("name")
  );
  onSnapshot(q, (snapshot) => {
    console.log("=== FETCH CATEGORIES DEBUG ===");
    console.log("Fetched categories count:", snapshot.docs.length);

    categories.value = snapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Category:", data);
      return {
        id: data.id || doc.id,
        name: data.name,
        firestoreId: doc.id,
      };
    });

    console.log("All categories:", categories.value);
  });
};

// Helper function to get category name by id
const getCategoryName = (categoryId) => {
  if (!categoryId) return "Uncategorized";
  const category = categories.value.find((cat) => cat.id === categoryId);
  return category ? category.name : categoryId;
};

// Sample inventory data
const allInventory = ref([]);

const fetchInventory = () => {
  const q = query(
    collection($firebase.firestore, "products"),
    orderBy("title")
  );
  onSnapshot(q, (snapshot) => {
    console.log("=== FETCH INVENTORY DEBUG ===");
    console.log("Fetched documents count:", snapshot.docs.length);

    allInventory.value = snapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Processing document:");
      console.log("- Firestore Document ID:", doc.id);
      console.log("- Document data.id field:", data.id);
      console.log("- Document title:", data.title);

      const processedItem = {
        id: doc.id, // INI HARUS FIRESTORE DOCUMENT ID
        productId: data.id, // Field "id" dari document
        ...data,
        productName: data.title, // mapping title ke productName
        currentStock: data.stock,
        minLevel: data.minLevel,
        maxLevel: data.maxLevel || null,
        status:
          data.statusInventory ||
          (data.stock === 0
            ? "out"
            : data.stock <= data.minLevel
            ? "low"
            : "normal"),
        unitCost: data.price,
        lastUpdated:
          data.updatedAt?.toDate?.() ||
          data.createdAt?.toDate?.() ||
          new Date(),
        sku: data.id || `SKU-${doc.id.slice(-6).toUpperCase()}`,
        location: data.warehouseLocation || data.location || "Unknown",
      };

      console.log("- Processed item.id:", processedItem.id);
      console.log("- Processed item.productId:", processedItem.productId);
      console.log("================================");

      return processedItem;
    });

    console.log("All processed inventory items:");
    allInventory.value.forEach((item) => {
      console.log(
        `${item.productName}: id=${item.id}, productId=${item.productId}`
      );
    });

    filterInventory();
  });
};

// Stock Movements
const stockMovements = ref([]);
const filteredStockMovements = ref([]);
const historyFilter = ref("all");
const currentMovementPage = ref(1);
const movementsPerPage = ref(20);

// Fetch stock movements from Firebase
const fetchStockMovements = () => {
  const q = query(
    collection($firebase.firestore, "stock_movements"),
    orderBy("createdAt", "desc"),
    limit(100) // Limit untuk performa
  );

  onSnapshot(q, (snapshot) => {
    stockMovements.value = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.createdAt?.toDate?.() || new Date(),
        productId: data.productId,
        productName: data.productName,
        type: data.type || "adjustment",
        adjustmentType: data.adjustmentType,
        quantity: data.quantity,
        stockBefore: data.previousStock,
        stockAfter: data.newStock,
        reference:
          data.reference || `${data.type?.toUpperCase()}-${doc.id.slice(-6)}`,
        user: data.createdBy || "Admin",
        notes: data.notes || data.reason || "",
        reason: data.reason,
      };
    });
    filterStockMovements();
  });
};

// Filter stock movements
const filterStockMovements = () => {
  let filtered = stockMovements.value;

  if (historyFilter.value !== "all") {
    filtered = filtered.filter(
      (movement) =>
        movement.type === historyFilter.value ||
        movement.adjustmentType === historyFilter.value ||
        movement.reason === historyFilter.value
    );
  }

  filteredStockMovements.value = filtered;
  currentMovementPage.value = 1;
};

// Computed for paginated stock movements
const paginatedStockMovements = computed(() => {
  const start = (currentMovementPage.value - 1) * movementsPerPage.value;
  const end = start + movementsPerPage.value;
  return filteredStockMovements.value.slice(start, end);
});

const totalMovementPages = computed(() => {
  return Math.ceil(
    filteredStockMovements.value.length / movementsPerPage.value
  );
});

// Refresh stock movements
const refreshStockMovements = () => {
  fetchStockMovements();
};

// Fungsi helper untuk menentukan status berdasarkan stock dan minLevel
const determineStockStatus = (currentStock, minLevel) => {
  if (currentStock === 0) {
    return "out";
  } else if (currentStock <= minLevel) {
    return "low";
  } else {
    return "normal";
  }
};

const adjustmentSearchInput = ref("");
const showAdjustmentDropdown = ref(false);
const filteredAdjustmentProducts = computed(() => {
  const keyword = adjustmentSearchInput.value.toLowerCase();
  return allInventory.value.filter((item) =>
    item.productName.toLowerCase().includes(keyword)
  );
});

const selectAdjustmentProduct = (item) => {
  adjustmentForm.value.productId = item.id;
  adjustmentForm.value.minLevel = item.minLevel || 0;
  adjustmentSearchInput.value = `${item.productName}`;
  showAdjustmentDropdown.value = false;
};

const hideAdjustmentDropdown = () => {
  setTimeout(() => {
    showAdjustmentDropdown.value = false;
  }, 150);
};

const searchQuery = ref("");
const selectedStatus = ref("all");
const selectedCategory = ref("all");
const selectedLocation = ref("all");
const filteredInventory = ref([]);
const selectedItems = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const activeTab = ref("stock");
const showAdjustmentModal = ref(false);

const tabs = [
  { id: "stock", name: "Stock Management" },
  { id: "history", name: "Movement History" },
  { id: "alerts", name: "Low Stock Alerts" },
  { id: "analytics", name: "Analytics" },
];

const adjustmentForm = ref({
  productId: "",
  type: "",
  quantity: 0,
  minLevel: 0,
  reason: "",
  notes: "",
});

const alerts = ref([]);
const topMovingItems = ref([]);
const deadStockItems = ref([]);

const totalItems = computed(() => allInventory.value.length);
const lowStockCount = computed(
  () => allInventory.value.filter((item) => item.status === "low").length
);
const outOfStockCount = computed(
  () => allInventory.value.filter((item) => item.status === "out").length
);
const totalInventoryValue = computed(() =>
  allInventory.value.reduce(
    (total, item) => total + item.currentStock * item.unitCost,
    0
  )
);
const lowStockItems = computed(() =>
  allInventory.value.filter(
    (item) => item.status === "low" || item.status === "out"
  )
);
const selectAll = computed(() => {
  return (
    paginatedInventory.value.length > 0 &&
    paginatedInventory.value.every((item) =>
      selectedItems.value.includes(item.id)
    )
  );
});
const totalPages = computed(() => {
  return Math.ceil(
    filteredInventory.value.length / parseInt(itemsPerPage.value)
  );
});
const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value);
  const end = start + parseInt(itemsPerPage.value);
  return filteredInventory.value.slice(start, end);
});

const filterInventory = () => {
  let filtered = allInventory.value;

  if (searchQuery.value) {
    filtered = filtered.filter(
      (item) =>
        item.productName
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter((item) => item.status === selectedStatus.value);
  }
  if (selectedCategory.value !== "all") {
    filtered = filtered.filter(
      (item) => item.category === selectedCategory.value
    );
  }
  if (selectedLocation.value !== "all") {
    filtered = filtered.filter(
      (item) => item.location === selectedLocation.value
    );
  }
  filteredInventory.value = filtered;
  currentPage.value = 1;
  selectedItems.value = [];
};

const getStockBadgeVariant = (currentStock, minLevel) => {
  if (currentStock === 0) return "destructive";
  if (currentStock <= minLevel) return "secondary";
  return "default";
};
const getStatusVariant = (status) => {
  switch (status) {
    case "normal":
      return "default";
    case "low":
      return "secondary";
    case "out":
      return "destructive";
    case "overstocked":
      return "outline";
    default:
      return "outline";
  }
};
const getMovementTypeVariant = (type) => {
  switch (type.toLowerCase()) {
    case "purchase":
      return "default";
    case "sale":
      return "secondary";
    case "return":
      return "outline";
    case "adjustment":
      return "destructive";
    default:
      return "outline";
  }
};
const toggleSelectAll = (checked) => {
  if (checked) {
    selectedItems.value = [...paginatedInventory.value.map((item) => item.id)];
  } else {
    selectedItems.value = [];
  }
};
const toggleItemSelection = (itemId) => {
  const index = selectedItems.value.indexOf(itemId);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(itemId);
  }
};
const changePage = (page) => {
  currentPage.value = page;
  selectedItems.value = [];
};
const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};
const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
const openStockAdjustment = () => {
  showAdjustmentModal.value = true;
};
const closeAdjustmentModal = () => {
  showAdjustmentModal.value = false;
  adjustmentForm.value = {
    productId: "",
    type: "",
    quantity: 0,
    minLevel: 0,
    reason: "",
    notes: "",
  };
  adjustmentSearchInput.value = "";
};

const submitAdjustment = async () => {
  try {
    const { productId, type, quantity, minLevel, reason, notes } =
      adjustmentForm.value;

    console.log("=== SUBMIT ADJUSTMENT DEBUG ===");
    console.log("Form productId:", productId);
    console.log("typeof productId:", typeof productId);
    console.log("productId length:", productId?.length);

    // Validate form data
    if (!productId || !type || !quantity) {
      alert("Please fill in all required fields!");
      return;
    }

    // Validate minLevel
    if (minLevel < 0) {
      alert("Min Level cannot be negative!");
      return;
    }

    // Find the current product from local data
    const currentProduct = allInventory.value.find(
      (item) => item.id === productId
    );
    if (!currentProduct) {
      console.error("Product not found with id:", productId);
      alert("Product not found in local data!");
      return;
    }

    console.log("Current product found:", currentProduct);
    console.log("Using Firestore document ID:", productId);

    // Verifikasi document exists di Firestore sebelum update
    console.log("=== VERIFYING DOCUMENT EXISTS ===");
    const productRef = doc($firebase.firestore, "products", productId);

    try {
      const docSnap = await getDoc(productRef);
      if (!docSnap.exists()) {
        console.error("Document does not exist in Firestore!");

        // Coba cari dengan field "id" sebagai gantinya
        console.log("=== SEARCHING BY FIELD ID ===");
        const q = query(
          collection($firebase.firestore, "products"),
          where("id", "==", currentProduct.productId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const actualDoc = querySnapshot.docs[0];
          console.log("Found document by field id:", actualDoc.id);

          // Update dengan document ID yang benar
          const correctProductRef = doc(
            $firebase.firestore,
            "products",
            actualDoc.id
          );

          // Calculate new stock
          let newStock = currentProduct.currentStock;
          let actualQuantity = 0;

          if (type === "increase") {
            newStock += parseInt(quantity);
            actualQuantity = parseInt(quantity);
          } else if (type === "decrease") {
            newStock = Math.max(0, newStock - parseInt(quantity));
            actualQuantity = -parseInt(quantity);
          } else if (type === "set") {
            actualQuantity = parseInt(quantity) - currentProduct.currentStock;
            newStock = parseInt(quantity);
          }

          // Determine new status berdasarkan newStock dan minLevel yang baru
          const newStatus = determineStockStatus(newStock, parseInt(minLevel));

          // Update product dengan stock, minLevel, dan status baru
          await updateDoc(correctProductRef, {
            stock: newStock,
            minLevel: parseInt(minLevel),
            statusInventory: newStatus,
            updatedAt: serverTimestamp(),
          });

          // Create stock movement record
          await addDoc(collection($firebase.firestore, "stock_movements"), {
            productId: actualDoc.id,
            productName: currentProduct.productName,
            type: "adjustment",
            adjustmentType: type,
            quantity: actualQuantity,
            previousStock: currentProduct.currentStock,
            newStock: newStock,
            minLevel: parseInt(minLevel),
            reason: reason,
            notes: notes,
            reference: `ADJ-${Date.now().toString().slice(-6)}`,
            createdAt: serverTimestamp(),
            createdBy: "admin",
          });

          console.log(
            "Stock adjustment completed successfully with correct document ID"
          );
          alert(
            `Stock ${type}d successfully! New stock: ${newStock}, Status: ${newStatus}`
          );
          closeAdjustmentModal();
          return;
        } else {
          console.error("Document not found by field id either!");
          alert("Document not found in Firestore!");
          return;
        }
      }

      console.log("Document exists, proceeding with update...");
    } catch (docError) {
      console.error("Error checking document existence:", docError);
      alert("Error verifying document existence!");
      return;
    }

    // Calculate new stock based on adjustment type
    let newStock = currentProduct.currentStock;
    let actualQuantity = 0;

    if (type === "increase") {
      newStock += parseInt(quantity);
      actualQuantity = parseInt(quantity);
    } else if (type === "decrease") {
      newStock = Math.max(0, newStock - parseInt(quantity));
      actualQuantity = -parseInt(quantity);
    } else if (type === "set") {
      actualQuantity = parseInt(quantity) - currentProduct.currentStock;
      newStock = parseInt(quantity);
    }

    // Determine new status berdasarkan newStock dan minLevel yang baru
    const newStatus = determineStockStatus(newStock, parseInt(minLevel));

    console.log("About to update document with ID:", productId);
    console.log("Stock calculation:", {
      current: currentProduct.currentStock,
      adjustment: quantity,
      type: type,
      newStock: newStock,
      newMinLevel: minLevel,
      newStatus: newStatus,
    });

    // Update product stock, minLevel, dan status di Firestore
    await updateDoc(productRef, {
      stock: newStock,
      minLevel: parseInt(minLevel),
      statusInventory: newStatus,
      updatedAt: serverTimestamp(),
    });

    // Create stock movement record for history
    await addDoc(collection($firebase.firestore, "stock_movements"), {
      productId: productId,
      productName: currentProduct.productName,
      type: "adjustment",
      adjustmentType: type,
      quantity: actualQuantity,
      previousStock: currentProduct.currentStock,
      newStock: newStock,
      minLevel: parseInt(minLevel),
      reason: reason,
      notes: notes,
      reference: `ADJ-${Date.now().toString().slice(-6)}`,
      createdAt: serverTimestamp(),
      createdBy: "admin",
    });

    console.log("Stock adjustment completed successfully");
    alert(
      `Stock ${type}d successfully! New stock: ${newStock}, Status: ${newStatus}`
    );
    closeAdjustmentModal();
  } catch (error) {
    console.error("Error updating stock:", error);
    alert(`Error updating stock: ${error.message}`);
  }
};

// Modifikasi adjustStock untuk mengisi minLevel saat edit
const adjustStock = (itemId) => {
  const product = allInventory.value.find((item) => item.id === itemId);
  if (product) {
    adjustmentForm.value.productId = itemId;
    adjustmentForm.value.minLevel = product.minLevel || 0; // Isi minLevel dari data produk
    adjustmentSearchInput.value = product.productName;
    showAdjustmentModal.value = true;
  }
};
const viewHistory = (itemId) => {
  // Filter history by product and switch to history tab
  historyFilter.value = "all";
  activeTab.value = "history";

  // You can add additional filtering by product here
  setTimeout(() => {
    filterStockMovements();
  }, 100);
};
const reorderProduct = (itemId) => {
  console.log("Reorder product:", itemId);
};

const exportInventory = () => {
  console.log("Export inventory data");
};

onMounted(() => {
  fetchInventory();
  fetchCategories();
  fetchStockMovements();
});
</script>

<style></style>
