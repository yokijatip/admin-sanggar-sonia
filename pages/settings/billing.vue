<template>
  <div class="container mx-auto">
    <!-- Header -->
    <div class="px-4 mb-6">
      <HeadersContent
        title="Billing & Subscription"
        description="Manage your subscription, billing, and payment methods"
      />
    </div>

    <div class="max-w-6xl mx-auto px-4 space-y-6">
      <!-- Current Plan -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <CreditCard class="mr-2 h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <Crown class="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 class="text-2xl font-bold">{{ currentPlan.name }}</h3>
                <p class="text-muted-foreground">
                  {{ currentPlan.description }}
                </p>
                <div class="flex items-center space-x-4 mt-2">
                  <Badge variant="default">{{ currentPlan.status }}</Badge>
                  <span class="text-sm text-muted-foreground">
                    {{ currentPlan.billingCycle }} billing
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold">
                Rp {{ formatPrice(currentPlan.price) }}
                <span class="text-lg font-normal text-muted-foreground"
                  >/{{ currentPlan.billingCycle }}</span
                >
              </div>
              <p class="text-sm text-muted-foreground">
                Next billing: {{ formatDate(currentPlan.nextBilling) }}
              </p>
              <div class="flex space-x-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  @click="showUpgradeModal = true"
                >
                  Upgrade Plan
                </Button>
                <Button variant="outline" size="sm" @click="managePlan">
                  Manage Plan
                </Button>
              </div>
            </div>
          </div>

          <!-- Usage Progress -->
          <div class="mt-6 space-y-4">
            <h4 class="font-medium">Plan Usage</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="usage in planUsage"
                :key="usage.feature"
                class="space-y-2"
              >
                <div class="flex justify-between text-sm">
                  <span>{{ usage.feature }}</span>
                  <span
                    >{{ usage.used }} /
                    {{ usage.limit === -1 ? "Unlimited" : usage.limit }}</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300"
                    :class="
                      usage.percentage > 80
                        ? 'bg-red-500'
                        : usage.percentage > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    "
                    :style="{ width: `${Math.min(usage.percentage, 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Payment Method -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center">
              <CreditCard class="mr-2 h-5 w-5" />
              Payment Methods
            </CardTitle>
            <Button variant="outline" @click="showAddPaymentModal = true">
              <Plus class="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <div
                  class="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <CreditCard class="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <div class="font-medium">
                    {{ method.type }} •••• {{ method.last4 }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Expires {{ method.expiry }}
                    <Badge
                      v-if="method.isDefault"
                      variant="default"
                      class="ml-2"
                      >Default</Badge
                    >
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <Button
                  v-if="!method.isDefault"
                  variant="outline"
                  size="sm"
                  @click="setDefaultPayment(method.id)"
                >
                  Set Default
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  @click="editPaymentMethod(method.id)"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  @click="removePaymentMethod(method.id)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Billing History -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center">
              <FileText class="mr-2 h-5 w-5" />
              Billing History
            </CardTitle>
            <Button variant="outline" @click="downloadAllInvoices">
              <Download class="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="invoice in billingHistory"
              :key="invoice.id"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <div
                  class="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <FileText class="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <div class="font-medium">{{ invoice.description }}</div>
                  <div class="text-sm text-muted-foreground">
                    {{ formatDate(invoice.date) }} • {{ invoice.id }}
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="font-medium">
                    Rp {{ formatPrice(invoice.amount) }}
                  </div>
                  <Badge :variant="getInvoiceStatusVariant(invoice.status)">
                    {{ invoice.status }}
                  </Badge>
                </div>
                <div class="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="viewInvoice(invoice.id)"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    @click="downloadInvoice(invoice.id)"
                  >
                    <Download class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Available Plans -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Package class="mr-2 h-5 w-5" />
            Available Plans
          </CardTitle>
          <CardDescription
            >Choose the plan that best fits your business needs</CardDescription
          >
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="plan in availablePlans"
              :key="plan.id"
              class="border rounded-lg p-6 relative"
            >
              <Badge
                v-if="plan.popular"
                variant="default"
                class="absolute -top-2 left-1/2 transform -translate-x-1/2"
              >
                Most Popular
              </Badge>
              <div class="text-center mb-6">
                <h3 class="text-xl font-bold">{{ plan.name }}</h3>
                <p class="text-muted-foreground mt-2">{{ plan.description }}</p>
                <div class="mt-4">
                  <span class="text-3xl font-bold"
                    >Rp {{ formatPrice(plan.monthlyPrice) }}</span
                  >
                  <span class="text-muted-foreground">/month</span>
                </div>
                <div class="text-sm text-muted-foreground mt-1">
                  or Rp {{ formatPrice(plan.yearlyPrice) }}/year (save 20%)
                </div>
              </div>

              <div class="space-y-3 mb-6">
                <div
                  v-for="feature in plan.features"
                  :key="feature"
                  class="flex items-center space-x-2"
                >
                  <Check class="h-4 w-4 text-green-500" />
                  <span class="text-sm">{{ feature }}</span>
                </div>
              </div>

              <Button
                :variant="plan.id === currentPlan.id ? 'outline' : 'default'"
                class="w-full"
                :disabled="plan.id === currentPlan.id"
                @click="selectPlan(plan.id)"
              >
                {{
                  plan.id === currentPlan.id
                    ? "Current Plan"
                    : "Upgrade to " + plan.name
                }}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Billing Settings -->
      <Card class="mb-4">
        <CardHeader>
          <CardTitle class="flex items-center">
            <Settings class="mr-2" />
            Billing Settings
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Billing Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Billing Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label for="companyName" class="mb-2">Company Name</Label>
                <Input
                  id="companyName"
                  v-model="billingInfo.companyName"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <Label for="taxId" class="mb-2">Tax ID / VAT Number</Label>
                <Input
                  id="taxId"
                  v-model="billingInfo.taxId"
                  placeholder="Tax identification number"
                />
              </div>
              <div>
                <Label for="billingEmail" class="mb-2">Billing Email</Label>
                <Input
                  id="billingEmail"
                  v-model="billingInfo.email"
                  type="email"
                  placeholder="billing@company.com"
                />
              </div>
              <div>
                <Label for="billingPhone" class="mb-2">Phone Number</Label>
                <Input
                  id="billingPhone"
                  v-model="billingInfo.phone"
                  placeholder="+62 21-1234-5678"
                />
              </div>
            </div>
            <div>
              <Label for="billingAddress" class="mb-2">Billing Address</Label>
              <Textarea
                id="billingAddress"
                v-model="billingInfo.address"
                placeholder="Complete billing address"
                rows="3"
              />
            </div>
          </div>

          <!-- Billing Preferences -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Billing Preferences</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-base">Email Invoices</Label>
                  <p class="text-sm text-muted-foreground">
                    Receive invoices via email
                  </p>
                </div>
                <Switch v-model="billingPreferences.emailInvoices" />
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-base">Auto-pay</Label>
                  <p class="text-sm text-muted-foreground">
                    Automatically pay invoices when due
                  </p>
                </div>
                <Switch v-model="billingPreferences.autoPay" />
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-base">Usage Alerts</Label>
                  <p class="text-sm text-muted-foreground">
                    Get notified when approaching plan limits
                  </p>
                </div>
                <Switch v-model="billingPreferences.usageAlerts" />
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <Button @click="saveBillingSettings">
              <Save class="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Upgrade Plan Modal -->
    <Dialog v-model:open="showUpgradeModal">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose a plan that better fits your growing business needs
          </DialogDescription>
        </DialogHeader>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="plan in availablePlans.filter(
              (p) => p.id !== currentPlan.id
            )"
            :key="plan.id"
            class="border rounded-lg p-6"
          >
            <div class="text-center mb-4">
              <h3 class="text-lg font-bold">{{ plan.name }}</h3>
              <p class="text-muted-foreground">{{ plan.description }}</p>
              <div class="mt-3">
                <span class="text-2xl font-bold"
                  >Rp {{ formatPrice(plan.monthlyPrice) }}</span
                >
                <span class="text-muted-foreground">/month</span>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <div
                v-for="feature in plan.features.slice(0, 5)"
                :key="feature"
                class="flex items-center space-x-2"
              >
                <Check class="h-4 w-4 text-green-500" />
                <span class="text-sm">{{ feature }}</span>
              </div>
            </div>

            <Button class="w-full" @click="upgradeToPlan(plan.id)">
              Upgrade to {{ plan.name }}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showUpgradeModal = false">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add Payment Method Modal -->
    <Dialog v-model:open="showAddPaymentModal">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new payment method to your account
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              v-model="paymentForm.cardNumber"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                v-model="paymentForm.expiryDate"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <Label for="cvv">CVV</Label>
              <Input id="cvv" v-model="paymentForm.cvv" placeholder="123" />
            </div>
          </div>
          <div>
            <Label for="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              v-model="paymentForm.cardholderName"
              placeholder="John Doe"
            />
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox id="setDefault" v-model="paymentForm.setDefault" />
            <Label for="setDefault" class="text-sm"
              >Set as default payment method</Label
            >
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showAddPaymentModal = false">
            Cancel
          </Button>
          <Button @click="addPaymentMethod">
            <Plus class="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </DialogFooter>
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Crown,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Download,
  Eye,
  Package,
  Check,
  Settings,
  Save,
} from "lucide-vue-next";

