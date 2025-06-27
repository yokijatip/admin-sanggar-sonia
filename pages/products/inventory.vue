<template>
  <div class="container mx-auto px-4 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
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
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Items</CardTitle>
          <Package class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ totalItems }}</div>
          <p class="text-xs text-muted-foreground">Active products</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Low Stock Items</CardTitle>
          <AlertTriangle class="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-orange-600">{{ lowStockCount }}</div>
          <p class="text-xs text-muted-foreground">Need reorder</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Out of Stock</CardTitle>
          <XCircle class="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-600">{{ outOfStockCount }}</div>
          <p class="text-xs text-muted-foreground">Items unavailable</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Value</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">${{ totalInventoryValue.toLocaleString() }}</div>
          <p class="text-xs text-muted-foreground">Current inventory value</p>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Alerts -->
    <div v-if="alerts.length > 0" class="space-y-2">
      <Alert v-for="alert in alerts" :key="alert.id" :variant="alert.type">
        <AlertTriangle class="h-4 w-4" />
        <AlertTitle>{{ alert.title }}</AlertTitle>
        <AlertDescription>{{ alert.description }}</AlertDescription>
      </Alert>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-wrap items-center gap-4">
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
          <SelectItem value="electronics">Electronics</SelectItem>
          <SelectItem value="clothing">Clothing</SelectItem>
          <SelectItem value="books">Books</SelectItem>
          <SelectItem value="home">Home & Garden</SelectItem>
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
    <div class="border-b">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Stock Management Table -->
    <div v-if="activeTab === 'stock'" class="rounded-md border">
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
            <TableHead class="text-center">Reserved</TableHead>
            <TableHead class="text-center">Available</TableHead>
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
                <span class="text-sm text-muted-foreground">{{ item.category }}</span>
              </div>
            </TableCell>
            <TableCell class="font-mono text-sm">{{ item.sku }}</TableCell>
            <TableCell class="text-center">
              <Badge :variant="getStockBadgeVariant(item.currentStock, item.minLevel)">
                {{ item.currentStock }}
              </Badge>
            </TableCell>
            <TableCell class="text-center">{{ item.reservedStock }}</TableCell>
            <TableCell class="text-center font-medium">{{ item.availableStock }}</TableCell>
            <TableCell class="text-center">{{ item.minLevel }}</TableCell>
            <TableCell class="text-center">
              <Badge :variant="getStatusVariant(item.status)">
                {{ item.status.replace('_', ' ') }}
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
    <div v-if="activeTab === 'history'" class="rounded-md border">
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
          <TableRow v-for="movement in stockMovements" :key="movement.id">
            <TableCell class="text-sm">{{ formatDateTime(movement.date) }}</TableCell>
            <TableCell>{{ movement.productName }}</TableCell>
            <TableCell>
              <Badge :variant="getMovementTypeVariant(movement.type)">
                {{ movement.type }}
              </Badge>
            </TableCell>
            <TableCell class="text-center">
              <span :class="movement.quantity > 0 ? 'text-green-600' : 'text-red-600'">
                {{ movement.quantity > 0 ? '+' : '' }}{{ movement.quantity }}
              </span>
            </TableCell>
            <TableCell class="text-center">{{ movement.stockBefore }}</TableCell>
            <TableCell class="text-center">{{ movement.stockAfter }}</TableCell>
            <TableCell class="text-sm">{{ movement.reference }}</TableCell>
            <TableCell class="text-sm">{{ movement.user }}</TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ movement.notes }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Low Stock Alerts -->
    <div v-if="activeTab === 'alerts'" class="space-y-4">
      <div v-for="alert in lowStockItems" :key="alert.id" class="border rounded-lg p-4">
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
              <p class="text-sm font-medium">Current: {{ alert.currentStock }}</p>
              <p class="text-sm text-muted-foreground">Min: {{ alert.minLevel }}</p>
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
    <div v-if="activeTab === 'analytics'" class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Stock Turnover</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="item in topMovingItems" :key="item.id" class="flex justify-between items-center">
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
            <div v-for="item in deadStockItems" :key="item.id" class="flex justify-between items-center">
              <span class="text-sm">{{ item.name }}</span>
              <span class="text-sm text-muted-foreground">{{ item.daysStagnant }} days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between space-x-2 py-4">
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
    <div v-if="showAdjustmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle>Stock Adjustment</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label>Product</Label>
            <Select v-model="adjustmentForm.productId">
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="item in allInventory" :key="item.id" :value="item.id">
                  {{ item.productName }} ({{ item.sku }})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Adjustment Type</Label>
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
            <Label>Quantity</Label>
            <Input v-model="adjustmentForm.quantity" type="number" placeholder="Enter quantity" />
          </div>
          
          <div>
            <Label>Reason</Label>
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
            <Label>Notes</Label>
            <Textarea v-model="adjustmentForm.notes" placeholder="Additional notes..." />
          </div>
        </CardContent>
        <CardHeader>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="closeAdjustmentModal">Cancel</Button>
            <Button @click="submitAdjustment">Submit</Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Button 
} from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
  ChevronRight
} from 'lucide-vue-next'
import HeadersContent from "~/components/ui/HeadersContent.vue";

