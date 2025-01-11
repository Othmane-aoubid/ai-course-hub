<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">AI Learning Assistant</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get personalized help with your courses, learning path, and technical questions.
          </p>
        </div>
        
        <!-- Chat Messages -->
        <div class="p-6 flex-1 overflow-y-auto bg-white dark:bg-gray-800" ref="chatContainer" style="height: 500px;">
          <div v-if="messages.length === 0" class="text-center text-gray-500 dark:text-gray-400">
            <i class="fas fa-robot text-4xl mb-2"></i>
            <p>Start a conversation with your AI Learning Assistant</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="(message, index) in messages" :key="index"
                 :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
              <div :class="[
                'max-w-[70%] rounded-lg p-4',
                message.role === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
              ]">
                <div class="text-sm" v-html="formatMessage(message.content)"></div>
              </div>
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex justify-start mt-4">
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 rounded-bl-none">
              <div class="typing-indicator">
                <span class="dark:bg-gray-400"></span>
                <span class="dark:bg-gray-400"></span>
                <span class="dark:bg-gray-400"></span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Input Area -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <form @submit.prevent="sendMessage" class="flex space-x-4">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Ask anything..."
              class="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
          
          <!-- Suggestion Chips -->
          <div v-if="messages.length === 0" class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="(suggestion, index) in suggestions"
              :key="index"
              @click="() => usesuggestion(suggestion)"
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useCourseStore } from '../stores/courses'

const courseStore = useCourseStore()
const chatContainer = ref(null)
const messages = ref([])
const newMessage = ref('')
const isTyping = ref(false)

const suggestions = [
  "What courses do you recommend for beginners?",
  "Help me create a study plan",
  "Explain a difficult concept",
  "Give me learning tips",
  "Track my progress"
]

const formatMessage = (content) => {
  // Convert URLs to clickable links
  return content.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" class="text-blue-500 dark:text-blue-400 hover:underline">$1</a>'
  )
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const simulateTyping = async (response) => {
  isTyping.value = true
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
  messages.value.push({ role: 'assistant', content: response })
  isTyping.value = false
  await scrollToBottom()
}

const generateResponse = async (userMessage) => {
  // Here you would typically make an API call to your AI service
  // For now, we'll simulate some responses
  const responses = {
    courses: "Based on your interests, I recommend starting with our foundational courses. Would you like me to suggest a specific learning path?",
    plan: "I'll help you create a personalized study plan. What are your learning goals and how much time can you dedicate to studying each week?",
    concept: "I'll break down complex concepts into simpler terms. Which specific topic would you like me to explain?",
    tips: "Here are some effective learning strategies:\n1. Practice actively\n2. Break down complex topics\n3. Teach others\n4. Take regular breaks\n5. Review material periodically",
    progress: "I can help you track your learning progress. Would you like to see your course completion rates or set new learning goals?"
  }
  
  const lowercaseMessage = userMessage.toLowerCase()
  let response = "I'm here to help! Could you please be more specific about what you'd like to know?"
  
  if (lowercaseMessage.includes('course') || lowercaseMessage.includes('learn')) {
    response = responses.courses
  } else if (lowercaseMessage.includes('plan') || lowercaseMessage.includes('schedule')) {
    response = responses.plan
  } else if (lowercaseMessage.includes('explain') || lowercaseMessage.includes('understand')) {
    response = responses.concept
  } else if (lowercaseMessage.includes('tip') || lowercaseMessage.includes('help')) {
    response = responses.tips
  } else if (lowercaseMessage.includes('progress') || lowercaseMessage.includes('track')) {
    response = responses.progress
  }
  
  return response
}

const sendMessage = async () => {
  const message = newMessage.value.trim()
  if (!message || isTyping.value) return
  
  messages.value.push({ role: 'user', content: message })
  newMessage.value = ''
  await scrollToBottom()
  
  const response = await generateResponse(message)
  await simulateTyping(response)
}

const usesuggestion = async (suggestion) => {
  newMessage.value = suggestion
  await sendMessage()
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

onMounted(() => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})
</script>

<style scoped>
.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #9CA3AF;
  border-radius: 50%;
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
    transform: scale(1.0);
  }
}
</style>
