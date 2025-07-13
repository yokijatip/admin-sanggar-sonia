<template>
  <div class="container mx-auto px-4 min-w-full">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p class="text-muted-foreground">Fill in the product details below</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <Card class="p-6">
          <!-- Product ID -->
          <div class="mb-2">
            <Label class="pb-2" for="productId">Product ID</Label>
            <Input
              id="productId"
              v-model="form.id"
              type="text"
              placeholder="Product ID akan otomatis terisi setelah memilih kategori"
              required
              disabled
            />
          </div>

          <!-- Category -->
          <div class="mb-2">
            <Label class="pb-2" for="category">Category</Label>
            <Select
              v-model="form.category"
              @update:model-value="handleCategoryChange"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="kategori in categories"
                  :key="kategori.id"
                  :value="kategori.id"
                  >{{ kategori.name }}</SelectItem
                >
              </SelectContent>
            </Select>
          </div>

          <!-- Complexity -->
          <div class="mb-6">
            <Label class="pb-2" for="complexity">Complexity</Label>
            <div class="pt-3 pb-2">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600"
                  >Level: {{ form.complexity }}</span
                >
                <span class="text-sm text-gray-500">
                  {{ getComplexityLabel(form.complexity) }}
                </span>
              </div>
              <Slider
                v-model="form.complexity"
                :min="1"
                :max="10"
                :step="1"
                class="w-full"
              />
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 - Very Easy</span>
                <span>5 - Medium</span>
                <span>10 - Very Hard</span>
              </div>
            </div>
          </div>

          <!-- Product Title -->
          <div class="mb-2">
            <Label class="pb-2" for="productTitle">Product Title</Label>
            <Input
              id="productTitle"
              v-model="form.title"
              type="text"
              placeholder="Enter product title"
              required
            />
          </div>

          <!-- Description -->
          <div class="mb-2">
            <Label class="pb-2" for="description">Description</Label>
            <Textarea
              id="description"
              v-model="form.description"
              placeholder="Enter product description"
              rows="4"
              required
            />
          </div>

          <!-- Image Upload -->
          <div class="mb-2">
            <Label>Product Image</Label>
            <div class="mt-2">
              <div
                class="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <div class="space-y-1 text-center">
                  <div v-if="imagePreview" class="mb-4">
                    <img
                      :src="imagePreview"
                      alt="Product preview"
                      class="mx-auto h-32 w-32 object-cover rounded-lg shadow-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      @click="removeImage"
                      class="mt-2"
                    >
                      Remove Image
                    </Button>
                  </div>
                  <div v-else>
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label
                        for="file-upload"
                        class="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          @change="handleImageUpload"
                          class="sr-only"
                        />
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Price -->
          <div class="mb-2">
            <Label class="pb-2" for="price">Price (Rp)</Label>
            <Input
              id="price"
              v-model="form.price"
              type="number"
              min="0"
              step="1000"
              placeholder="Enter price"
              required
            />
          </div>
        </Card>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 pb-4">
          <Button
            type="button"
            variant="outline"
            @click="handleCancel"
            :disabled="isLoading"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="isLoading">
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
              {{ uploadingStatus }}
            </span>
            <span v-else>Add Product</span>
          </Button>
        </div>
      </form>

      <!-- Alert with Transition -->
      <Transition name="fade">
        <Alert
          v-show="message"
          :class="
            messageType === 'success'
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          "
          class="mb-4"
        >
          <AlertTitle>{{
            messageType === "success" ? "Success" : "Error"
          }}</AlertTitle>
          <AlertDescription>{{ message }}</AlertDescription>
        </Alert>
      </Transition>

      <!-- Preview -->
      <Card v-if="showPreview" class="mt-8 p-6 mb-4">
        <CardHeader>
          <CardTitle>Product Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div><strong>ID:</strong> {{ form.id }}</div>
            <div><strong>Title:</strong> {{ form.title }}</div>
            <div><strong>Category:</strong> {{ form.category }}</div>
            <div>
              <strong>Complexity:</strong> {{ form.complexity }} -
              {{ getComplexityLabel(form.complexity) }}
            </div>
            <div><strong>Description:</strong> {{ form.description }}</div>
            <div><strong>Price:</strong> Rp {{ formatPrice(form.price) }}</div>
            <div v-if="form.imageUrl || imagePreview">
              <strong>Image:</strong>
              <img
                :src="form.imageUrl || imagePreview"
                alt="Product"
                class="mt-2 h-20 w-20 object-cover rounded-md border"
              />
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
import { ref, reactive, onMounted } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

definePageMeta({
  middleware: "auth",
});

const config = useRuntimeConfig();