// Sample inventory data
const allInventory = ref([
  {
    id: 'INV-001',
    productName: 'iPhone 15 Pro Max',
    sku: 'IPH-15PM-256',
    category: 'electronics',
    currentStock: 25,
    reservedStock: 5,
    availableStock: 20,
    minLevel: 10,
    maxLevel: 100,
    reorderPoint: 15,
    location: 'warehouse-a',
    lastUpdated: new Date('2024-06-20'),
    status: 'normal',
    unitCost: 900,
    unitPrice: 1199
  },
  {
    id: 'INV-002',
    productName: 'Nike Air Max 270',
    sku: 'NK-AM270-42',
    category: 'clothing',
    currentStock: 3,
    reservedStock: 1,
    availableStock: 2,
    minLevel: 5,
    maxLevel: 50,
    reorderPoint: 8,
    location: 'store-front',
    lastUpdated: new Date('2024-06-25'),
    status: 'low',
    unitCost: 80,
    unitPrice: 150
  },
  {
    id: 'INV-003',
    productName: 'MacBook Pro M3',
    sku: 'MBP-M3-512',
    category: 'electronics',
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    minLevel: 3,
    maxLevel: 20,
    reorderPoint: 5,
    location: 'warehouse-a',
    lastUpdated: new Date('2024-06-18'),
    status: 'out',
    unitCost: 1800,
    unitPrice: 2399
  },
  {
    id: 'INV-004',
    productName: 'Smart Garden Kit',
    sku: 'SGK-001',
    category: 'home',
    currentStock: 45,
    reservedStock: 2,
    availableStock: 43,
    minLevel: 5,
    maxLevel: 30,
    reorderPoint: 8,
    location: 'warehouse-b',
    lastUpdated: new Date('2024-06-24'),
    status: 'overstocked',
    unitCost: 200,
    unitPrice: 299
  }
])

// Stock movements data
const stockMovements = ref([
  {
    id: 'MOV-001',
    productName: 'iPhone 15 Pro Max',
    type: 'Purchase',
    quantity: 20,
    stockBefore: 5,
    stockAfter: 25,
    reference: 'PO-2024-001',
    user: 'Admin',
    date: new Date('2024-06-20T10:30:00'),
    notes: 'Weekly stock replenishment'
  },
  {
    id: 'MOV-002',
    productName: 'Nike Air Max 270',
    type: 'Sale',
    quantity: -2,
    stockBefore: 5,
    stockAfter: 3,
    reference: 'ORD-2024-156',
    user: 'System',
    date: new Date('2024-06-25T14:15:00'),
    notes: 'Online order fulfillment'
  }
])

// Reactive state
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedCategory = ref('all')
const selectedLocation = ref('all')
const filteredInventory = ref([...allInventory.value])
const selectedItems = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const activeTab = ref('stock')
const showAdjustmentModal = ref(false)

// Tabs configuration
const tabs = [
  { id: 'stock', name: 'Stock Management' },
  { id: 'history', name: 'Movement History' },
  { id: 'alerts', name: 'Low Stock Alerts' },
  { id: 'analytics', name: 'Analytics' }
]

// Adjustment form
const adjustmentForm = ref({
  productId: '',
  type: '',
  quantity: 0,
  reason: '',
  notes: ''
})

