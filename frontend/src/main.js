import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faFile,
  faComment,
  faVideo,
  faExclamationTriangle,
  faCheckCircle,
  faPlusCircle,
  faInbox,
  faChartBar,
  faCog,
  faUser,
  faPlus,
  faUsers,
  faBook,
  faDollarSign,
  faStar,
  faSearch,
  faFilter,
  faEdit,
  faEye,
  faEllipsisV,
  faClock,
  faArrowUp,
  faArrowDown,
  faBars,
  faChartPie,
  faUserPlus,
  faExclamationCircle,
  faPlayCircle,
  faTasks,
  faComments,
  faCircle,
  faEquals,
  faTrophy
} from '@fortawesome/free-solid-svg-icons'
import './firebase' // Import Firebase initialization
import { setupTokenRefresh } from './utils/auth' // Import token refresh

// Initialize Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Setup Firebase token refresh
setupTokenRefresh()

// Create app instance
const app = createApp(App)

// Add icons to the library
library.add(
  faFile,
  faComment,
  faVideo,
  faExclamationTriangle,
  faCheckCircle,
  faPlusCircle,
  faInbox,
  faChartBar,
  faCog,
  faUser,
  faPlus,
  faUsers,
  faBook,
  faDollarSign,
  faStar,
  faSearch,
  faFilter,
  faEdit,
  faEye,
  faEllipsisV,
  faClock,
  faArrowUp,
  faArrowDown,
  faBars,
  faChartPie,
  faUserPlus,
  faExclamationCircle,
  faPlayCircle,
  faTasks,
  faComments,
  faCircle,
  faEquals,
  faTrophy
)

// Register font-awesome-icon component globally
app.component('font-awesome-icon', FontAwesomeIcon)

// Toast configuration
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

// Use plugins
app.use(pinia)
app.use(router)
app.use(Toast, toastOptions)

// Mount app
app.mount('#app')