// State
const form = reactive({
  id: "",
  title: "",
  category: "",
  complexity: [5], // Default complexity level 5, using array for Slider component
  description: "",
  price: null,
  imageFile: null,
  imageUrl: "",
});

// Reactive variables
const isLoading = ref(false);
const uploadingStatus = ref("");
const message = ref("");
const messageType = ref("");
const showPreview = ref(false);
const imagePreview = ref("");
const categories = ref([]);

// Function to get complexity label
const getComplexityLabel = (level) => {
  const levelValue = Array.isArray(level) ? level[0] : level;

  const labels = {
    1: "Very Easy",
    2: "Easy",
    3: "Quite Easy",
    4: "Below Average",
    5: "Medium",
    6: "Above Average",
    7: "Quite Hard",
    8: "Hard",
    9: "Very Hard",
    10: "Extremely Hard",
  };

  return labels[levelValue] || "Medium";
};

// Function to upload image to Cloudinary (Updated)
const uploadToCloudinary = async (file) => {
  try {
    uploadingStatus.value = "Uploading image to Cloudinary...";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", config.public.cloudinaryUploadPreset);
    formData.append("folder", "TokoKueDlillah/products");

    // Generate unique filename with timestamp
    const timestamp = new Date().getTime();
    const filename = `product_${timestamp}_${file.name.replace(
      /[^a-zA-Z0-9.]/g,
      "_"
    )}`;
    formData.append("public_id", `TokoKueDlillah/products/${filename}`);

    console.log("Uploading to Cloudinary with config:", {
      cloudName: config.public.cloudinaryCloudName,
      uploadPreset: config.public.cloudinaryUploadPreset,
      folder: "TokoKueDlillah/products",
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("Cloudinary response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Cloudinary upload success:", data);

    if (data.error) {
      console.error("Cloudinary API error:", data.error);
      throw new Error(data.error.message);
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Function to generate prefix from category name
const generateCategoryPrefix = (categoryName) => {
  if (!categoryName) {
    console.log("No category name provided, using default PRD");
    return "PRD";
  }

  console.log(`Generating prefix for category: "${categoryName}"`);

  // Remove spaces and special characters, convert to uppercase
  const cleanName = categoryName.replace(/[^a-zA-Z]/g, "").toUpperCase();
  console.log(`Cleaned category name: "${cleanName}"`);

  let prefix;

  // Generate 3-letter prefix
  if (cleanName.length >= 3) {
    // Take first 3 characters
    prefix = cleanName.substring(0, 3);
  } else if (cleanName.length === 2) {
    // If only 2 characters, add 'X'
    prefix = cleanName + "X";
  } else if (cleanName.length === 1) {
    // If only 1 character, add 'XX'
    prefix = cleanName + "XX";
  } else {
    // Fallback
    prefix = "PRD";
  }

  console.log(`Final prefix: "${prefix}"`);
  return prefix;
};

// Fetch categories from Firestore on mount
const fetchCategories = async () => {
  try {
    const { $firebase } = useNuxtApp();
    const querySnapshot = await getDocs(
      collection($firebase.firestore, "categories")
    );

    categories.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        firestoreId: doc.id,
        id: data.id,
        name: data.name,
      };
    });

    console.log("Fetched categories:", categories.value);
  } catch (error) {
    console.error("Error fetching categories:", error);
    showMessage("Failed to load categories", "error");
  }
};

// Generate next product ID based on category
const generateProductId = async (categoryId) => {
  try {
    const { $firebase } = useNuxtApp();

    const selectedCategory = categories.value.find(
      (cat) => cat.id === categoryId
    );

    if (!selectedCategory) {
      console.error(`Category not found for ID: ${categoryId}`);
      return "PRD-001";
    }

    const categoryName = selectedCategory.name;
    const prefix = generateCategoryPrefix(categoryName);

    // Get today's date in YYYYMMDD
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");

    const fullPrefix = `${prefix}-${dateStr}`; // Example: COO-20250701

    const productsQuery = query(
      collection($firebase.firestore, "products"),
      where("category", "==", categoryId)
    );

    const querySnapshot = await getDocs(productsQuery);

    let maxNumber = 0;

    querySnapshot.forEach((doc) => {
      const productId = doc.data().id;
      if (productId && productId.startsWith(fullPrefix)) {
        const parts = productId.split("-");
        const number = parseInt(parts[2]) || 0;
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });

    const nextNumber = maxNumber + 1;
    const formatted = nextNumber.toString().padStart(3, "0");

    const finalId = `${fullPrefix}-${formatted}`; // Ex: COO-20250701-002

    return finalId;
  } catch (err) {
    console.error("Error generating product ID:", err);
    return `PRD-${Date.now().toString().slice(-6)}`;
  }
};

// Handle category change
const handleCategoryChange = async (selectedCategoryId) => {
  if (selectedCategoryId) {
    try {
      // Show loading state
      form.id = "Generating ID...";

      // Add small delay to ensure categories are loaded
      if (categories.value.length === 0) {
        await fetchCategories();
      }

      // Generate new product ID
      const newProductId = await generateProductId(selectedCategoryId);
      form.id = newProductId;

      console.log(
        `Generated Product ID: ${newProductId} for category: ${selectedCategoryId}`
      );
      console.log(
        `Category data:`,
        categories.value.find((cat) => cat.id === selectedCategoryId)
      );
    } catch (error) {
      console.error("Error handling category change:", error);
      showMessage("Failed to generate product ID", "error");
      form.id = "";
    }
  } else {
    form.id = "";
  }
};

// Fetch categories when component is mounted
onMounted(() => {
  fetchCategories();
});

// Form validation
const validateForm = () => {
  if (
    !form.id ||
    !form.title ||
    !form.category ||
    !form.description ||
    !form.price ||
    !form.complexity
  ) {
    showMessage("Please fill in all required fields", "error");
    return false;
  }
  if (form.price <= 0) {
    showMessage("Price must be greater than 0", "error");
    return false;
  }
  return true;
};

// Handle file upload - only preview, no upload yet
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file
  if (file.size > 5 * 1024 * 1024) {
    showMessage("Image size must be less than 5MB", "error");
    return;
  }
  if (!file.type.startsWith("image/")) {
    showMessage("Please select a valid image file", "error");
    return;
  }

  // Store file for later upload during submit
  form.imageFile = file;

  // Show preview immediately
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  form.imageFile = null;
  form.imageUrl = "";
  imagePreview.value = "";
  const fileInput = document.getElementById("file-upload");
  if (fileInput) fileInput.value = "";
};

const showMessage = (msg, type) => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
    messageType.value = "";
  }, 5000);
};

