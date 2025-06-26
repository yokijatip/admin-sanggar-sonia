<template>
  <div class="container mx-auto">
    <!-- Title and Button -->
    <div class="flex items-center justify-between px-4">
      <HeadersContent title="Products" description="Manage your products" />
      <Button @click="navigateToAddProduct" class="bg-primary">
        <Plus class="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>

    <!-- Search and Filter -->
    <div class="flex items-center gap-4 mb-6 ml-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Search products..."
          class="pl-8"
          @input="filterProducts"
        />
      </div>

      <Select v-model="selectedCategory" @update:modelValue="filterProducts">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="electronics">Electronics</SelectItem>
          <SelectItem value="clothing">Clothing</SelectItem>
          <SelectItem value="books">Books</SelectItem>
          <SelectItem value="home">Home & Garden</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedStatus" @update:modelValue="filterProducts">
        <SelectTrigger class="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Data Table -->
    <div class="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">
              <Checkbox
                :checked="selectAll"
                @update:checked="toggleSelectAll"
              />
            </TableHead>
            <TableHead class="w-20">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead class="w-64">Description</TableHead>
            <TableHead class="text-left">Price</TableHead>
            <TableHead class="text-left">Stock</TableHead>
            <TableHead class="text-left">Status</TableHead>
            <TableHead class="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="product in paginatedProducts"
            :key="product.id"
            class="hover:bg-muted/50"
          >
            <!-- Checkbox -->
            <TableCell>
              <Checkbox
                :checked="selectedProducts.includes(product.id)"
                @update:checked="toggleProductSelection(product.id)"
              />
            </TableCell>
            <!-- Product ID -->
            <TableCell class="font-mono text-sm">
              {{ product.id }}
            </TableCell>
            <!-- Product Title -->
            <TableCell class="font-medium">
              {{ product.title }}
            </TableCell>
            <!-- Product Category -->
            <TableCell>
              <Badge variant="outline" class="capitalize">
                {{ product.category }}
              </Badge>
            </TableCell>
            <!-- Product Description -->
            <TableCell class="max-w-64">
              <p class="truncate text-sm text-muted-foreground">
                {{ product.description }}
              </p>
            </TableCell>
            <!-- Product Price -->
            <TableCell class="text-left font-medium">
              ${{ product.price.toLocaleString() }}
            </TableCell>
            <!-- Product Stock -->
            <TableCell class="text-left">
              <Badge
                :variant="
                  product.stock > 10
                    ? 'default'
                    : product.stock > 0
                    ? 'secondary'
                    : 'destructive'
                "
              >
                {{ product.stock }}
              </Badge>
            </TableCell>
            <!-- Product Status -->
            <TableCell class="text-left">
              <Badge
                :variant="getStatusVariant(product.status)"
                class="capitalize"
              >
                {{ product.status.replace("_", " ") }}
              </Badge>
            </TableCell>
            <!-- Actions -->
            <TableCell class="text-right">
              <div class="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="viewProduct(product.id)"
                >
                  <Eye class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="editProduct(product.id)"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="deleteProduct(product.id)"
                >
                  <Trash2 class="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between space-x-2 p-4">
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
            @click="changePage(1)"
            :disabled="currentPage === 1"
          >
            <ChevronsLeft class="h-4 w-4" />
          </Button>
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
          <Button
            variant="outline"
            class="h-8 w-8 p-0"
            @click="changePage(totalPages)"
            :disabled="currentPage === totalPages"
          >
            <ChevronsRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div
      v-if="selectedProducts.length > 0"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2"
    >
      <div
        class="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-4"
      >
        <span class="text-sm font-medium"
          >{{ selectedProducts.length }} selected</span
        >
        <div class="flex gap-2">
          <Button variant="secondary" size="sm" @click="bulkDelete">
            <Trash2 class="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button variant="secondary" size="sm" @click="bulkStatusUpdate">
            <Settings class="h-4 w-4 mr-1" />
            Update Status
          </Button>
          <Button variant="secondary" size="sm" @click="clearSelection">
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, computed, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next";

