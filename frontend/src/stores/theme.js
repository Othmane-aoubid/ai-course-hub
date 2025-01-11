import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: false
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      console.log('Dark mode toggled:', this.darkMode)
      this.applyTheme()
    },
    applyTheme() {
      console.log('Applying theme, darkMode:', this.darkMode)
      if (this.darkMode) {
        document.documentElement.classList.add('dark')
        document.body.classList.add('dark')
        document.getElementById('app')?.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.body.classList.remove('dark')
        document.getElementById('app')?.classList.remove('dark')
      }
      console.log('Current classes:', document.documentElement.classList)
    },
    initializeTheme() {
      this.applyTheme()
    }
  },
  persist: true
})
