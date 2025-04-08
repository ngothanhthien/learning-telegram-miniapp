import { init, mockTelegramEnv } from '@telegram-apps/sdk-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import { launchParams } from '../helper/telegramMock'
import App from './App.vue'
import router from './router/index'
import './assets/css/tailwind.css'
import './assets/css/main.css'
import './assets/css/telegram.css'
import 'sweetalert2/dist/sweetalert2.min.css'
// Call mockTelegramEnv with the constructed launchParams
mockTelegramEnv({
  launchParams,
})

init()

createApp(App)
  .use(router)
  .use(createPinia())
  .use(VueSweetalert2)
  .mount('#app')
