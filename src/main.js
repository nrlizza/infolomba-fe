import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './styles/style.css'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faTrophy, 
  faEye, 
  faEyeSlash, 
  faUserPlus, 
  faEnvelope, 
  faIdCard, 
  faUser, 
  faLock, 
  faCalendar, 
  faPhone, 
  faBuilding,
  faRightToBracket
} from '@fortawesome/free-solid-svg-icons'

// Sweetalert
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// Tanstack Query
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

library.add(
  faTrophy, 
  faEye, 
  faEyeSlash, 
  faUserPlus, 
  faEnvelope, 
  faIdCard, 
  faUser, 
  faLock, 
  faCalendar, 
  faPhone, 
  faBuilding,
  faRightToBracket
)

const queryClient = new QueryClient()
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.use(VueQueryPlugin, { queryClient })
app.use(VueSweetalert2)

router.isReady().then(() => {
  app.mount("#app")
})
