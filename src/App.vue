<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useTelegram } from './composables/useTelegram'

const { isReady, user, platform, sendData, close } = useTelegram()

const isTelegram = computed(() => isReady.value && platform.value !== undefined)

function sendDataToBot() {
  sendData({
    action: 'test_action',
    timestamp: Date.now(),
  })
}
</script>

<template>
  <div class="max-w-sm mx-auto relative">
    <main class="h-screen bg-gray-900">
      <RouterView />
      <div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-sm w-full bg-gray-800 flex justify-around py-4 px-2 z-10">
        <RouterLink to="/" class="text-white text-xs font-bold">
          Home
        </RouterLink>
        <RouterLink to="/swapstar" class="text-white text-xs font-bold">
          Swap Star
        </RouterLink>
      </div>
    </main>
  </div>
</template>