// Sample data - replace with Firebase data later
const allProducts = ref([
  {
    id: "PRD-001",
    title: "iPhone 15 Pro Max",
    category: "electronics",
    description:
      "Latest iPhone with titanium design and advanced camera system",
    price: 1199,
    stock: 25,
    status: "active",
  },
  {
    id: "PRD-002",
    title: "Nike Air Max 270",
    category: "clothing",
    description: "Comfortable running shoes with air cushioning technology",
    price: 150,
    stock: 5,
    status: "active",
  },
  {
    id: "PRD-003",
    title: "MacBook Pro M3",
    category: "electronics",
    description: "Powerful laptop for professional work with M3 chip",
    price: 2399,
    stock: 0,
    status: "out_of_stock",
  },
  {
    id: "PRD-004",
    title: "The Psychology of Money",
    category: "books",
    description:
      "Timeless lessons on wealth, greed, and happiness by Morgan Housel",
    price: 15,
    stock: 100,
    status: "active",
  },
  {
    id: "PRD-005",
    title: "Smart Garden Kit",
    category: "home",
    description:
      "Automated indoor garden system for growing herbs and vegetables",
    price: 299,
    stock: 12,
    status: "inactive",
  },
  {
    id: "PRD-006",
    title: "Wireless Headphones",
    category: "electronics",
    description:
      "Premium noise-cancelling wireless headphones with 30h battery",
    price: 249,
    stock: 45,
    status: "active",
  },
  {
    id: "PRD-007",
    title: "Designer T-Shirt",
    category: "clothing",
    description: "Premium cotton t-shirt with minimalist design",
    price: 89,
    stock: 8,
    status: "active",
  },
  {
    id: "PRD-008",
    title: "Coffee Maker Pro",
    category: "home",
    description: "Professional espresso machine with built-in grinder",
    price: 599,
    stock: 3,
    status: "active",
  },
]);

// Reactive data
const searchQuery = ref("");
const selectedCategory = ref("all");
const selectedStatus = ref("all");
const filteredProducts = ref([...allProducts.value]);
const selectedProducts = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Computed properties
const selectAll = computed(() => {
  return (
    paginatedProducts.value.length > 0 &&
    paginatedProducts.value.every((product) =>
      selectedProducts.value.includes(product.id)
    )
  );
});

const totalPages = computed(() => {
  return Math.ceil(
    filteredProducts.value.length / parseInt(itemsPerPage.value)
  );
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value);
  const end = start + parseInt(itemsPerPage.value);
  return filteredProducts.value.slice(start, end);
});

// Methods
const filterProducts = () => {
  let filtered = allProducts.value;

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Filter by category
  if (selectedCategory.value && selectedCategory.value !== "all") {
    filtered = filtered.filter(
      (product) => product.category === selectedCategory.value
    );
  }

  // Filter by status
  if (selectedStatus.value && selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (product) => product.status === selectedStatus.value
    );
  }

  filteredProducts.value = filtered;
  currentPage.value = 1;
  selectedProducts.value = [];
};

const getStatusVariant = (status) => {
  switch (status) {
    case "active":
      return "default";
    case "inactive":
      return "secondary";
    case "out_of_stock":
      return "destructive";
    default:
      return "outline";
  }
};

const toggleSelectAll = (checked) => {
  if (checked) {
    selectedProducts.value = [...paginatedProducts.value.map((p) => p.id)];
  } else {
    selectedProducts.value = [];
  }
};

const toggleProductSelection = (productId) => {
  const index = selectedProducts.value.indexOf(productId);
  if (index > -1) {
    selectedProducts.value.splice(index, 1);
  } else {
    selectedProducts.value.push(productId);
  }
};

const changePage = (page) => {
  currentPage.value = page;
  selectedProducts.value = [];
};

const clearSelection = () => {
  selectedProducts.value = [];
};

// Navigation methods (to be implemented with your router)
const navigateToAddProduct = () => {
  // navigateTo('/admin/products/add')
  console.log("Navigate to add product");
};

const viewProduct = (id) => {
  // navigateTo(`/admin/products/${id}`)
  console.log("View product:", id);
};

const editProduct = (id) => {
  // navigateTo(`/admin/products/${id}/edit`)
  console.log("Edit product:", id);
};

const deleteProduct = (id) => {
  // Show confirmation dialog and delete
  console.log("Delete product:", id);
};

const bulkDelete = () => {
  // Show confirmation dialog and delete selected products
  console.log("Bulk delete:", selectedProducts.value);
};

const bulkStatusUpdate = () => {
  // Show status update dialog
  console.log("Bulk status update:", selectedProducts.value);
};

// Initialize
onMounted(() => {
  filterProducts();
});
</script>

<style></style>
