<template>
  <div class="container mx-auto px-4">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Add New Order</h1>
        <p class="text-muted-foreground">
          Create a new order for your customer
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Customer Information Card -->
        <Card class="p-6">
          <CardHeader class="px-0 pt-0">
            <CardTitle class="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent class="px-0 pb-0">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Order ID -->
              <div>
                <Label class="pb-2" for="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  v-model="form.orderId"
                  type="text"
                  placeholder="ORD-001"
                  required
                />
              </div>

              <!-- Customer Selection -->
              <div>
                <Label class="pb-2" for="customer">Customer</Label>
                <Select v-model="form.customerId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cust-001"
                      >Olivia Martin (olivia.martin@email.com)</SelectItem
                    >
                    <SelectItem value="cust-002"
                      >Jackson Lee (jackson.lee@email.com)</SelectItem
                    >
                    <SelectItem value="cust-003"
                      >Isabella Nguyen (isabella.nguyen@email.com)</SelectItem
                    >
                    <SelectItem value="cust-004"
                      >William Kim (will@email.com)</SelectItem
                    >
                    <SelectItem value="cust-005"
                      >Sofia Davis (sofia.davis@email.com)</SelectItem
                    >
                  </SelectContent>
                </Select>
              </div>

              <!-- Order Date -->
              <div>
                <Label class="pb-2" for="orderDate">Order Date</Label>
                <Input
                  id="orderDate"
                  v-model="form.orderDate"
                  type="date"
                  required
                />
              </div>

              <!-- Order Status -->
              <div>
                <Label class="pb-2" for="status">Order Status</Label>
                <Select v-model="form.status" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Products Card -->
        <Card class="p-6">
          <CardHeader class="px-0 pt-0">
            <CardTitle class="text-lg flex items-center justify-between">
              Order Items
              <Button
                type="button"
                @click="addProduct"
                variant="outline"
                size="sm"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent class="px-0 pb-0">
            <div
              v-if="form.products.length === 0"
              class="text-center py-8 text-muted-foreground"
            >
              <PackageIcon class="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products added yet</p>
              <p class="text-sm">
                Click "Add Product" to start adding items to this order
              </p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(product, index) in form.products"
                :key="index"
                class="border rounded-lg p-4 bg-gray-50"
              >
                <div class="grid grid-cols-12 gap-4 items-end">
                  <!-- Product Selection - lebih lebar -->
                  <div class="col-span-12 md:col-span-5">
                    <Label class="pb-2">Product</Label>
                    <div class="text-sm text-gray-600 mb-4 truncate">
                      {{ getProductName(product.productId) }}
                    </div>
                    <Select
                      v-model="product.productId"
                      @update:model-value="updateProductPrice(index)"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRD-001"
                          >iPhone 15 Pro Max - Rp 1,199</SelectItem
                        >
                        <SelectItem value="PRD-002"
                          >Nike Air Max 270 - Rp 150</SelectItem
                        >
                        <SelectItem value="PRD-003"
                          >MacBook Pro M3 - Rp 2,399</SelectItem
                        >
                        <SelectItem value="PRD-004"
                          >The Psychology of Money - Rp 15</SelectItem
                        >
                        <SelectItem value="PRD-005"
                          >Smart Garden Kit - Rp 299</SelectItem
                        >
                        <SelectItem value="PRD-006"
                          >Wireless Headphones - Rp 249</SelectItem
                        >
                        <SelectItem value="PRD-007"
                          >Designer T-Shirt - Rp 89</SelectItem
                        >
                        <SelectItem value="PRD-008"
                          >Coffee Maker Pro - Rp 599</SelectItem
                        >
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Quantity - lebih kecil -->
                  <div class="col-span-6 md:col-span-2">
                    <Label class="pb-2">Qty</Label>
                    <Input
                      v-model="product.quantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      @input="calculateSubtotal(index)"
                    />
                  </div>

                  <!-- Unit Price - sedang -->
                  <div class="col-span-6 md:col-span-2">
                    <Label class="pb-2">Price</Label>
                    <Input
                      v-model="product.unitPrice"
                      type="number"
                      readonly
                      class="bg-gray-100"
                    />
                  </div>

                  <!-- Subtotal & Actions - lebih kompak -->
                  <div class="col-span-12 md:col-span-3">
                    <div class="flex items-center justify-between">
                      <div class="text-sm font-medium truncate mr-2">
                        Subtotal: Rp {{ formatPrice(product.subtotal || 0) }}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        @click="removeProduct(index)"
                        class="flex-shrink-0"
                      >
                        <TrashIcon class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Order Summary Card -->
        <Card class="p-6">
          <CardHeader class="px-0 pt-0">
            <CardTitle class="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent class="px-0 pb-0">
            <div class="space-y-4">
              <!-- Shipping Address -->
              <div>
                <Label class="pb-2" for="shippingAddress"
                  >Shipping Address</Label
                >
                <Textarea
                  id="shippingAddress"
                  v-model="form.shippingAddress"
                  placeholder="Enter complete shipping address"
                  rows="3"
                  required
                />
              </div>

              <!-- Notes -->
              <div>
                <Label class="pb-2" for="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  v-model="form.notes"
                  placeholder="Any special instructions or notes"
                  rows="2"
                />
              </div>

              <!-- Total Calculation -->
              <div class="border-t pt-4">
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>Rp {{ formatPrice(calculateTotal()) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>Rp {{ formatPrice(form.shippingCost) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span>Tax (11%):</span>
                    <span>Rp {{ formatPrice(calculateTax()) }}</span>
                  </div>
                  <Separator />
                  <div class="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>Rp {{ formatPrice(calculateGrandTotal()) }}</span>
                  </div>
                </div>
              </div>

              <!-- Shipping Cost -->
              <div>
                <Label class="pb-2" for="shippingCost"
                  >Shipping Cost (Rp)</Label
                >
                <Input
                  id="shippingCost"
                  v-model="form.shippingCost"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 pb-4">
          <Button type="button" variant="outline" @click="handleCancel">
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            @click="showPreview = !showPreview"
          >
            {{ showPreview ? "Hide Preview" : "Show Preview" }}
          </Button>
          <Button
            type="submit"
            :disabled="isLoading || form.products.length === 0"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Order...
            </span>
            <span v-else>Create Order</span>
          </Button>
        </div>
      </form>

      <!-- Alert -->
      <Alert
        v-if="message"
        :class="
          messageType === 'success'
            ? 'border-green-200 bg-green-50'
            : 'border-red-200 bg-red-50'
        "
        class="mt-4"
      >
        <AlertTitle>{{
          messageType === "success" ? "Success" : "Error"
        }}</AlertTitle>
        <AlertDescription>{{ message }}</AlertDescription>
      </Alert>

      <!-- Preview -->
      <Card v-if="showPreview" class="my-4 p-6">
        <CardHeader>
          <CardTitle>Order Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Order ID:</strong> {{ form.orderId }}</div>
              <div>
                <strong>Customer:</strong>
                {{ getCustomerName(form.customerId) }}
              </div>
              <div><strong>Order Date:</strong> {{ form.orderDate }}</div>
              <div><strong>Status:</strong> {{ form.status }}</div>
            </div>

            <div>
              <strong>Products:</strong>
              <div class="mt-2 space-y-2">
                <div
                  v-for="(product, index) in form.products"
                  :key="index"
                  class="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span
                    >{{ getProductName(product.productId) }} x{{
                      product.quantity
                    }}</span
                  >
                  <span>Rp {{ formatPrice(product.subtotal || 0) }}</span>
                </div>
              </div>
            </div>

            <div>
              <strong>Shipping Address:</strong> {{ form.shippingAddress }}
            </div>
            <div v-if="form.notes">
              <strong>Notes:</strong> {{ form.notes }}
            </div>
            <div class="text-lg font-bold">
              <strong>Grand Total:</strong> Rp
              {{ formatPrice(calculateGrandTotal()) }}
            </div>
          </div>
          <Button variant="ghost" @click="showPreview = false" class="mt-4">
            Hide Preview
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlusIcon, TrashIcon, PackageIcon } from "lucide-vue-next";

// State
const form = reactive({
  orderId: "",
  customerId: "",
  orderDate: new Date().toISOString().split("T")[0],
  status: "pending",
  products: [],
  shippingAddress: "",
  notes: "",
  shippingCost: 0,
});

const isLoading = ref(false);
const message = ref("");
const messageType = ref("");
const showPreview = ref(false);

// Product data for reference
const productData = {
  "PRD-001": { name: "iPhone 15 Pro Max", price: 1199 },
  "PRD-002": { name: "Nike Air Max 270", price: 150 },
  "PRD-003": { name: "MacBook Pro M3", price: 2399 },
  "PRD-004": {
    name: "The Psychology of Money The Lorem Ipsum Dolor sit amet wkwk panjang ya",
    price: 15,
  },
  "PRD-005": { name: "Smart Garden Kit", price: 299 },
  "PRD-006": { name: "Wireless Headphones", price: 249 },
  "PRD-007": { name: "Designer T-Shirt", price: 89 },
  "PRD-008": { name: "Coffee Maker Pro", price: 599 },
};

const customerData = {
  "cust-001": "Olivia Martin",
  "cust-002": "Jackson Lee",
  "cust-003": "Isabella Nguyen",
  "cust-004": "William Kim",
  "cust-005": "Sofia Davis",
};

// Methods
const addProduct = () => {
  form.products.push({
    productId: "",
    quantity: 1,
    unitPrice: 0,
    subtotal: 0,
  });
};

const removeProduct = (index) => {
  form.products.splice(index, 1);
};

const updateProductPrice = (index) => {
  const product = form.products[index];
  if (product.productId && productData[product.productId]) {
    product.unitPrice = productData[product.productId].price;
    calculateSubtotal(index);
  }
};

const calculateSubtotal = (index) => {
  const product = form.products[index];
  product.subtotal = (product.quantity || 0) * (product.unitPrice || 0);
};

const calculateTotal = () => {
  return form.products.reduce(
    (total, product) => total + (product.subtotal || 0),
    0
  );
};

const calculateTax = () => {
  return Math.round(calculateTotal() * 0.11);
};

const calculateGrandTotal = () => {
  return calculateTotal() + (form.shippingCost || 0) + calculateTax();
};

const getProductName = (productId) => {
  return productData[productId]?.name || "Unknown Product";
};

const getCustomerName = (customerId) => {
  return customerData[customerId] || "Unknown Customer";
};

const formatPrice = (price) => {
  if (!price) return "0";
  return new Intl.NumberFormat("id-ID").format(price);
};

const showMessage = (msg, type) => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
    messageType.value = "";
  }, 5000);
};

