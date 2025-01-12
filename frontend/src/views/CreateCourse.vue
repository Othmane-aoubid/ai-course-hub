<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Create New Course</h1>
      
      <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
        <!-- Basic Information -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h2>
          
          <div class="mt-4 space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Course Title *</label>
              <input
                v-model="courseData.title"
                type="text"
                placeholder="Enter course title"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">AI Description *</label>
              <textarea
                v-model="courseData.aiDescription"
                rows="4"
                placeholder="Enter detailed course description for AI understanding"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                required
              ></textarea>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category *</label>
              <select
                v-model="courseData.category"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="" class="dark:bg-gray-700">Select category</option>
                <option value="Programming" class="dark:bg-gray-700">Programming</option>
                <option value="Design" class="dark:bg-gray-700">Design</option>
                <option value="Business" class="dark:bg-gray-700">Business</option>
                <option value="Marketing" class="dark:bg-gray-700">Marketing</option>
                <option value="Personal Development" class="dark:bg-gray-700">Personal Development</option>
                <option value="Other" class="dark:bg-gray-700">Other</option>
              </select>
            </div>

            <!-- Level -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Level *</label>
              <select
                v-model="courseData.difficulty"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="beginner" class="dark:bg-gray-700">Beginner</option>
                <option value="intermediate" class="dark:bg-gray-700">Intermediate</option>
                <option value="advanced" class="dark:bg-gray-700">Advanced</option>
              </select>
            </div>

            <!-- Duration -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Duration (hours) *</label>
              <input
                v-model="courseData.duration"
                type="number"
                min="0"
                step="0.5"
                placeholder="Enter course duration in hours"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            <!-- Price -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Price ($) *</label>
              <input
                v-model="courseData.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter course price"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            <!-- Course Image -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Course Image *</label>
              <input
                type="file"
                @change="handleImageUpload"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <p v-if="courseData.imageUrl" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Selected image: {{ courseData.imageUrl.split('/').pop() }}
              </p>
              <img 
                v-if="courseData.imageUrl" 
                :src="courseData.imageUrl" 
                alt="Course preview" 
                class="mt-2 w-48 h-32 object-cover rounded-lg"
              />
            </div>

            <!-- Instructor -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Instructor Name</label>
              <input
                v-model="courseData.instructor"
                type="text"
                placeholder="Enter instructor name"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Status *</label>
              <select
                v-model="courseData.status"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="draft" class="dark:bg-gray-700">Draft</option>
                <option value="published" class="dark:bg-gray-700">Published</option>
              </select>
            </div>

            <!-- Target Audience -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Target Audience</label>
              <select
                v-model="courseData.targetAudience"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="" class="dark:bg-gray-700">Select audience</option>
                <option value="Beginners" class="dark:bg-gray-700">Beginners</option>
                <option value="Professionals" class="dark:bg-gray-700">Professionals</option>
                <option value="Everyone" class="dark:bg-gray-700">Everyone</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Course Generation -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Course Content</h2>
            <div class="space-x-4">
              <button
                type="button"
                @click="generateQuiz"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isGeneratingQuiz"
              >
                Generate Quiz
              </button>
              <button
                type="button"
                @click="generateCourseOutline"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isGenerating || !aiTopic"
              >
                Generate Course
              </button>
              <button
                v-if="isGenerating"
                type="button"
                @click="cancelGeneration"
                class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Cancel Generation
              </button>
              <button
                type="button"
                @click="loadTestCourse"
                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Load Test Course
              </button>
            </div>
          </div>

          <!-- Number of Sections -->
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Number of Sections</label>
            <input
              v-model="numberOfSections"
              type="number"
              min="1"
              max="10"
              class="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Generation Progress -->
          <div v-if="isGenerating" class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Generating section {{ currentSection }} of {{ numberOfSections }}
              </span>
              <span class="text-sm font-medium text-blue-600">
                {{ Math.round((currentSection / numberOfSections) * 100) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                :style="{ width: `${(currentSection / numberOfSections) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Generated Content -->
          <div v-if="generatedContent.length > 0" class="mt-6 space-y-4">
            <div v-for="(section, index) in generatedContent" :key="index" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">Section {{ index + 1 }}: {{ section.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ section.content }}</p>
              <div class="mt-2 space-y-2">
                <div v-if="section.keyPoints?.length" class="text-sm">
                  <strong>Key Points:</strong>
                  <ul class="list-disc pl-5 mt-1">
                    <li v-for="point in section.keyPoints" :key="point" class="text-gray-600 dark:text-gray-400">
                      {{ point }}
                    </li>
                  </ul>
                </div>
                <div v-if="section.examples?.length" class="text-sm">
                  <strong>Examples:</strong>
                  <div v-for="example in section.examples" :key="example" class="mt-1 pl-5 text-gray-600 dark:text-gray-400">
                    {{ example }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="generationStatus" class="mt-4">
            <div v-if="generationStatus.type === 'success'" class="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 rounded-lg">
              {{ generationStatus.message }}
            </div>
            <div v-if="generationStatus.type === 'error'" class="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 rounded-lg">
              {{ generationStatus.message }}
            </div>
          </div>

          <!-- Topic Input -->
          <div class="mt-4">
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Course Topic</label>
            <input
              v-model="aiTopic"
              type="text"
              placeholder="Enter the course topic for AI generation"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Generation Status -->
          <div v-if="generationStatus" class="mt-4 p-4 rounded-lg" :class="generationStatus.type === 'error' ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'">
            <p :class="generationStatus.type === 'error' ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'">
              {{ generationStatus.message }}
            </p>
            <button
              v-if="generationStatus.type === 'success' && generatedOutline"
              @click="showPreview = !showPreview"
              class="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
            </button>
          </div>

          <!-- Generated Course Preview -->
          <div v-if="showPreview && generatedOutline && generatedOutline.sections" class="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Generated Course Content</h3>
            <div class="space-y-4">
              <div v-for="(section, index) in generatedOutline.sections" :key="index" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 class="font-medium text-gray-800 dark:text-gray-200">{{ section.title }}</h4>
                <p class="mt-2 text-gray-600 dark:text-gray-400">{{ section.content }}</p>
                
                <!-- Key Points -->
                <div v-if="section.keyPoints?.length" class="mt-4">
                  <h5 class="font-medium text-gray-700 dark:text-gray-300">Key Points:</h5>
                  <ul class="list-disc pl-5 mt-2">
                    <li v-for="point in section.keyPoints" :key="point" class="text-gray-600 dark:text-gray-400">
                      {{ point }}
                    </li>
                  </ul>
                </div>

                <!-- Examples -->
                <div v-if="section.examples?.length" class="mt-4">
                  <h5 class="font-medium text-gray-700 dark:text-gray-300">Examples:</h5>
                  <ul class="list-disc pl-5 mt-2">
                    <li v-for="example in section.examples" :key="example" class="text-gray-600 dark:text-gray-400">
                      {{ example }}
                    </li>
                  </ul>
                </div>

                <!-- Best Practices -->
                <div v-if="section.bestPractices?.length" class="mt-4">
                  <h5 class="font-medium text-gray-700 dark:text-gray-300">Best Practices:</h5>
                  <ul class="list-disc pl-5 mt-2">
                    <li v-for="practice in section.bestPractices" :key="practice" class="text-gray-600 dark:text-gray-400">
                      {{ practice }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="mt-4 flex justify-end">
              <button
                @click="useGeneratedOutline"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Use This Content
              </button>
            </div>
          </div>
        </div>
        
        <!-- AI Chat Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Course Assistant</h2>
          
          <div class="space-y-4">
            <!-- Chat History -->
            <div class="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div v-for="(message, index) in chatHistory" :key="index" 
                class="flex space-x-3"
                :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div 
                  class="max-w-[80%] p-3 rounded-lg"
                  :class="message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'"
                >
                  {{ message.content }}
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="flex space-x-4">
              <input
                v-model="aiPrompt"
                type="text"
                placeholder="Ask AI to adjust or enhance your course content..."
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                @keyup.enter="sendAIPrompt"
              />
              <button
                @click="sendAIPrompt"
                :disabled="isAdjusting"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isAdjusting ? 'Adjusting...' : 'Send' }}
              </button>
            </div>

            <!-- Suggested Prompts -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(prompt, index) in suggestedPrompts"
                :key="index"
                @click="usePrompt(prompt)"
                class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {{ prompt }}
              </button>
            </div>
          </div>
        </div>

        <!-- Resources Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Course Resources</h2>
          
          <div class="space-y-4">
            <div v-for="(resource, index) in courseData.resources" :key="index" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1 space-y-4">
                  <input
                    v-model="resource.title"
                    type="text"
                    placeholder="Resource Title"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    v-model="resource.description"
                    rows="2"
                    placeholder="Resource Description"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  ></textarea>
                  
                  <div class="flex space-x-4">
                    <select
                      v-model="resource.type"
                      class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Type</option>
                      <option value="pdf">PDF</option>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                      <option value="link">Link</option>
                    </select>
                    
                    <div v-if="resource.type === 'link'" class="flex-1">
                      <input
                        v-model="resource.url"
                        type="url"
                        placeholder="Enter URL"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div v-else-if="resource.type" class="flex-1">
                      <input
                        type="file"
                        @change="(e) => handleResourceUpload(e, index)"
                        :accept="getAcceptedFileTypes(resource.type)"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  @click="removeResource(index)"
                  class="ml-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                >
                  Remove
                </button>
              </div>
              
              <!-- Preview section -->
              <div v-if="resource.url || resource.fileUrl" class="mt-4">
                <div v-if="resource.type === 'image'" class="w-48 h-32">
                  <img :src="resource.url || resource.fileUrl" :alt="resource.title" class="w-full h-full object-cover rounded-lg" />
                </div>
                <div v-else-if="resource.type === 'video'" class="w-full aspect-video">
                  <video 
                    :src="resource.url || resource.fileUrl" 
                    controls 
                    class="w-full h-full rounded-lg"
                  ></video>
                </div>
                <div v-else-if="resource.type === 'pdf' && resource.fileUrl" class="text-sm text-gray-600 dark:text-gray-400">
                  PDF uploaded: {{ resource.fileUrl.split('/').pop() }}
                </div>
                <div v-else-if="resource.type === 'link'" class="text-sm text-blue-600 dark:text-blue-400">
                  <a :href="resource.url" target="_blank" rel="noopener noreferrer">{{ resource.url }}</a>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              @click="addResource"
              class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-600 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-600 transition-colors duration-200"
            >
              Add Resource
            </button>
          </div>
        </div>
        <!-- Course Content -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Course Content</h2>
          
          <div v-if="generationStatus && generationStatus.type === 'error'" class="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 rounded-lg">
            {{ generationStatus.message }}
          </div>
          
          <div v-if="generationStatus && generationStatus.type === 'success'" class="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 rounded-lg">
            {{ generationStatus.message }}
          </div>
            
          <div class="space-y-4">
            <div v-for="(section, index) in courseData.sections" :key="index" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <input
                    v-model="section.title"
                    type="text"
                    placeholder="Section Title"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  @click="removeSection(index)"
                  class="ml-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                >
                  Remove
                </button>
              </div>
                
              <textarea
                v-model="section.content"
                rows="4"
                placeholder="Section Content"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              ></textarea>
            </div>
              
            <button
              type="button"
              @click="addSection"
              class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-600 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-600 transition-colors duration-200"
            >
              Add Section
            </button>
          </div>
        </div>

        <!-- Generated Quiz Section -->
        <div v-if="generatedQuiz" class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Generated Quiz</h2>
          <div class="space-y-4">
            <div v-for="(question, idx) in generatedQuiz" :key="idx" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <p class="font-medium mb-2">{{ question.question }}</p>
              <ul class="space-y-2">
                <li v-for="(option, optIdx) in question.options" :key="optIdx" class="flex items-center">
                  <input
                    type="radio"
                    :name="'question-'+idx"
                    :value="option"
                    :id="'question-'+idx+'-option-'+optIdx"
                    class="mr-2"
                  />
                  <label :for="'question-'+idx+'-option-'+optIdx">{{ option }}</label>
                </li>
              </ul>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Correct answer: {{ question.correctAnswer }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Creating Course...' : 'Create Course' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref as vueRef, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { useAuthStore } from '../stores/auth'
import { useCourseStore } from '../stores/courses'
import { aiService } from '../api/ai'

const router = useRouter()
const showPreview = vueRef(false)
const generatedOutline = vueRef(null)
const isSubmitting = vueRef(false)
const error = vueRef(null)
const isGenerating = vueRef(false)
const isGeneratingQuiz = vueRef(false)
const aiTopic = vueRef('')
const generationStatus = vueRef(null)
const generatedQuiz = vueRef(null)
const numberOfSections = vueRef(1)
const currentSection = vueRef(0)
const generatedContent = vueRef([])

const aiPrompt = vueRef('')
const isAdjusting = vueRef(false)
const chatHistory = vueRef([])

const suggestedPrompts = [
  "Make the content more beginner-friendly",
  "Add more practical examples",
  "Include more advanced topics",
  "Simplify the explanations",
  "Add more interactive exercises",
  "Focus more on best practices"
]

const courseData = reactive({
  title: '',
  aiDescription: '', // Detailed description for AI understanding
  difficulty: 'beginner',
  category: '',
  duration: '',
  price: '',
  imageUrl: '',
  instructor: '',
  status: 'draft',
  targetAudience: '',
  sections: [],
  prerequisites: [],
  learningObjectives: [],
  totalLessons: 0,
  completedLessons: [],
  enrolledCount: 0,
  rating: 0,
  reviews: [],
  lastUpdated: null,
  language: 'English',
  certificate: false,
  tags: [],
  quizzes: [],
  resources: [],
  syllabus: '',
  thumbnail: '',
  previewVideo: '',
  requirements: [],
  outcomes: [],
  featured: false,
  isPublished: false,
  publishDate: null,
  enrollmentStart: null,
  enrollmentEnd: null,
  courseStart: null,
  courseEnd: null,
  maxEnrollments: null,
  pricing: {
    regular: 0,
    sale: null,
    saleEndDate: null
  }
})

const initializeForm = () => {
  courseData.sections = [{
    title: '',
    content: '',
    duration: 0,
    order: 0,
    lessons: [],
    resources: [],
    quiz: null
  }]
  courseData.prerequisites = []
  courseData.learningObjectives = []
  courseData.requirements = []
  courseData.outcomes = []
  courseData.tags = []
  chatHistory.value = [] // Initialize chat history
}

onMounted(() => {
  initializeForm()
})

const processImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    courseData.imageFile = file
    try {
      console.log('Original image file:', file)
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log('Image data URL:', e.target.result.substring(0, 100) + '...')
        courseData.imageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    }
  }
}

const generateCourseOutline = async () => {
  try {
    const auth = getAuth()
    const user = auth.currentUser
    
    if (!user) {
      throw new Error('Please login to generate course outline')
    }

    isGenerating.value = true
    generationStatus.value = { type: 'info', message: 'Generating course outline...' }

    const prompt = `Create a detailed educational course outline for teaching "${aiTopic.value}" at a ${courseData.difficulty} level for ${courseData.targetAudience}. 
    Generate exactly ${numberOfSections.value} sections.
    This is for professional educational purposes only.
    
    For each section, include:
    1. A clear, descriptive title
    2. Detailed content explaining the concepts
    3. Key points to remember
    4. Practical examples
    5. Best practices where applicable
    
    Return a valid JSON response with the following structure:
    {
      "sections": [
        {
          "title": "Section Title",
          "content": "Detailed section content",
          "keyPoints": ["Key point 1", "Key point 2"],
          "examples": ["Example 1", "Example 2"],
          "bestPractices": ["Practice 1", "Practice 2"],
          "order": 1,
          "duration": 90,
          "lessons": [
            {
              "title": "Lesson Title",
              "content": "Lesson content",
              "duration": 30,
              "completed": false,
              "resources": [],
              "quiz": null
            }
          ]
        }
      ]
    }`;

    const data = await aiService.generateCourseContent({
      topic: aiTopic.value,
      difficulty: courseData.difficulty,
      targetAudience: courseData.targetAudience,
      numberOfSections: parseInt(numberOfSections.value) || 1,
      prompt
    })

    if (!data.sections || !Array.isArray(data.sections)) {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response format from server')
    }

    // Transform sections into modules
    courseData.sections = data.sections.map((section, index) => ({
      title: section.title || 'Untitled Section',
      content: section.content || '',
      duration: section.duration || 30,
      order: index + 1,
      lessons: [
        {
          title: section.title,
          content: `
# ${section.title}

${section.content}

## Key Points
${section.keyPoints.map(point => `- ${point}`).join('\n')}

## Examples
${section.examples.map(example => `- ${example}`).join('\n')}

${section.bestPractices?.length ? `
## Best Practices
${section.bestPractices.map(practice => `- ${practice}`).join('\n')}
` : ''}
`,
          duration: section.duration || 30,
          completed: false,
          resources: section.resources || [],
          quiz: section.quiz || null
        }
      ]
    }))

    // Update the preview content
    generatedContent.value = data.sections.map(section => ({
      title: section.title || 'Untitled Section',
      content: section.content || '',
      examples: section.examples || [],
      keyPoints: section.keyPoints || [],
      bestPractices: section.bestPractices || []
    }))

    generationStatus.value = { 
      type: 'success', 
      message: `Successfully generated ${data.sections.length} course sections!` 
    }
  } catch (error) {
    console.error('Error generating course outline:', error)
    generationStatus.value = { 
      type: 'error', 
      message: error.message || 'Failed to generate course outline'
    }
  } finally {
    isGenerating.value = false
  }
}

const generateQuiz = async () => {
  try {
    const auth = getAuth()
    const user = auth.currentUser
    
    if (!user) {
      throw new Error('Please login to generate quiz')
    }

    if (!courseData.sections.length) {
      throw new Error('Please add some course content before generating a quiz')
    }

    isGeneratingQuiz.value = true
    generationStatus.value = { type: 'info', message: 'Generating quiz questions...' }

    const response = await fetch('http://localhost:3000/api/ai/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        sections: courseData.sections,
        difficulty: courseData.difficulty,
        title: courseData.title
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate quiz')
    }

    const data = await response.json()
    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error('Invalid quiz data received from server')
    }
    
    generatedQuiz.value = data.questions
    generationStatus.value = { type: 'info', message: 'Quiz generated successfully!' }
  } catch (error) {
    console.error('Error generating quiz:', error)
    generationStatus.value = { type: 'error', message: error.message }
  } finally {
    isGeneratingQuiz.value = false
  }
}

