<template>
  <div class="container mx-auto min-w-full">
    <!-- Title and Button -->
    <div class="flex items-center justify-between px-4">
      <HeadersContent title="Ruangan Sanggar" description="Kelola ruangan sanggar Anda" />
      <Button @click="navigateToAddProduct" class="bg-primary cursor-pointer">
        <Plus class="mr-2 h-4 w-4" />
        Tambah Ruangan
      </Button>
    </div>

    <!-- Search and Filter -->
    <div class="flex items-center gap-4 mb-4 px-4">
      <div class="relative flex-1 w-full">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Cari ruangan..."
          class="pl-8"
          @input="filterProducts"
        />
      </div>

      <Select v-model="selectedCategory">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          <SelectItem
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedAvailability" @update:modelValue="filterProducts">
        <SelectTrigger class="w-44">
          <SelectValue placeholder="Ketersediaan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua</SelectItem>
          <SelectItem value="tersedia">Tersedia</SelectItem>
          <SelectItem value="dibooking">Dibooking</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="selectedStatus" @update:modelValue="filterProducts">
        <SelectTrigger class="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="inactive">Tidak Aktif</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Data Table -->
    <div v-else class="border">
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
            <TableHead>Nama Ruangan</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead class="w-64">Deskripsi</TableHead>
            <TableHead class="text-left">Harga</TableHead>
            <TableHead class="text-left">Ketersediaan</TableHead>
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
              Rp {{ Number(product.price).toLocaleString() }}
            </TableCell>
            <!-- Room Availability (previously Stock) -->
            <TableCell class="text-left">
              <Badge :variant="getAvailabilityVariant(getRoomAvailability(product))">
                {{ getAvailabilityText(getRoomAvailability(product)) }}
              </Badge>
            </TableCell>
            <!-- Room Status -->
            <TableCell class="text-left">
              <Badge
                :variant="getStatusVariant(getRoomStatus(product))"
                class="capitalize"
              >
                {{ getRoomStatus(product) === 'active' ? 'Aktif' : 'Tidak Aktif' }}
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
                  @click="openEditModal(product.id)"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="confirmDeleteProduct(product.id, product.title)"
                  :disabled="deletingProducts.includes(product.id)"
                >
                  <Loader2
                    v-if="deletingProducts.includes(product.id)"
                    class="h-4 w-4 animate-spin"
                  />
                  <Trash2 v-else class="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <!-- Empty State -->
      <div
        v-if="!loading && filteredProducts.length === 0"
        class="text-center py-8"
      >
        <p class="text-muted-foreground">Tidak ada ruangan ditemukan</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between space-x-2 p-4">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Baris per halaman</p>
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
          Halaman {{ currentPage }} dari {{ totalPages }}
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

    <!-- View Product Modal -->
    <Dialog v-model:open="viewModalOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Ruangan</DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang ruangan ini
          </DialogDescription>
        </DialogHeader>
        <div v-if="currentProduct" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="text-sm font-medium">Nama Ruangan</Label>
              <p class="text-sm text-muted-foreground">
                {{ currentProduct.title }}
              </p>
            </div>
            <div>
              <Label class="text-sm font-medium">Kategori</Label>
              <p class="text-sm text-muted-foreground">
                {{ getCategoryName(currentProduct.category) }}
              </p>
            </div>
            <div>
              <Label class="text-sm font-medium">Harga per Jam</Label>
              <p class="text-sm text-muted-foreground">
                Rp {{ currentProduct.price?.toLocaleString() }}
              </p>
            </div>
            <div>
              <Label class="text-sm font-medium">Ketersediaan</Label>
              <Badge :variant="getAvailabilityVariant(getRoomAvailability(currentProduct))">
                {{ getAvailabilityText(getRoomAvailability(currentProduct)) }}
              </Badge>
            </div>
            <div>
              <Label class="text-sm font-medium">Status</Label>
              <Badge :variant="getStatusVariant(getRoomStatus(currentProduct))">
                {{ getRoomStatus(currentProduct) === 'active' ? 'Aktif' : 'Tidak Aktif' }}
              </Badge>
            </div>
          </div>
          <div>
            <Label class="text-sm font-medium">Deskripsi</Label>
            <p class="text-sm text-muted-foreground mt-1">
              {{ currentProduct.description || "Tidak ada deskripsi" }}
            </p>
          </div>
          <div v-if="currentProduct.image">
            <Label class="text-sm font-medium">Foto Ruangan</Label>
            <img
              :src="currentProduct.image"
              :alt="currentProduct.title"
              class="w-full h-48 object-cover rounded mt-2"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Edit Product Modal -->
    <Dialog v-model:open="editModalOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Ruangan</DialogTitle>
          <DialogDescription>
            Ubah informasi ruangan
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="edit-title">Nama Ruangan</Label>
              <Input
                id="edit-title"
                v-model="editProduct.title"
                placeholder="Masukkan nama ruangan"
              />
            </div>
            <div>
              <Label for="edit-category">Kategori</Label>
              <Select v-model="editProduct.category">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="edit-price">Harga per Jam</Label>
              <Input
                id="edit-price"
                v-model="editProduct.price"
                type="number"
                step="1000"
                placeholder="0"
              />
            </div>
            <div>
              <Label for="edit-availability">Ketersediaan</Label>
              <Select v-model="editProduct.availability">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih ketersediaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tersedia">Tersedia</SelectItem>
                  <SelectItem value="dibooking">Dibooking</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="edit-status">Status</Label>
              <Select v-model="editProduct.status">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label for="edit-description">Deskripsi</Label>
            <Textarea
              id="edit-description"
              v-model="editProduct.description"
              placeholder="Masukkan deskripsi ruangan"
              rows="3"
            />
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="editModalOpen = false">
              Batal
            </Button>
            <Button @click="saveEditedProduct" :disabled="editLoading">
              <Loader2 v-if="editLoading" class="w-4 h-4 animate-spin mr-2" />
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Bulk Actions -->
    <div
      v-if="selectedProducts.length > 0"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2"
    >
      <div
        class="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-4"
      >
        <span class="text-sm font-medium"
          >{{ selectedProducts.length }} dipilih</span
        >
        <div class="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            @click="confirmBulkDelete"
            :disabled="bulkDeleting"
          >
            <Loader2 v-if="bulkDeleting" class="h-4 w-4 mr-1 animate-spin" />
            <Trash2 v-else class="h-4 w-4 mr-1" />
            Hapus
          </Button>
          <Button variant="secondary" size="sm" @click="bulkAvailabilityUpdate">
            <Settings class="h-4 w-4 mr-1" />
            Update Ketersediaan
          </Button>
          <Button variant="secondary" size="sm" @click="clearSelection">
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus ruangan
            <span class="font-medium">{{ productToDelete?.title }}</span>
            secara permanen dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="cancelDelete">Batal</AlertDialogCancel>
          <AlertDialogAction
            @click="deleteProduct"
            class="bg-destructive hover:bg-destructive/90"
            :disabled="deletingProducts.length > 0"
          >
            <Loader2
              v-if="deletingProducts.length > 0"
              class="h-4 w-4 mr-2 animate-spin"
            />
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Bulk Delete Confirmation Dialog -->
    <AlertDialog v-model:open="bulkDeleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Beberapa Ruangan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus
            {{ selectedProducts.length }} ruangan yang dipilih? Tindakan ini tidak dapat
            dibatalkan dan akan menghapus ruangan tersebut secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="cancelBulkDelete">Batal</AlertDialogCancel>
          <AlertDialogAction
            @click="bulkDelete"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            :disabled="bulkDeleting"
          >
            <Loader2 v-if="bulkDeleting" class="h-4 w-4 mr-2 animate-spin" />
            Hapus Semua
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import HeadersContent from "@/components/ui/HeadersContent.vue";
import { ref, computed, onMounted, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Loader2,
} from "lucide-vue-next";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
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

