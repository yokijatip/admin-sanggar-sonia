<template>
  <div class="container mx-auto">
    <!-- Header -->
    <div class="px-4 mb-6">
      <HeadersContent
        title="Feedback & Reviews"
        description="Share your thoughts and help us improve your experience"
      />
    </div>

    <div class="max-w-6xl mx-auto px-4 space-y-6">
      <!-- Feedback Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent class="p-6 text-center">
            <Star class="h-8 w-8 mx-auto mb-3 text-yellow-500" />
            <p class="text-2xl font-bold">{{ overallRating.toFixed(1) }}</p>
            <p class="text-sm text-muted-foreground">Overall Rating</p>
            <div class="flex justify-center mt-2">
              <div class="flex space-x-1">
                <Star
                  v-for="i in 5"
                  :key="i"
                  :class="
                    i <= Math.round(overallRating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300'
                  "
                  class="h-4 w-4"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6 text-center">
            <MessageSquare class="h-8 w-8 mx-auto mb-3 text-blue-500" />
            <p class="text-2xl font-bold">{{ feedbackStats.total }}</p>
            <p class="text-sm text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6 text-center">
            <TrendingUp class="h-8 w-8 mx-auto mb-3 text-green-500" />
            <p class="text-2xl font-bold">{{ feedbackStats.thisMonth }}</p>
            <p class="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6 text-center">
            <Clock class="h-8 w-8 mx-auto mb-3 text-purple-500" />
            <p class="text-2xl font-bold">
              {{ feedbackStats.avgResponseTime }}h
            </p>
            <p class="text-sm text-muted-foreground">Avg Response Time</p>
          </CardContent>
        </Card>
      </div>

      <!-- Feedback Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="showFeedbackModal = true"
        >
          <CardContent class="p-6 text-center">
            <MessageSquare class="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 class="text-lg font-medium mb-2">Share Feedback</h3>
            <p class="text-sm text-muted-foreground">
              Tell us about your experience with our platform
            </p>
            <Button class="mt-4 w-full">
              <Plus class="mr-2 h-4 w-4" />
              Write Review
            </Button>
          </CardContent>
        </Card>

        <Card
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="showSuggestionModal = true"
        >
          <CardContent class="p-6 text-center">
            <Lightbulb class="h-12 w-12 mx-auto mb-4 text-yellow-600" />
            <h3 class="text-lg font-medium mb-2">Suggest Feature</h3>
            <p class="text-sm text-muted-foreground">
              Have an idea for a new feature or improvement?
            </p>
            <Button class="mt-4 w-full" variant="outline">
              <Lightbulb class="mr-2 h-4 w-4" />
              Suggest Idea
            </Button>
          </CardContent>
        </Card>

        <Card
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="showBugReportModal = true"
        >
          <CardContent class="p-6 text-center">
            <Bug class="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h3 class="text-lg font-medium mb-2">Report Issue</h3>
            <p class="text-sm text-muted-foreground">
              Found a bug or having technical issues?
            </p>
            <Button class="mt-4 w-full" variant="outline">
              <Bug class="mr-2 h-4 w-4" />
              Report Bug
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Rating Breakdown -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <BarChart3 class="mr-2 h-5 w-5" />
            Rating Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="rating in ratingBreakdown"
              :key="rating.stars"
              class="flex items-center space-x-4"
            >
              <div class="flex items-center space-x-2 w-16">
                <span class="text-sm font-medium">{{ rating.stars }}</span>
                <Star class="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
              <div class="flex-1">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 bg-yellow-500 rounded-full transition-all duration-300"
                    :style="{ width: `${rating.percentage}%` }"
                  ></div>
                </div>
              </div>
              <div class="w-12 text-right">
                <span class="text-sm text-muted-foreground">{{
                  rating.count
                }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Feedback -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center">
              <MessageSquare class="mr-2 h-5 w-5" />
              Recent Feedback
            </CardTitle>
            <div class="flex gap-2">
              <Select v-model="feedbackFilter">
                <SelectTrigger class="w-48">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select v-model="categoryFilter">
                <SelectTrigger class="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="ui">User Interface</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <div
              v-for="feedback in filteredFeedback"
              :key="feedback.id"
              class="border rounded-lg p-6"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-4">
                  <div
                    class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <span class="font-medium text-gray-600">
                      {{ feedback.user.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <h4 class="font-medium">{{ feedback.user.name }}</h4>
                    <p class="text-sm text-muted-foreground">
                      {{ feedback.user.plan }} Plan
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="flex items-center space-x-1 mb-1">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      :class="
                        i <= feedback.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      "
                      class="h-4 w-4"
                    />
                  </div>
                  <p class="text-xs text-muted-foreground">
                    {{ formatRelativeTime(feedback.createdAt) }}
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <div class="flex items-center space-x-2 mb-2">
                  <Badge :variant="getCategoryVariant(feedback.category)">
                    {{ feedback.category }}
                  </Badge>
                  <Badge v-if="feedback.verified" variant="default">
                    <CheckCircle class="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                </div>
                <h3 class="font-medium mb-2">{{ feedback.title }}</h3>
                <p class="text-sm text-muted-foreground">
                  {{ feedback.message }}
                </p>
              </div>

              <!-- Admin Response -->
              <div
                v-if="feedback.response"
                class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <Shield class="h-4 w-4 text-blue-600" />
                  <span class="text-sm font-medium text-blue-800"
                    >Team Response</span
                  >
                  <span class="text-xs text-blue-600">{{
                    formatRelativeTime(feedback.response.createdAt)
                  }}</span>
                </div>
                <p class="text-sm text-blue-700">
                  {{ feedback.response.message }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between mt-4 pt-4 border-t">
                <div class="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="likeFeedback(feedback.id)"
                  >
                    <ThumbsUp
                      :class="
                        feedback.liked
                          ? 'text-blue-600 fill-blue-600'
                          : 'text-gray-500'
                      "
                      class="h-4 w-4 mr-1"
                    />
                    {{ feedback.likes }}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="shareFeedback(feedback.id)"
                  >
                    <Share2 class="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
                <div class="flex items-center space-x-2">
                  <Button
                    v-if="!feedback.response"
                    variant="outline"
                    size="sm"
                    @click="respondToFeedback(feedback.id)"
                  >
                    <Reply class="h-4 w-4 mr-1" />
                    Respond
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="viewFeedbackDetails(feedback.id)"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Feature Requests -->
      <Card class="mb-4">
        <CardHeader>
          <CardTitle class="flex items-center">
            <Lightbulb class="mr-2 h-5 w-5" />
            Popular Feature Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="request in popularFeatureRequests"
              :key="request.id"
              class="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex-1">
                <h4 class="font-medium mb-1">{{ request.title }}</h4>
                <p class="text-sm text-muted-foreground mb-2">
                  {{ request.description }}
                </p>
                <div class="flex items-center space-x-4">
                  <Badge :variant="getStatusVariant(request.status)">
                    {{ request.status }}
                  </Badge>
                  <span class="text-xs text-muted-foreground">
                    Requested {{ formatRelativeTime(request.createdAt) }}
                  </span>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-center">
                  <div class="text-lg font-bold">{{ request.votes }}</div>
                  <div class="text-xs text-muted-foreground">votes</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  @click="voteFeatureRequest(request.id)"
                >
                  <ThumbsUp
                    :class="
                      request.voted
                        ? 'text-blue-600 fill-blue-600'
                        : 'text-gray-500'
                    "
                    class="h-4 w-4"
                  />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Feedback Modal -->
    <Dialog v-model:open="showFeedbackModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve our platform for everyone
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="submitFeedback" class="space-y-6">
          <!-- Rating -->
          <div class="text-center">
            <Label class="text-base font-medium"
              >How would you rate your overall experience?</Label
            >
            <div class="flex justify-center space-x-2 mt-3">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                @click="feedbackForm.rating = i"
                class="p-1"
              >
                <Star
                  :class="
                    i <= feedbackForm.rating
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300 hover:text-yellow-400'
                  "
                  class="h-8 w-8 transition-colors"
                />
              </button>
            </div>
            <p class="text-sm text-muted-foreground mt-2">
              {{ getRatingLabel(feedbackForm.rating) }}
            </p>
          </div>

          <!-- Category -->
          <div>
            <Label for="feedbackCategory">Category</Label>
            <Select v-model="feedbackForm.category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Feedback</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="ui">User Interface</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Title -->
          <div>
            <Label for="feedbackTitle">Title</Label>
            <Input
              id="feedbackTitle"
              v-model="feedbackForm.title"
              placeholder="Brief summary of your feedback"
              required
            />
          </div>

          <!-- Message -->
          <div>
            <Label for="feedbackMessage">Your Feedback</Label>
            <Textarea
              id="feedbackMessage"
              v-model="feedbackForm.message"
              placeholder="Please share your detailed feedback, suggestions, or report any issues you've encountered..."
              rows="5"
              required
            />
          </div>

          <!-- Additional Options -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <Checkbox id="allowContact" v-model="feedbackForm.allowContact" />
              <Label for="allowContact" class="text-sm">
                Allow us to contact you for follow-up questions
              </Label>
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox id="makePublic" v-model="feedbackForm.makePublic" />
              <Label for="makePublic" class="text-sm">
                Make this feedback public (your name will be displayed)
              </Label>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" @click="showFeedbackModal = false">
            Cancel
          </Button>
          <Button @click="submitFeedback">
            <Send class="mr-2 h-4 w-4" />
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Feature Suggestion Modal -->
    <Dialog v-model:open="showSuggestionModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Suggest a Feature</DialogTitle>
          <DialogDescription>
            Have an idea that could make our platform better? We'd love to hear
            it!
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="submitSuggestion" class="space-y-4">
          <div>
            <Label for="suggestionTitle">Feature Title</Label>
            <Input
              id="suggestionTitle"
              v-model="suggestionForm.title"
              placeholder="What feature would you like to see?"
              required
            />
          </div>
          <div>
            <Label for="suggestionDescription">Description</Label>
            <Textarea
              id="suggestionDescription"
              v-model="suggestionForm.description"
              placeholder="Describe your feature idea in detail. How would it work? What problem would it solve?"
              rows="4"
              required
            />
          </div>
          <div>
            <Label for="suggestionUseCase">Use Case</Label>
            <Textarea
              id="suggestionUseCase"
              v-model="suggestionForm.useCase"
              placeholder="How would you use this feature? Provide a specific example or scenario."
              rows="3"
              required
            />
          </div>
          <div>
            <Label for="suggestionPriority">Priority</Label>
            <Select v-model="suggestionForm.priority" required>
              <SelectTrigger>
                <SelectValue placeholder="How important is this feature?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Nice to have</SelectItem>
                <SelectItem value="medium">Would be helpful</SelectItem>
                <SelectItem value="high">Really need this</SelectItem>
                <SelectItem value="critical">Can't work without it</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" @click="showSuggestionModal = false">
            Cancel
          </Button>
          <Button @click="submitSuggestion">
            <Lightbulb class="mr-2 h-4 w-4" />
            Submit Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Bug Report Modal -->
    <Dialog v-model:open="showBugReportModal">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Report a Bug</DialogTitle>
          <DialogDescription>
            Help us fix issues by providing detailed information about the
            problem
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="submitBugReport" class="space-y-4">
          <div>
            <Label for="bugTitle">Issue Summary</Label>
            <Input
              id="bugTitle"
              v-model="bugReportForm.title"
              placeholder="Brief description of the issue"
              required
            />
          </div>
          <div>
            <Label for="bugDescription">Detailed Description</Label>
            <Textarea
              id="bugDescription"
              v-model="bugReportForm.description"
              placeholder="What happened? What did you expect to happen instead?"
              rows="4"
              required
            />
          </div>
          <div>
            <Label for="bugSteps">Steps to Reproduce</Label>
            <Textarea
              id="bugSteps"
              v-model="bugReportForm.steps"
              placeholder="1. Go to... 
2. Click on...
3. See error..."
              rows="4"
              required
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="bugBrowser">Browser</Label>
              <Select v-model="bugReportForm.browser">
                <SelectTrigger>
                  <SelectValue placeholder="Select browser" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chrome">Chrome</SelectItem>
                  <SelectItem value="firefox">Firefox</SelectItem>
                  <SelectItem value="safari">Safari</SelectItem>
                  <SelectItem value="edge">Edge</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label for="bugSeverity">Severity</Label>
              <Select v-model="bugReportForm.severity" required>
                <SelectTrigger>
                  <SelectValue placeholder="How severe is this issue?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                  <SelectItem value="medium"
                    >Medium - Affects functionality</SelectItem
                  >
                  <SelectItem value="high"
                    >High - Blocks important tasks</SelectItem
                  >
                  <SelectItem value="critical"
                    >Critical - System unusable</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label for="bugAttachment">Screenshots/Videos (Optional)</Label>
            <Input
              id="bugAttachment"
              type="file"
              multiple
              accept="image/*,video/*"
            />
            <p class="text-xs text-muted-foreground mt-1">
              Attach screenshots or videos to help us understand the issue
              better
            </p>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" @click="showBugReportModal = false">
            Cancel
          </Button>
          <Button @click="submitBugReport">
            <Bug class="mr-2 h-4 w-4" />
            Submit Bug Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import HeadersContent from "~/components/ui/HeadersContent.vue";
import { ref, computed, reactive } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  MessageSquare,
  TrendingUp,
  Clock,
  Plus,
  Lightbulb,
  Bug,
  BarChart3,
  CheckCircle,
  Shield,
  ThumbsUp,
  Share2,
  Reply,
  Eye,
  Send,
} from "lucide-vue-next";

definePageMeta({
  middleware: "auth",
});

// State
const showFeedbackModal = ref(false);
const showSuggestionModal = ref(false);
const showBugReportModal = ref(false);
const feedbackFilter = ref("all");
const categoryFilter = ref("all");

// Stats
const overallRating = ref(4.6);
const feedbackStats = ref({
  total: 1247,
  thisMonth: 89,
  avgResponseTime: 4.2,
});

// Rating breakdown
const ratingBreakdown = ref([
  { stars: 5, count: 892, percentage: 71.6 },
  { stars: 4, count: 234, percentage: 18.8 },
  { stars: 3, count: 78, percentage: 6.3 },
  { stars: 2, count: 28, percentage: 2.2 },
  { stars: 1, count: 15, percentage: 1.2 },
]);

// Recent feedback
const recentFeedback = ref([
  {
    id: "1",
    user: {
      name: "Ahmad Rizki",
      plan: "Professional",
    },
    rating: 5,
    category: "general",
    title: "Excellent platform for managing our bakery!",
    message:
      "We've been using Dlillah for 6 months now and it has completely transformed how we manage orders and customers. The interface is intuitive and the features are exactly what we needed.",
    verified: true,
    likes: 12,
    liked: false,
    createdAt: "2024-01-16T10:30:00Z",
    response: {
      message:
        "Thank you so much for your wonderful feedback! We're thrilled to hear that Dlillah has made such a positive impact on your bakery operations. Your success is our motivation!",
      createdAt: "2024-01-16T14:20:00Z",
    },
  },
  {
    id: "2",
    user: {
      name: "Siti Nurhaliza",
      plan: "Starter",
    },
    rating: 4,
    category: "feature",
    title: "Love the analytics, but need more customization",
    message:
      "The analytics dashboard is great for tracking sales trends. However, I'd love to see more customizable reports and the ability to export data in different formats.",
    verified: true,
    likes: 8,
    liked: true,
    createdAt: "2024-01-15T16:45:00Z",
    response: null,
  },
  {
    id: "3",
    user: {
      name: "Budi Santoso",
      plan: "Enterprise",
    },
    rating: 5,
    category: "ui",
    title: "Clean and user-friendly interface",
    message:
      "The new UI updates are fantastic! Everything feels more modern and it's much easier to navigate. Our team adapted to the changes quickly.",
    verified: true,
    likes: 15,
    liked: false,
    createdAt: "2024-01-14T09:20:00Z",
    response: {
      message:
        "We're so happy you love the new interface! Our design team worked hard to make it more intuitive. Thank you for the positive feedback!",
      createdAt: "2024-01-14T11:30:00Z",
    },
  },
  {
    id: "4",
    user: {
      name: "Maya Sari",
      plan: "Professional",
    },
    rating: 3,
    category: "performance",
    title: "Good features but can be slow sometimes",
    message:
      "The platform has all the features we need, but during peak hours (especially evenings), the system becomes quite slow. This affects our order processing speed.",
    verified: true,
    likes: 6,
    liked: false,
    createdAt: "2024-01-13T20:15:00Z",
    response: {
      message:
        "Thank you for bringing this to our attention. We're actively working on performance improvements and server optimizations. We'll keep you updated on our progress!",
      createdAt: "2024-01-14T08:45:00Z",
    },
  },
]);

// Popular feature requests
const popularFeatureRequests = ref([
  {
    id: "1",
    title: "Mobile App for Customers",
    description: "Native mobile app for customers to place orders directly",
    status: "in_development",
    votes: 156,
    voted: true,
    createdAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "2",
    title: "Advanced Inventory Management",
    description:
      "Real-time inventory tracking with low stock alerts and automatic reordering",
    status: "planned",
    votes: 134,
    voted: false,
    createdAt: "2024-01-08T11:20:00Z",
  },
  {
    id: "3",
    title: "Integration with Accounting Software",
    description:
      "Direct integration with popular accounting software like Accurate and Jurnal",
    status: "under_review",
    votes: 98,
    voted: true,
    createdAt: "2024-01-05T09:45:00Z",
  },
  {
    id: "4",
    title: "WhatsApp Order Notifications",
    description: "Send order confirmations and updates via WhatsApp",
    status: "completed",
    votes: 87,
    voted: false,
    createdAt: "2023-12-20T16:30:00Z",
  },
]);

// Forms
const feedbackForm = reactive({
  rating: 0,
  category: "",
  title: "",
  message: "",
  allowContact: true,
  makePublic: false,
});

const suggestionForm = reactive({
  title: "",
  description: "",
  useCase: "",
  priority: "",
});

const bugReportForm = reactive({
  title: "",
  description: "",
  steps: "",
  browser: "",
  severity: "",
});

// Computed
const filteredFeedback = computed(() => {
  let filtered = recentFeedback.value;

  if (feedbackFilter.value !== "all") {
    filtered = filtered.filter(
      (feedback) => feedback.rating.toString() === feedbackFilter.value
    );
  }

  if (categoryFilter.value !== "all") {
    filtered = filtered.filter(
      (feedback) => feedback.category === categoryFilter.value
    );
  }

  return filtered;
});

// Methods
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const getCategoryVariant = (category) => {
  switch (category) {
    case "general":
      return "default";
    case "feature":
      return "secondary";
    case "bug":
      return "destructive";
    case "ui":
      return "outline";
    case "performance":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case "completed":
      return "default";
    case "in_development":
      return "secondary";
    case "planned":
      return "outline";
    case "under_review":
      return "secondary";
    default:
      return "outline";
  }
};

const getRatingLabel = (rating) => {
  switch (rating) {
    case 5:
      return "Excellent! 🌟";
    case 4:
      return "Very Good! 😊";
    case 3:
      return "Good 👍";
    case 2:
      return "Fair 😐";
    case 1:
      return "Poor 😞";
    default:
      return "Select a rating";
  }
};

// Actions
const submitFeedback = () => {
  console.log("Submitting feedback:", feedbackForm);
  showFeedbackModal.value = false;
  // Reset form
  Object.assign(feedbackForm, {
    rating: 0,
    category: "",
    title: "",
    message: "",
    allowContact: true,
    makePublic: false,
  });
};

const submitSuggestion = () => {
  console.log("Submitting suggestion:", suggestionForm);
  showSuggestionModal.value = false;
  // Reset form
  Object.assign(suggestionForm, {
    title: "",
    description: "",
    useCase: "",
    priority: "",
  });
};

const submitBugReport = () => {
  console.log("Submitting bug report:", bugReportForm);
  showBugReportModal.value = false;
  // Reset form
  Object.assign(bugReportForm, {
    title: "",
    description: "",
    steps: "",
    browser: "",
    severity: "",
  });
};

const likeFeedback = (feedbackId) => {
  const feedback = recentFeedback.value.find((f) => f.id === feedbackId);
  if (feedback) {
    if (feedback.liked) {
      feedback.likes--;
      feedback.liked = false;
    } else {
      feedback.likes++;
      feedback.liked = true;
    }
  }
};

const shareFeedback = (feedbackId) => {
  console.log("Share feedback:", feedbackId);
};

const respondToFeedback = (feedbackId) => {
  console.log("Respond to feedback:", feedbackId);
};

const viewFeedbackDetails = (feedbackId) => {
  console.log("View feedback details:", feedbackId);
};

const voteFeatureRequest = (requestId) => {
  const request = popularFeatureRequests.value.find((r) => r.id === requestId);
  if (request) {
    if (request.voted) {
      request.votes--;
      request.voted = false;
    } else {
      request.votes++;
      request.voted = true;
    }
  }
};
</script>

<style scoped>
/* Custom styles */
</style>
