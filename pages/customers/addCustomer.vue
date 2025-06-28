<template>
  <div class="container mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between px-4">
      <HeadersContent
        title="Add New Customer"
        description="Create a new customer profile"
      />
    </div>

    <div class="mx-auto px-4">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <User class="mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Full Name -->
              <div>
                <Label for="fullName" class="required mb-2">Full Name</Label>
                <Input
                  id="fullName"
                  v-model="customerData.fullName"
                  placeholder="Enter customer's full name"
                  :class="{ 'border-red-500': errors.fullName }"
                  required
                />
                <p v-if="errors.fullName" class="text-sm text-red-500 mt-1">
                  {{ errors.fullName }}
                </p>
              </div>

              <!-- Email -->
              <div>
                <Label for="email" class="required mb-2">Email Address</Label>
                <Input
                  id="email"
                  v-model="customerData.email"
                  type="email"
                  placeholder="customer@email.com"
                  :class="{ 'border-red-500': errors.email }"
                  required
                />
                <p v-if="errors.email" class="text-sm text-red-500 mt-1">
                  {{ errors.email }}
                </p>
              </div>

              <!-- Phone Number -->
              <div>
                <Label for="phone" class="required mb-2">Phone Number</Label>
                <Input
                  id="phone"
                  v-model="customerData.phone"
                  placeholder="+62 812-3456-7890"
                  :class="{ 'border-red-500': errors.phone }"
                  required
                />
                <p v-if="errors.phone" class="text-sm text-red-500 mt-1">
                  {{ errors.phone }}
                </p>
              </div>

              <!-- Date of Birth -->
              <div>
                <Label for="dateOfBirth" class="mb-2">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  v-model="customerData.dateOfBirth"
                  type="date"
                />
              </div>

              <!-- Gender -->
              <div>
                <Label for="gender" class="mb-2">Gender</Label>
                <Select v-model="customerData.gender">
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say"
                      >Prefer not to say</SelectItem
                    >
                  </SelectContent>
                </Select>
              </div>

              <!-- Customer Type -->
              <div>
                <Label for="customerType" class="mb-2">Customer Type</Label>
                <Select v-model="customerData.customerType">
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular Customer</SelectItem>
                    <SelectItem value="vip">VIP Customer</SelectItem>
                    <SelectItem value="corporate"
                      >Corporate Customer</SelectItem
                    >
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Address Information -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <MapPin class="mr-2" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Primary Address -->
            <div>
              <Label for="address" class="required mb-2">Street Address</Label>
              <Textarea
                id="address"
                v-model="customerData.address.street"
                placeholder="Enter full street address"
                rows="2"
                :class="{ 'border-red-500': errors.address }"
                required
              />
              <p v-if="errors.address" class="text-sm text-red-500 mt-1">
                {{ errors.address }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- Preferences & Settings -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <Settings class="mr-2 h-5 w-5" />
              Preferences & Settings
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Communication Preferences -->
              <div>
                <Label class="text-base font-medium mb-3 block"
                  >Communication Preferences</Label
                >
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      v-model="customerData.preferences.emailNotifications"
                    />
                    <Label for="emailNotifications" class="text-sm"
                      >Email notifications</Label
                    >
                  </div>
                  <div class="flex items-center space-x-2">
                    <Checkbox
                      id="smsNotifications"
                      v-model="customerData.preferences.smsNotifications"
                    />
                    <Label for="smsNotifications" class="text-sm"
                      >SMS notifications</Label
                    >
                  </div>
                  <div class="flex items-center space-x-2">
                    <Checkbox
                      id="promotionalEmails"
                      v-model="customerData.preferences.promotionalEmails"
                    />
                    <Label for="promotionalEmails" class="text-sm"
                      >Promotional emails</Label
                    >
                  </div>
                  <div class="flex items-center space-x-2">
                    <Checkbox
                      id="orderUpdates"
                      v-model="customerData.preferences.orderUpdates"
                    />
                    <Label for="orderUpdates" class="text-sm"
                      >Order status updates</Label
                    >
                  </div>
                </div>
              </div>

              <!-- Dietary Preferences -->
              <div>
                <Label class="text-base font-medium mb-3 block"
                  >Dietary Preferences</Label
                >
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <Checkbox
                      id="vegetarian"
                      v-model="customerData.preferences.dietary.vegetarian"
                    />
                    <Label for="vegetarian" class="text-sm">Vegetarian</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Checkbox
                      id="vegan"
                      v-model="customerData.preferences.dietary.vegan"
                    />
                    <Label for="vegan" class="text-sm">Vegan</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Checkbox
                      id="glutenFree"
                      v-model="customerData.preferences.dietary.glutenFree"
                    />
                    <Label for="glutenFree" class="text-sm">Gluten-free</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Checkbox
                      id="sugarFree"
                      v-model="customerData.preferences.dietary.sugarFree"
                    />
                    <Label for="sugarFree" class="text-sm">Sugar-free</Label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Special Notes -->
            <div>
              <Label for="notes" class="mb-2">Special Notes</Label>
              <Textarea
                id="notes"
                v-model="customerData.notes"
                placeholder="Any special notes about this customer (allergies, preferences, etc.)"
                rows="3"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Emergency Contact (Optional) -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <Phone class="mr-2" />
              Emergency Contact (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="emergencyName" class="mb-2">Contact Name</Label>
                <Input
                  id="emergencyName"
                  v-model="customerData.emergencyContact.name"
                  placeholder="Emergency contact name"
                />
              </div>
              <div>
                <Label for="emergencyPhone" class="mb-2">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  v-model="customerData.emergencyContact.phone"
                  placeholder="+62 812-3456-7890"
                />
              </div>
              <div>
                <Label for="emergencyRelation" class="mb-2">Relationship</Label>
                <Input
                  id="emergencyRelation"
                  v-model="customerData.emergencyContact.relationship"
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Form Actions -->
        <div class="flex items-center justify-between pt-6 border-t mb-4">
          <div class="flex items-center space-x-2">
            <Checkbox id="sendWelcome" v-model="sendWelcomeEmail" />
            <Label for="sendWelcome" class="text-sm"
              >Send welcome email to customer</Label
            >
          </div>

          <div class="flex space-x-3">
            <Button type="button" variant="outline" @click="resetForm">
              Reset Form
            </Button>
            <Button type="button" variant="outline" @click="saveAsDraft">
              <Save class="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button type="submit" :disabled="isSubmitting">
              <UserPlus class="mr-2 h-4 w-4" />
              {{ isSubmitting ? "Creating..." : "Create Customer" }}
            </Button>
          </div>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <Dialog v-model:open="showSuccessModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle class="flex items-center text-green-600">
            <CheckCircle class="mr-2 h-5 w-5" />
            Customer Created Successfully!
          </DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <p>
            Customer <strong>{{ customerData.fullName }}</strong> has been
            created successfully.
          </p>
          <div class="flex justify-end space-x-2">
            <Button variant="outline" @click="createAnother">
              Create Another
            </Button>
            <Button @click="viewCustomer"> View Customer </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, reactive } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  User,
  MapPin,
  Settings,
  Phone,
  Save,
  UserPlus,
  CheckCircle,
} from "lucide-vue-next";

