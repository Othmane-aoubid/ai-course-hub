<template>
  <footer class="bg-gray-800">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div class="xl:grid xl:grid-cols-3 xl:gap-8">
        <!-- Brand -->
        <div class="space-y-8 xl:col-span-1">
          <h3 class="text-2xl font-bold text-white">AI Course Hub</h3>
          <p class="text-gray-300 text-base">
            Transform your knowledge into engaging online courses with the power of AI.
          </p>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-gray-300">
              <span class="sr-only">Facebook</span>
              <i class="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-300">
              <span class="sr-only">Twitter</span>
              <i class="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-300">
              <span class="sr-only">GitHub</span>
              <i class="fab fa-github text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-300">
              <span class="sr-only">LinkedIn</span>
              <i class="fab fa-linkedin text-xl"></i>
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div class="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Platform
              </h3>
              <ul class="mt-4 space-y-4">
                <li>
                  <router-link to="/courses" class="text-base text-gray-300 hover:text-white">
                    Browse Courses
                  </router-link>
                </li>
                <li>
                  <router-link to="/create-course" class="text-base text-gray-300 hover:text-white">
                    Create Course
                  </router-link>
                </li>
                <li>
                  <a href="#pricing" class="text-base text-gray-300 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#features" class="text-base text-gray-300 hover:text-white">
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Support
              </h3>
              <ul class="mt-4 space-y-4">
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Company
              </h3>
              <ul class="mt-4 space-y-4">
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Legal
              </h3>
              <ul class="mt-4 space-y-4">
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" class="text-base text-gray-300 hover:text-white">
                    Licenses
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-12 border-t border-gray-700 pt-8">
        <p class="text-base text-gray-300 xl:text-center">
          &copy; {{ new Date().getFullYear() }} AI Course Hub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