const formatPrice = (price) => {
  if (!price) return "0";
  return new Intl.NumberFormat("id-ID").format(price);
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const { $firebase } = useNuxtApp();

    // Step 1: Upload image to Cloudinary if exists
    let imageUrl = "";

    if (form.imageFile) {
      try {
        imageUrl = await uploadToCloudinary(form.imageFile);
        form.imageUrl = imageUrl;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
        showMessage(`Failed to upload image: ${error.message}`, "error");
        return;
      }
    }

    // Step 2: Check for unique ID
    uploadingStatus.value = "Checking product ID...";
    const existingProductQuery = query(
      collection($firebase.firestore, "products"),
      where("id", "==", form.id),
      limit(1)
    );

    const existingProductSnapshot = await getDocs(existingProductQuery);

    if (!existingProductSnapshot.empty) {
      // If ID already exists, regenerate
      const newId = await generateProductId(form.category);
      form.id = newId;
      console.log("Product ID regenerated:", newId);
    }

    // Step 3: Save to Firestore
    uploadingStatus.value = "Saving product...";
    const productData = {
      id: form.id,
      title: form.title,
      category: form.category,
      complexity: Array.isArray(form.complexity)
        ? form.complexity[0]
        : form.complexity,
      description: form.description,
      price: Number(form.price),
      stock: 0, // Default stock,
      minLevel: 1, // Default minimum level
      maxLevel: 10, // Default maximum level
      statusProduct: "active", // Default status
      statusInventory: "normal", // Default inventory status
      warehouseLocation: "warehouse-a", // Default warehouse location
      imageUrl: imageUrl || "", // Use Cloudinary URL
      stock: 0,
      available: 0,
      minLevel: 0,
      location: "Unknown",
      reserverd: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log("Submitted product data:", productData);

    await addDoc(collection($firebase.firestore, "products"), productData);

    // Success
    showMessage("Product added successfully!", "success");
    showPreview.value = true;
  } catch (error) {
    console.error("Error adding product:", error);
    showMessage("Failed to add product. Please try again.", "error");
  } finally {
    isLoading.value = false;
    uploadingStatus.value = "";
  }
};

const handleCancel = () => {
  if (confirm("Are you sure you want to cancel?")) {
    Object.keys(form).forEach((key) => {
      if (key === "price") {
        form[key] = null;
      } else if (key === "complexity") {
        form[key] = [5]; // Reset to default complexity
      } else {
        form[key] = "";
      }
    });
    imagePreview.value = "";
    showPreview.value = false;
    const fileInput = document.getElementById("file-upload");
    if (fileInput) fileInput.value = "";
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