const validateForm = () => {
  if (
    !form.orderId ||
    !form.customerId ||
    !form.orderDate ||
    !form.status ||
    !form.shippingAddress
  ) {
    showMessage("Please fill in all required fields", "error");
    return false;
  }
  if (form.products.length === 0) {
    showMessage("Please add at least one product to the order", "error");
    return false;
  }
  for (let i = 0; i < form.products.length; i++) {
    const product = form.products[i];
    if (!product.productId || !product.quantity || product.quantity <= 0) {
      showMessage(
        `Please complete product information for item ${i + 1}`,
        "error"
      );
      return false;
    }
  }
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderData = {
      orderId: form.orderId,
      customerId: form.customerId,
      orderDate: form.orderDate,
      status: form.status,
      products: form.products,
      shippingAddress: form.shippingAddress,
      notes: form.notes,
      shippingCost: Number(form.shippingCost),
      subtotal: calculateTotal(),
      tax: calculateTax(),
      grandTotal: calculateGrandTotal(),
      createdAt: new Date().toISOString(),
    };

    console.log("Submitted order data:", orderData);
    showMessage("Order created successfully!", "success");
    showPreview.value = true;
  } catch (error) {
    showMessage("Failed to create order.", "error");
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  if (confirm("Are you sure you want to cancel? All data will be lost.")) {
    // Reset form
    Object.assign(form, {
      orderId: "",
      customerId: "",
      orderDate: new Date().toISOString().split("T")[0],
      status: "pending",
      products: [],
      shippingAddress: "",
      notes: "",
      shippingCost: 0,
    });
    showPreview.value = false;
  }
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