// Sample alerts
const alerts = ref([
  {
    id: 1,
    type: 'destructive',
    title: 'Critical Stock Alert',
    description: '3 products are out of stock and need immediate attention.'
  },
  {
    id: 2,
    type: 'default',
    title: 'Low Stock Warning',
    description: '2 products are below minimum stock level.'
  }
])

// Sample analytics data
const topMovingItems = ref([
  { id: 1, name: 'iPhone 15 Pro Max', turnoverRate: 4.2 },
  { id: 2, name: 'Nike Air Max 270', turnoverRate: 3.8 },
  { id: 3, name: 'Wireless Headphones', turnoverRate: 3.1 }
])

const deadStockItems = ref([
  { id: 1, name: 'Old Model Phone', daysStagnant: 120 },
  { id: 2, name: 'Seasonal Item', daysStagnant: 90 }
])

// Computed properties
const totalItems = computed(() => allInventory.value.length)
const lowStockCount = computed(() => allInventory.value.filter(item => item.status === 'low').length)
const outOfStockCount = computed(() => allInventory.value.filter(item => item.status === 'out').length)
const totalInventoryValue = computed(() => 
  allInventory.value.reduce((total, item) => total + (item.currentStock * item.unitCost), 0)
)

const lowStockItems = computed(() => 
  allInventory.value.filter(item => item.status === 'low' || item.status === 'out')
)

const selectAll = computed(() => {
  return paginatedInventory.value.length > 0 && 
         paginatedInventory.value.every(item => selectedItems.value.includes(item.id))
})

const totalPages = computed(() => {
  return Math.ceil(filteredInventory.value.length / parseInt(itemsPerPage.value))
})

const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * parseInt(itemsPerPage.value)
  const end = start + parseInt(itemsPerPage.value)
  return filteredInventory.value.slice(start, end)
})

// Methods
const filterInventory = () => {
  let filtered = allInventory.value

  if (searchQuery.value) {
    filtered = filtered.filter(item => 
      item.productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedStatus.value && selectedStatus.value !== 'all') {
    filtered = filtered.filter(item => item.status === selectedStatus.value)
  }

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    filtered = filtered.filter(item => item.category === selectedCategory.value)
  }

  if (selectedLocation.value && selectedLocation.value !== 'all') {
    filtered = filtered.filter(item => item.location === selectedLocation.value)
  }

  filteredInventory.value = filtered
  currentPage.value = 1
  selectedItems.value = []
}

const getStockBadgeVariant = (currentStock, minLevel) => {
  if (currentStock === 0) return 'destructive'
  if (currentStock <= minLevel) return 'secondary'
  return 'default'
}

const getStatusVariant = (status) => {
  switch (status) {
    case 'normal': return 'default'
    case 'low': return 'secondary'
    case 'out': return 'destructive'
    case 'overstocked': return 'outline'
    default: return 'outline'
  }
}

const getMovementTypeVariant = (type) => {
  switch (type.toLowerCase()) {
    case 'purchase': return 'default'
    case 'sale': return 'secondary'
    case 'return': return 'outline'
    case 'adjustment': return 'destructive'
    default: return 'outline'
  }
}

const toggleSelectAll = (checked) => {
  if (checked) {
    selectedItems.value = [...paginatedInventory.value.map(item => item.id)]
  } else {
    selectedItems.value = []
  }
}

const toggleItemSelection = (itemId) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
}

const changePage = (page) => {
  currentPage.value = page
  selectedItems.value = []
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Action methods
const openStockAdjustment = () => {
  showAdjustmentModal.value = true
}

const closeAdjustmentModal = () => {
  showAdjustmentModal.value = false
  adjustmentForm.value = {
    productId: '',
    type: '',
    quantity: 0,
    reason: '',
    notes: ''
  }
}

const submitAdjustment = () => {
  // Handle stock adjustment logic here
  console.log('Stock adjustment:', adjustmentForm.value)
  closeAdjustmentModal()
}

const adjustStock = (itemId) => {
  console.log('Adjust stock for item:', itemId)
}

const viewHistory = (itemId) => {
  console.log('View history for item:', itemId)
}

const reorderProduct = (itemId) => {
  console.log('Reorder product:', itemId)
}

const exportInventory = () => {
  console.log('Export inventory data')
}

// Initialize
onMounted(() => {
  filterInventory()
})
</script>

<style>

</style>