import { onMounted, onUnmounted, ref } from 'vue'

interface TelegramUser {
  id?: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

interface LaunchParams {
  platform?: string
  version?: string
  user?: TelegramUser
  start_param?: string
  auth_date?: number
  hash?: string
  initData?: string
  [key: string]: any
}

interface TelegramMiniApp {
  sdk: {
    retrieveLaunchParams: () => LaunchParams
    postEvent: (eventType: string, params?: any) => void
    onEvent: (eventType: string, callback: (params: any) => void) => void
  }
  launchParams: LaunchParams
  sendData: (data: any) => void
  close: () => void
}

declare global {
  interface Window {
    TelegramMiniApp?: TelegramMiniApp
  }
}

export function useTelegram() {
  const isReady = ref(false)
  const user = ref<TelegramUser | null>(null)
  const platform = ref<string | undefined>(undefined)
  const telegram = ref<TelegramMiniApp | null>(null)
  const initData = ref<string | undefined>(undefined)

  // Initialize Telegram Mini App
  const init = () => {
    if (window.TelegramMiniApp) {
      telegram.value = window.TelegramMiniApp
      platform.value = window.TelegramMiniApp.launchParams.platform
      user.value = window.TelegramMiniApp.launchParams.user || null
      initData.value = window.TelegramMiniApp.launchParams.initData
      isReady.value = true
      return true
    }
    return false
  }

  // Send data back to the Telegram bot
  const sendData = (data: any) => {
    if (telegram.value) {
      telegram.value.sendData(data)
      return true
    }
    return false
  }

  // Close the Mini App
  const close = () => {
    if (telegram.value) {
      telegram.value.close()
      return true
    }
    return false
  }

  // Event handler for when Telegram is ready
  const handleTelegramReady = (event: CustomEvent) => {
    telegram.value = event.detail
    platform.value = event.detail.launchParams.platform
    user.value = event.detail.launchParams.user || null
    initData.value = event.detail.launchParams.initData
    isReady.value = true
  }

  onMounted(() => {
    // Try to initialize immediately
    if (!init()) {
      // Add event listener for when Telegram becomes ready
      window.addEventListener('telegram-app-ready', handleTelegramReady as EventListener)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('telegram-app-ready', handleTelegramReady as EventListener)
  })

  return {
    isReady,
    user,
    platform,
    initData,
    telegram,
    sendData,
    close,
  }
}