const generateAIDescription = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/ai/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: courseData.title,
        category: courseData.category,
        difficulty: courseData.difficulty,
        targetAudience: courseData.targetAudience,
        maxLength: 300
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate description');
    }

    const data = await response.json();
    courseData.aiDescription = data.description;
    courseData.shortDescription = data.description;
  } catch (error) {
    console.error('Error generating description:', error);
    alert('Failed to generate course description. Please enter manually.');
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  isSubmitting.value = true;
  
  try {
    // Generate AI description if not already set
    if (!courseData.aiDescription) {
      await generateAIDescription();
    }
    
    let imageUrl = null;
    if (courseData.imageFile) {
      imageUrl = await processImage(courseData.imageFile);
    }
     // Process resources
     const processedResources = await Promise.all(
      courseData.resources.map(async (resource) => {
        if (resource.file) {
          const fileUrl = await processImage(resource.file) // You might want to create a separate function for different file types
          return {
            ...resource,
            fileUrl,
            file: null // Remove the file object before sending to the server
          }
        }
        return resource
      })
    )
    const courseDataToSubmit = {
      ...courseData,
      imageUrl: imageUrl,
      resources: processedResources,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quizzes: generatedQuiz.value || [] // Add generated quiz to the course data
    };
    
    delete courseDataToSubmit.imageFile;
    
    await addDoc(collection(db, 'courses'), courseDataToSubmit);
    
    router.push('/my-courses');
  } catch (error) {
    console.error('Error creating course:', error);
    alert('Failed to create course. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const useGeneratedOutline = () => {
  if (generatedOutline.value) {
    if (generatedOutline.value.title) {
      courseData.title = generatedOutline.value.title;
    }
    if (generatedOutline.value.description) {
      courseData.aiDescription = generatedOutline.value.description;
    }
    if (generatedOutline.value.sections) {
      courseData.sections = generatedOutline.value.sections;
    }
    
    generatedOutline.value = null;
    showPreview.value = false;
  }
}

const generateShortDescription = () => {
  // Implement logic to generate short description from AI description
  // For now, just truncate the AI description to 200 characters
  courseData.shortDescription = courseData.aiDescription.substring(0, 200);
}

const addSection = () => {
  courseData.sections.push({
    title: '',
    content: '',
    duration: 0,
    order: 0,
    lessons: [],
    resources: [],
    quiz: null
  })
}

const removeSection = (index) => {
  courseData.sections.splice(index, 1)
}

const cancelGeneration = () => {
  isGenerating.value = false
  isGeneratingQuiz.value = false
  generationStatus.value = null
  generatedOutline.value = null
  generatedQuiz.value = null
}

const loadTestCourse = () => {
  courseData.title = "Introduction to Python Programming"
  courseData.aiDescription = "A comprehensive course for beginners to learn Python programming from scratch. Learn the fundamentals, data structures, and build real projects."
  courseData.shortDescription = "Learn Python from scratch and build real projects."
  courseData.category = "Programming"
  courseData.difficulty = "beginner"
  courseData.duration = 20
  courseData.price = 49.99
  courseData.instructor = "John Doe"
  courseData.status = "published"
  courseData.targetAudience = "Beginners"
  courseData.language = "English"
  courseData.certificate = true
  courseData.tags = ["Python", "Programming", "Beginner", "Software Development"]
  
  courseData.prerequisites = [
    "Basic computer skills",
    "No prior programming experience required"
  ]
  
  courseData.learningObjectives = [
    "Understand Python fundamentals",
    "Work with data structures",
    "Create basic Python applications",
    "Debug and troubleshoot code"
  ]
  
  courseData.sections = [
    {
      title: "Getting Started with Python",
      content: "Learn the basics of Python programming and set up your development environment",
      duration: 2,
      order: 0,
      lessons: [
        {
          title: "Introduction to Python",
          content: "What is Python and why should you learn it",
          duration: 30,
          type: "video"
        },
        {
          title: "Setting Up Python",
          content: "Installing Python and VS Code",
          duration: 45,
          type: "video"
        }
      ],
      resources: [
        {
          title: "Python Installation Guide",
          type: "pdf",
          url: "https://example.com/python-guide.pdf"
        }
      ],
      quiz: {
        title: "Python Basics Quiz",
        questions: [
          {
            question: "What is Python?",
            options: ["A snake", "A programming language", "A web browser", "An operating system"],
            correctAnswer: 1
          }
        ]
      }
    },
    {
      title: "Python Fundamentals",
      content: "Core concepts of Python programming",
      duration: 3,
      order: 1,
      lessons: [
        {
          title: "Variables and Data Types",
          content: "Understanding Python variables and basic data types",
          duration: 45,
          type: "video"
        },
        {
          title: "Control Flow",
          content: "If statements, loops, and control structures",
          duration: 60,
          type: "video"
        }
      ],
      resources: [
        {
          title: "Python Cheat Sheet",
          type: "pdf",
          url: "https://example.com/python-cheatsheet.pdf"
        }
      ],
      quiz: {
        title: "Python Fundamentals Quiz",
        questions: [
          {
            question: "Which of these is a valid Python variable name?",
            options: ["123var", "_name", "class", "for"],
            correctAnswer: 1
          }
        ]
      }
    }
  ]
  
  courseData.requirements = [
    "A computer with internet access",
    "4GB RAM minimum",
    "10GB free disk space"
  ]
  
  courseData.outcomes = [
    "Build Python applications from scratch",
    "Understand object-oriented programming",
    "Work with Python packages and modules",
    "Debug and optimize Python code"
  ]
  
  courseData.pricing = {
    regular: 49.99,
    sale: 39.99,
    saleEndDate: new Date("2025-02-10").toISOString()
  }
  
  courseData.enrollmentStart = new Date("2025-01-15").toISOString()
  courseData.enrollmentEnd = new Date("2025-12-31").toISOString()
  courseData.courseStart = new Date("2025-01-20").toISOString()
  courseData.courseEnd = new Date("2025-12-31").toISOString()
  courseData.maxEnrollments = 1000
}

const addResource = () => {
  courseData.resources.push({
    title: '',
    description: '',
    type: '',
    url: '',
    fileUrl: null,
    file: null
  })
}

const removeResource = (index) => {
  courseData.resources.splice(index, 1)
}

const getAcceptedFileTypes = (type) => {
  switch (type) {
    case 'pdf':
      return '.pdf'
    case 'video':
      return 'video/*'
    case 'image':
      return 'image/*'
    default:
      return ''
  }
}

const handleResourceUpload = async (event, index) => {
  const file = event.target.files[0]
  if (file) {
    courseData.resources[index].file = file
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        courseData.resources[index].fileUrl = e.target.result
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading resource:', error)
      alert('Failed to upload resource. Please try again.')
    }
  }
}

const usePrompt = (prompt) => {
  aiPrompt.value = prompt
  sendAIPrompt()
}

const sendAIPrompt = async () => {
  if (!aiPrompt.value.trim() || isAdjusting.value) return

  try {
    isAdjusting.value = true
    
    // Add user message to chat history
    chatHistory.value.push({
      role: 'user',
      content: aiPrompt.value
    })

    // Prepare context for AI
    const context = {
      currentContent: courseData.sections,
      difficulty: courseData.difficulty,
      targetAudience: courseData.targetAudience,
      courseTitle: courseData.title,
      chatHistory: chatHistory.value.slice(-10) // Include last 10 messages for context
    }
    console.log("the prepared context for the ai is: ", context);
    
    // Get AI response
    const response = await aiService.getChatResponse(aiPrompt.value, context)

    // Add AI response to chat history
    chatHistory.value.push({
      role: 'assistant',
      content: typeof response.message === 'string' 
        ? response.message 
        : JSON.stringify(response.message)
    })

    // Update course content if adjustments were made
    if (response.adjustedContent && response.adjustedContent.sections) {
      courseData.sections = response.adjustedContent.sections
      
      // Show success message
      generationStatus.value = {
        type: 'success',
        message: 'Course content updated successfully!'
      }
    }

    // Clear the input
    aiPrompt.value = ''

  } catch (error) {
    console.error('Error adjusting course:', error)
    generationStatus.value = {
      type: 'error',
      message: error.message || 'Failed to adjust course content'
    }
  } finally {
    isAdjusting.value = false
  }
}
</script>