definePageMeta({
  middleware: "auth",
});

// State
const showUpgradeModal = ref(false);
const showAddPaymentModal = ref(false);

// Current plan data
const currentPlan = ref({
  id: "pro",
  name: "Professional",
  description: "Perfect for growing bakery businesses",
  price: 299000,
  billingCycle: "month",
  status: "Active",
  nextBilling: "2024-02-17T00:00:00Z",
});

// Plan usage data
const planUsage = ref([
  {
    feature: "Orders",
    used: 1250,
    limit: 2000,
    percentage: 62.5,
  },
  {
    feature: "Products",
    used: 45,
    limit: 100,
    percentage: 45,
  },
  {
    feature: "Team Members",
    used: 5,
    limit: 10,
    percentage: 50,
  },
]);

// Payment methods
const paymentMethods = ref([
  {
    id: "1",
    type: "Visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: "2",
    type: "Mastercard",
    last4: "8888",
    expiry: "08/26",
    isDefault: false,
  },
]);

// Billing history
const billingHistory = ref([
  {
    id: "INV-2024-001",
    description: "Professional Plan - January 2024",
    date: "2024-01-17T00:00:00Z",
    amount: 299000,
    status: "paid",
  },
  {
    id: "INV-2023-012",
    description: "Professional Plan - December 2023",
    date: "2023-12-17T00:00:00Z",
    amount: 299000,
    status: "paid",
  },
  {
    id: "INV-2023-011",
    description: "Professional Plan - November 2023",
    date: "2023-11-17T00:00:00Z",
    amount: 299000,
    status: "paid",
  },
]);