// State
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const sendWelcomeEmail = ref(true);

// Form data
const customerData = reactive({
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  customerType: "regular",
  address: {
    street: "",
    city: "",
    province: "",
    postalCode: "",
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: true,
    promotionalEmails: false,
    orderUpdates: true,
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
    },
  },
  emergencyContact: {
    name: "",
    phone: "",
    relationship: "",
  },
  notes: "",
});

// Form validation errors
const errors = ref({});

// Methods
const validateForm = () => {
  errors.value = {};

  // Required field validation
  if (!customerData.fullName.trim()) {
    errors.value.fullName = "Full name is required";
  }

  if (!customerData.email.trim()) {
    errors.value.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
    errors.value.email = "Please enter a valid email address";
  }

  if (!customerData.phone.trim()) {
    errors.value.phone = "Phone number is required";
  }

  if (!customerData.address.street.trim()) {
    errors.value.address = "Street address is required";
  }

  if (!customerData.address.city.trim()) {
    errors.value.city = "City is required";
  }

  if (!customerData.address.province) {
    errors.value.province = "Province is required";
  }

  if (!customerData.address.postalCode.trim()) {
    errors.value.postalCode = "Postal code is required";
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Creating customer:", customerData);

    // Show success modal
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error creating customer:", error);
    // Handle error (show toast, etc.)
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  // Reset all form fields
  Object.assign(customerData, {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    customerType: "regular",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      promotionalEmails: false,
      orderUpdates: true,
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        sugarFree: false,
      },
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    notes: "",
  });

  errors.value = {};
  sendWelcomeEmail.value = true;
};

const saveAsDraft = () => {
  console.log("Saving customer as draft:", customerData);
  // Implement draft saving logic
};

const navigateBack = () => {
  console.log("Navigate back to customer list");
};

const createAnother = () => {
  showSuccessModal.value = false;
  resetForm();
};

const viewCustomer = () => {
  showSuccessModal.value = false;
  console.log("Navigate to customer details");
};
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
