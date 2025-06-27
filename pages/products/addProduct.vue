<template>
  <div class="container mx-auto px-4">
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
              placeholder="Enter product ID"
              required
            />
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

          <!-- Category -->
          <div class="mb-2">
            <Label class="pb-2" for="category">Category</Label>
            <Select v-model="form.kategori" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Cake</SelectItem>
                <SelectItem value="clothing">Bread</SelectItem>
                <SelectItem value="food">Cookie</SelectItem>
                <SelectItem value="books">Candy</SelectItem>
                <SelectItem value="home">Ice Cream</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Description -->
          <div class="mb-2">
            <Label class="pb-2" for="description">Description</Label>
            <Textarea
              id="description"
              v-model="form.deskripsi"
              placeholder="Enter product description"
              rows="4"
              required
            />
          </div>

          <!-- Image Upload Only -->
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
                      >Remove Image</Button
                    >
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
              v-model="form.harga"
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
          <Button type="button" variant="outline" @click="handleCancel"
            >Cancel</Button
          >
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
              Adding Product...
            </span>
            <span v-else>Add Product</span>
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
      <Card v-if="showPreview" class="mt-8 p-6">
        <CardHeader>
          <CardTitle>Product Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div><strong>ID:</strong> {{ form.id }}</div>
            <div><strong>Title:</strong> {{ form.title }}</div>
            <div><strong>Category:</strong> {{ form.kategori }}</div>
            <div><strong>Description:</strong> {{ form.deskripsi }}</div>
            <div><strong>Price:</strong> Rp {{ formatPrice(form.harga) }}</div>
            <div v-if="imagePreview">
              <strong>Image:</strong>
              <img
                :src="imagePreview"
                alt="Product"
                class="mt-2 h-20 w-20 object-cover rounded-md border"
              />
            </div>
          </div>
          <Button variant="ghost" @click="showPreview = false" class="mt-4"
            >Hide Preview</Button
          >
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// State
const form = reactive({
  id: "",
  title: "",
  kategori: "",
  deskripsi: "",
  harga: null,
  imageFile: null,
});

const isLoading = ref(false);
const message = ref("");
const messageType = ref("");
const showPreview = ref(false);
const imagePreview = ref("");

// Form validation
const validateForm = () => {
  if (
    !form.id ||
    !form.title ||
    !form.kategori ||
    !form.deskripsi ||
    !form.harga ||
    !form.imageFile
  ) {
    showMessage("Please fill in all required fields including image", "error");
    return false;
  }
  if (form.harga <= 0) {
    showMessage("Price must be greater than 0", "error");
    return false;
  }
  return true;
};

// Handle file upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showMessage("Image size must be less than 5MB", "error");
    return;
  }
  if (!file.type.startsWith("image/")) {
    showMessage("Please select a valid image file", "error");
    return;
  }
  form.imageFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  form.imageFile = null;
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
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulasi delay
    const productData = {
      id: form.id,
      title: form.title,
      kategori: form.kategori,
      deskripsi: form.deskripsi,
      harga: Number(form.harga),
      image: "uploaded_file",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("Submitted product data:", productData);
    console.log("Uploaded file:", form.imageFile);
    showMessage("Product added successfully!", "success");
    showPreview.value = true;
  } catch (error) {
    showMessage("Failed to add product.", "error");
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  if (confirm("Are you sure you want to cancel?")) {
    Object.keys(form).forEach(
      (key) => (form[key] = key === "harga" ? null : "")
    );
    imagePreview.value = "";
    showPreview.value = false;
    const fileInput = document.getElementById("file-upload");
    if (fileInput) fileInput.value = "";
  }
};
</script>

<style></style>
