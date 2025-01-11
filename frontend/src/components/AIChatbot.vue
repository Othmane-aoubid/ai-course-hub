<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Chat Button -->
    <button
      v-if="!isChatOpen"
      @click="toggleChat"
      class="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <i class="fas fa-robot text-xl"></i>
    </button>

    <!-- Chat Window -->
    <div
      v-else
      class="w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col"
    >
      <!-- Chat Header -->
      <div class="flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-t-lg">
        <div class="flex items-center space-x-2">
          <i class="fas fa-robot text-xl"></i>
          <span class="font-medium">AI Learning Assistant</span>
        </div>
        <button @click="toggleChat" class="text-white hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'max-w-[75%] rounded-lg p-3',
            message.type === 'user'
              ? 'ml-auto bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'
          ]"
        >
          <div class="flex items-start space-x-2">
            <div v-if="message.type === 'bot'" class="flex-shrink-0">
              <i class="fas fa-robot text-blue-600"></i>
            </div>
            <div>
              <div class="text-sm" v-html="formatMessage(message.content)"></div>
              <div
                v-if="message.suggestions && message.suggestions.length > 0"
                class="mt-2 space-y-1"
              >
                <button
                  v-for="(suggestion, sIndex) in message.suggestions"
                  :key="sIndex"
                  @click="handleSuggestion(suggestion)"
                  class="block text-xs text-left hover:bg-blue-700 rounded px-2 py-1 w-full"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isTyping" class="flex items-center space-x-2">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="px-4 py-2 border-t border-gray-200">
        <div class="flex space-x-2 overflow-x-auto pb-2">
          <button
            v-for="action in quickActions"
            :key="action"
            @click="handleQuickAction(action)"
            class="flex-shrink-0 px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
          >
            {{ action }}
          </button>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="p-4 border-t border-gray-200">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Ask me anything..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="isTyping"
          >
          <button
            type="submit"
            :disabled="!newMessage.trim() || isTyping"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useCourseStore } from '../stores/courses'
import { useUserStore } from '../stores/user'
import marked from 'marked'
import DOMPurify from 'dompurify'

const courseStore = useCourseStore()
const userStore = useUserStore()

const isChatOpen = ref(false)
const newMessage = ref('')
const isTyping = ref(false)
const messages = ref([])
const messagesContainer = ref(null)

const quickActions = [
  'Course Recommendations',
  'Learning Progress',
  'Technical Help',
  'Study Tips'
]

// Welcome message with suggestions
const welcomeMessage = {
  type: 'bot',
  content: 'Hello! I\'m your AI Learning Assistant. How can I help you today?',
  suggestions: [
    'Recommend a course for me',
    'Show my learning progress',
    'Help me with a technical problem',
    'Give me study tips'
  ]
}

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
  if (isChatOpen.value && messages.value.length === 0) {
    messages.value.push(welcomeMessage)
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessage = (content) => {
  // Convert markdown to HTML and sanitize
  return DOMPurify.sanitize(marked(content))
}

const handleSuggestion = async (suggestion) => {
  newMessage.value = suggestion
  await sendMessage()
}

const handleQuickAction = async (action) => {
  newMessage.value = action
  await sendMessage()
}

const processAIResponse = async (userMessage) => {
  isTyping.value = true
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1000))

  let response = {
    type: 'bot',
    content: '',
    suggestions: []
  }

  // Process different types of queries
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
    const userPreferences = await userStore.getUserPreferences()
    response.content = `Based on your interests in ${userPreferences.categories.join(', ')}, here are some course recommendations:`
    response.content += '\n\n1. Advanced JavaScript Development\n2. Machine Learning Fundamentals\n3. Cloud Computing Essentials'
    response.suggestions = ['Tell me more about JavaScript', 'Show Machine Learning courses', 'What\'s new in Cloud Computing?']
  }
  else if (lowerMessage.includes('progress') || lowerMessage.includes('learning')) {
    const progress = await courseStore.getUserProgress(userStore.user.uid)
    response.content = `Here's your learning progress:\n\n- Completed Courses: ${progress.completed}\n- In Progress: ${progress.inProgress}\n- Average Completion Rate: ${progress.averageRate}%`
    response.suggestions = ['Show detailed progress', 'What should I learn next?', 'Set learning goals']
  }
  else if (lowerMessage.includes('technical') || lowerMessage.includes('problem')) {
    response.content = 'I can help you with technical issues. What specific problem are you facing?'
    response.suggestions = ['Course playback issues', 'Download problems', 'Mobile app sync', 'Account settings']
  }
  else if (lowerMessage.includes('study') || lowerMessage.includes('tips')) {
    response.content = '📚 Here are some effective study tips:\n\n1. Set specific learning goals\n2. Use the Pomodoro Technique\n3. Take active notes\n4. Practice regularly\n5. Join study groups'
    response.suggestions = ['More study techniques', 'Time management tips', 'How to stay motivated']
  }
  else {
    response.content = 'I\'m here to help! Would you like to:'
    response.suggestions = [
      'Get course recommendations',
      'Check your progress',
      'Get technical support',
      'Learn study techniques'
    ]
  }

  isTyping.value = false
  return response
}

const sendMessage = async () => {
  const message = newMessage.value.trim()
  if (!message) return

  // Add user message
  messages.value.push({
    type: 'user',
    content: message
  })
  newMessage.value = ''
  await scrollToBottom()

  // Get and add AI response
  const response = await processAIResponse(message)
  messages.value.push(response)
  await scrollToBottom()
}

// Watch for new messages and scroll to bottom
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// Clean up on unmount
onMounted(() => {
  // Initialize any necessary resources
})
</script>

<style scoped>
.typing-indicator {
  display: flex;
  align-items: center;
  padding: 8px;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  background-color: #90cdf4;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