// Reactive data
const allProducts = ref([]);
const searchQuery = ref("");
const selectedCategory = ref("all");
const selectedAvailability = ref("all"); // Changed from selectedStatus
const selectedStatus = ref("all");
const filteredProducts = ref([]);
const selectedProducts = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const loading = ref(true);

// Delete states
const deleteDialogOpen = ref(false);
const productToDelete = ref(null);
const deletingProducts = ref([]);
const bulkDeleteDialogOpen = ref(false);
const bulkDeleting = ref(false);

// Modal states
const viewModalOpen = ref(false);
const editModalOpen = ref(false);
const currentProduct = ref(null);
const editProduct = ref({
  id: "",
  title: "",
  description: "",
  price: 0,
  availability: "tersedia", // Changed from stock
  category: "",
  status: "active",
});
const editLoading = ref(false);

// Watch for category changes
watch(selectedCategory, () => {
  filterProducts();
});

// Watch for availability changes
watch(selectedAvailability, () => {
  filterProducts();
});

// Watch for status changes
watch(selectedStatus, () => {
  filterProducts();
});

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

// Fetch products from Firestore
const fetchProducts = async () => {
  try {
    loading.value = true;
    const productsRef = collection($firebase.firestore, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        firestoreId: doc.id, // ID dokumen Firestore yang sebenarnya
        id: doc.data().id, // ID dari field data
        ...doc.data(),
      });
    });

    allProducts.value = products;
    filterProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
};

