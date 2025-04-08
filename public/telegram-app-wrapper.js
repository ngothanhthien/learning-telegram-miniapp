/**
 * Telegram Mini App wrapper
 * This script handles Telegram Mini App initialization and provides utility functions
 */
(function () {
  // Store Telegram SDK reference
  let telegramSdk = null

  // Initialize when the script is loaded
  function init() {
    if (window.telegramApps && window.telegramApps.sdk) {
      telegramSdk = window.telegramApps.sdk
      setupApp()
    }
    else {
      // If SDK is not loaded yet, wait for it
      loadSdk()
    }
  }

  // Load Telegram SDK if not already present
  function loadSdk() {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@telegram-apps/sdk@1.0.0/dist/index.iife.js'
    script.async = true
    script.onload = function () {
      if (window.telegramApps && window.telegramApps.sdk) {
        telegramSdk = window.telegramApps.sdk
        setupApp()
      }
    }
    document.head.appendChild(script)
  }

  // Setup the app with necessary configurations
  function setupApp() {
    const { retrieveLaunchParams, postEvent } = telegramSdk
    const lp = retrieveLaunchParams()

    // Expand the app
    postEvent('web_app_expand')

    // Add mobile-specific classes if needed
    if (!['macos', 'tdesktop', 'weba', 'web', 'webk'].includes(lp.platform)) {
      document.body.classList.add('mobile-body')

      // Apply styles after Vue has mounted
      setTimeout(() => {
        const wrapEl = document.getElementById('app')
        if (wrapEl) {
          wrapEl.classList.add('mobile-wrap')
          // Find main content container in Vue app
          const contentEl = wrapEl.querySelector('main') || wrapEl.firstElementChild
          if (contentEl) {
            contentEl.classList.add('mobile-content')
          }
        }
      }, 100)
    }

    // Expose Telegram SDK to Vue app
    window.TelegramMiniApp = {
      sdk: telegramSdk,
      launchParams: lp,
      sendData(data) {
        telegramSdk.postEvent('web_app_data_send', {
          data: typeof data === 'string' ? data : JSON.stringify(data),
        })
      },
      close() {
        telegramSdk.postEvent('web_app_close')
      },
    }

    // Dispatch event that Telegram wrapper is ready
    window.dispatchEvent(new CustomEvent('telegram-app-ready', {
      detail: window.TelegramMiniApp,
    }))
  }

  // Start initialization
  init()
})()