// Available plans
const availablePlans = ref([
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small bakeries just getting started",
    monthlyPrice: 99000,
    yearlyPrice: 950000,
    popular: false,
    features: [
      "Up to 500 orders/month",
      "Up to 50 products",
      "2 team members",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    description: "Ideal for growing bakery businesses",
    monthlyPrice: 299000,
    yearlyPrice: 2870000,
    popular: true,
    features: [
      "Up to 2,000 orders/month",
      "Up to 100 products",
      "10 team members",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large bakery chains and franchises",
    monthlyPrice: 799000,
    yearlyPrice: 7670000,
    popular: false,
    features: [
      "Unlimited orders",
      "Unlimited products",
      "Unlimited team members",
      "Advanced analytics & reports",
      "24/7 phone support",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
  },
]);

// Forms
const billingInfo = reactive({
  companyName: "Dlillah Cake Shop",
  taxId: "01.234.567.8-901.000",
  email: "billing@dlillah.com",
  phone: "+62 21-1234-5678",
  address: "Jl. Raya Bogor No. 123, Jakarta Timur, DKI Jakarta 13750",
});

const billingPreferences = reactive({
  emailInvoices: true,
  autoPay: true,
  usageAlerts: true,
});

const paymentForm = reactive({
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardholderName: "",
  setDefault: false,
});

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getInvoiceStatusVariant = (status) => {
  switch (status) {
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "overdue":
      return "destructive";
    default:
      return "outline";
  }
};

// Actions
const managePlan = () => {
  console.log("Manage current plan");
};

const selectPlan = (planId) => {
  console.log("Select plan:", planId);
  showUpgradeModal.value = false;
};

const upgradeToPlan = (planId) => {
  console.log("Upgrade to plan:", planId);
  showUpgradeModal.value = false;
};

const setDefaultPayment = (methodId) => {
  console.log("Set default payment method:", methodId);
};

const editPaymentMethod = (methodId) => {
  console.log("Edit payment method:", methodId);
};

const removePaymentMethod = (methodId) => {
  console.log("Remove payment method:", methodId);
};

const addPaymentMethod = () => {
  console.log("Add payment method:", paymentForm);
  showAddPaymentModal.value = false;
  // Reset form
  Object.assign(paymentForm, {
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    setDefault: false,
  });
};

const viewInvoice = (invoiceId) => {
  console.log("View invoice:", invoiceId);
};

const downloadInvoice = (invoiceId) => {
  console.log("Download invoice:", invoiceId);
};

const downloadAllInvoices = () => {
  console.log("Download all invoices");
};

const saveBillingSettings = () => {
  console.log("Save billing settings:", { billingInfo, billingPreferences });
};
</script>

<style scoped>
/* Custom styles */
</style>
