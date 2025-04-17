import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { VueTelegramPlugin } from 'vue-tg'
import App from './App.vue'
import messages from './locales'
import router from './router/index'
import './assets/css/tailwind.css'
import './assets/css/main.css'
import './assets/css/telegram.css'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

createApp(App)
  .use(router)
  .use(createPinia())
  .use(VueTelegramPlugin)
  .use(i18n)
  .mount('#app')
