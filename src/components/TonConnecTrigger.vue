<script setup lang="ts">
import type { Locales, TonConnectUI as TonConnectUIType } from '@tonconnect/ui'
import { THEME, TonConnectUI } from '@tonconnect/ui'
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '../stores/useUserStore'

const tonConnectUI = ref<TonConnectUIType | null>(null)
const user = computed(() => useUserStore().userInfo)

onMounted(() => {
  tonConnectUI.value = new TonConnectUI({
    manifestUrl: `${import.meta.env.VITE_APP_URL}/tonconnect-manifest.json`,
    buttonRootId: 'connect-button',
  })

  tonConnectUI.value.uiOptions = {
    language: user.value?.language_code as Locales,
    uiPreferences: {
      theme: THEME.DARK,
    },
  }
})

async function connectWallet() {
  await tonConnectUI.value?.openModal()
}
</script>

<template>
  <button id="connect-button" @click="connectWallet" />
</template>