// Get room availability (replaces getProductStatus for stock)
const getRoomAvailability = (product) => {
  // Map old stock-based logic to new availability
  if (product.availability) {
    return product.availability;
  }
  
  // Fallback logic for existing data
  if (product.stock === 0) {
    return "tidak_aktif";
  }
  return "tersedia";
};

// Get room status 
const getRoomStatus = (product) => {
  return product.statusProduct || product.status || "active";
};

// Get availability variant for badge styling
const getAvailabilityVariant = (availability) => {
  switch (availability) {
    case "tersedia":
      return "default"; // Green
    case "dibooking":
      return "secondary"; // Blue/Gray
    case "maintenance":
      return "destructive"; // Red
    case "tidak_aktif":
      return "outline"; // Gray outline
    default:
      return "outline";
  }
};

// Get availability text
const getAvailabilityText = (availability) => {
  switch (availability) {
    case "tersedia":
      return "Tersedia";
    case "dibooking":
      return "Dibooking";
    case "maintenance":
      return "Maintenance";
    case "tidak_aktif":
      return "Tidak Aktif";
    default:
      return "Tidak Diketahui";
  }
};

// Filter products
const filterProducts = () => {
  let filtered = allProducts.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.id?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
    );
  }

  // Filter by category
  if (selectedCategory.value !== "all") {
    filtered = filtered.filter(
      (item) => item.category === selectedCategory.value
    );
  }

  // Filter by availability
  if (selectedAvailability.value && selectedAvailability.value !== "all") {
    filtered = filtered.filter(
      (product) => getRoomAvailability(product) === selectedAvailability.value
    );
  }

  // Filter by status
  if (selectedStatus.value && selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (product) => getRoomStatus(product) === selectedStatus.value
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

// Delete functions
const confirmDeleteProduct = (id, title) => {
  const product = allProducts.value.find((p) => p.id === id);
  productToDelete.value = { id, title: product?.title };
  deleteDialogOpen.value = true;
};

const cancelDelete = () => {
  deleteDialogOpen.value = false;
  productToDelete.value = null;
};

const deleteProduct = async () => {
  if (!productToDelete.value) return;

  try {
    deletingProducts.value.push(productToDelete.value.id);

    // Cari product untuk mendapatkan firestoreId
    const product = allProducts.value.find(
      (p) => p.id === productToDelete.value.id
    );
    if (!product) {
      throw new Error("Product not found");
    }

    // Delete from Firestore
    await deleteDoc(doc($firebase.firestore, "products", product.firestoreId));

    // Remove from local state
    allProducts.value = allProducts.value.filter(
      (p) => p.id !== productToDelete.value.id
    );
    filterProducts();

    console.log(`Room "${productToDelete.value.title}" deleted successfully`);

    deleteDialogOpen.value = false;
    productToDelete.value = null;
  } catch (error) {
    console.error("Error deleting product:", error);
  } finally {
    deletingProducts.value = deletingProducts.value.filter(
      (id) => id !== productToDelete.value?.id
    );
  }
};

const confirmBulkDelete = () => {
  if (selectedProducts.value.length === 0) return;
  bulkDeleteDialogOpen.value = true;
};

const cancelBulkDelete = () => {
  bulkDeleteDialogOpen.value = false;
};

const bulkDelete = async () => {
  if (selectedProducts.value.length === 0) return;

  try {
    bulkDeleting.value = true;

    // Delete all selected products from Firestore
    const deletePromises = selectedProducts.value.map(async (productId) => {
      const product = allProducts.value.find((p) => p.id === productId);
      if (product) {
        return await deleteDoc(doc($firebase.firestore, "products", product.firestoreId));
      }
    });

    await Promise.all(deletePromises);

    // Remove from local state
    allProducts.value = allProducts.value.filter(
      (p) => !selectedProducts.value.includes(p.id)
    );
    filterProducts();

    console.log(`${selectedProducts.value.length} rooms deleted successfully`);

    selectedProducts.value = [];
    bulkDeleteDialogOpen.value = false;
  } catch (error) {
    console.error("Error bulk deleting products:", error);
  } finally {
    bulkDeleting.value = false;
  }
};

// Navigation methods
const navigateToAddProduct = () => {
  navigateTo("/products/addProduct");
};

// View product modal
const viewProduct = (id) => {
  const product = allProducts.value.find((p) => p.id === id);
  if (product) {
    currentProduct.value = product;
    viewModalOpen.value = true;
  }
};

// Edit product modal
const openEditModal = (id) => {
  const product = allProducts.value.find((p) => p.id === id);
  if (product) {
    editProduct.value = {
      firestoreId: product.firestoreId, // ID dokumen Firestore
      id: product.id, // ID dari field data
      title: product.title || "",
      description: product.description || "",
      price: product.price || 0,
      availability: getRoomAvailability(product), // Use availability instead of stock
      category: product.category || "",
      status: getRoomStatus(product),
    };
    editModalOpen.value = true;
  }
};

// Save edited product
const saveEditedProduct = async () => {
  try {
    editLoading.value = true;

    console.log("Saving room:", editProduct.value); // debug

    const productDoc = doc(
      $firebase.firestore,
      "products",
      editProduct.value.firestoreId
    );
    await updateDoc(productDoc, {
      title: editProduct.value.title,
      description: editProduct.value.description,
      price: parseFloat(editProduct.value.price),
      availability: editProduct.value.availability, // Save availability instead of stock
      category: editProduct.value.category,
      statusProduct: editProduct.value.status,
      updatedAt: new Date(),
    });

    // Update local state
    const productIndex = allProducts.value.findIndex(
      (p) => p.id === editProduct.value.id
    );
    if (productIndex !== -1) {
      allProducts.value[productIndex] = {
        ...allProducts.value[productIndex],
        title: editProduct.value.title,
        description: editProduct.value.description,
        price: parseFloat(editProduct.value.price),
        availability: editProduct.value.availability,
        category: editProduct.value.category,
        statusProduct: editProduct.value.status,
        updatedAt: new Date(),
      };
    }

    filterProducts();
    editModalOpen.value = false;
    
    console.log("Room updated successfully");
  } catch (error) {
    console.error("Error updating room:", error);
  } finally {
    editLoading.value = false;
  }
};

const bulkAvailabilityUpdate = () => {
  console.log("Bulk availability update:", selectedProducts.value);
  // TODO: Implement bulk availability update functionality
  // This could open a modal to select new availability status for all selected rooms
};

// Helper function to get category name
const getCategoryName = (categoryId) => {
  const category = categories.value.find((cat) => cat.id === categoryId);
  return category ? category.name : categoryId;
};

// Initialize
onMounted(() => {
  fetchProducts();
  fetchCategories();
});
</script>

<style></style> 