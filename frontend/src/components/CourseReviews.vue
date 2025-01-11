<template>
  <div class="space-y-8">
    <!-- Review Form -->
    <div v-if="canReview" class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
      <form @submit.prevent="submitReview" class="space-y-4">
        <div>
          <div class="flex items-center space-x-2 mb-2">
            <template v-for="i in 5" :key="i">
              <button
                type="button"
                @click="rating = i"
                class="text-2xl focus:outline-none"
              >
                <i
                  class="fas fa-star"
                  :class="[
                    i <= rating ? 'text-yellow-400' : 'text-gray-300'
                  ]"
                ></i>
              </button>
            </template>
          </div>
          <p class="text-sm text-gray-500">
            {{ ratingText }}
          </p>
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            v-model="title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Summarize your review"
            required
          />
        </div>

        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700">
            Review
          </label>
          <textarea
            id="comment"
            v-model="comment"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Share your experience with this course"
            required
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!isValidReview"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>

    <!-- Reviews List -->
    <div class="space-y-6">
      <h3 class="text-lg font-medium text-gray-900">
        Reviews ({{ reviews?.length || 0 }})
      </h3>

      <div v-if="!reviews?.length" class="text-center py-8">
        <i class="fas fa-comments text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-600">No reviews yet. Be the first to review!</p>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="review in sortedReviews"
          :key="review.id"
          class="bg-white rounded-lg shadow p-6"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img
                    :src="review.user.photoURL || '/default-avatar.png'"
                    :alt="review.user.name"
                    class="h-10 w-10 rounded-full"
                  />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ review.user.name }}
                  </p>
                  <div class="flex items-center mt-1">
                    <div class="flex items-center">
                      <template v-for="i in 5" :key="i">
                        <i
                          class="fas fa-star text-sm"
                          :class="[
                            i <= review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          ]"
                        ></i>
                      </template>
                    </div>
                    <span class="ml-2 text-sm text-gray-500">
                      {{ formatDate(review.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-base font-medium text-gray-900">
                  {{ review.title }}
                </p>
                <p class="mt-1 text-sm text-gray-600">
                  {{ review.comment }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  reviews: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['new-review'])

const authStore = useAuthStore()

// Form state
const rating = ref(0)
const title = ref('')
const comment = ref('')

// Computed properties
const canReview = computed(() => {
  return authStore.user && !props.reviews.find(r => r.userId === authStore.user.uid)
})

const ratingText = computed(() => {
  const texts = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  }
  return rating.value ? texts[rating.value] : 'Select a rating'
})

const isValidReview = computed(() => {
  return rating.value > 0 && title.value.trim() && comment.value.trim()
})

const sortedReviews = computed(() => {
  return [...props.reviews].sort((a, b) => b.createdAt - a.createdAt)
})

// Methods
const submitReview = () => {
  if (!isValidReview.value) return

  const review = {
    rating: rating.value,
    title: title.value.trim(),
    comment: comment.value.trim(),
    userId: authStore.user.uid,
    user: {
      name: authStore.user.displayName,
      photoURL: authStore.user.photoURL
    },
    createdAt: Date.now()
  }

  emit('new-review', review)

  // Reset form
  rating.value = 0
  title.value = ''
  comment.value = ''
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}
</style>
