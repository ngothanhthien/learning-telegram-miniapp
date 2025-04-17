<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TonConnectTrigger from '../components/TonConnecTrigger.vue'
import { useUserStore } from '../stores/useUserStore'

const userStore = useUserStore()
userStore.init()

const { locale } = useI18n()

const user = computed(() => userStore.userInfo)

locale.value = user.value?.language_code || 'en'
</script>

<template>
  <div class="p-5 max-w-3xl mx-auto text-white">
    <div id="header" class="flex justify-between items-center py-4" />
    <div id="usercard" class="bg-gray-800 shadow-lg rounded-xl p-5 my-5 w-full max-w-xl mx-auto">
      <div v-if="user" class="flex items-center">
        <img :src="user.photo_url || '/src/imgs/default_avatar.png'" alt="User Avatar" class="w-16 h-16 rounded-full mr-4 border-2 border-yellow-500">
        <div class="flex-1 text-left">
          <p class="text-base font-medium my-1">
            {{ user.first_name }} {{ user.last_name || '' }} (@{{ user.username || 'Unknown' }})
          </p>
          <TonConnectTrigger />
        </div>
      </div>
      <p v-else class="text-center">
        Loading user data...
      </p>
    </div>
    <div class="flex bg-gray-800 shadow-lg rounded-xl p-5 my-5 w-full max-w-xl mx-auto hover:-translate-y-1 transition-transform">
      <img src="@/assets/game.webp" alt="Games" class="w-12 h-12 rounded-xl mr-4">
      <div class="flex-1 text-left">
        <div class="flex justify-between items-center flex-wrap font-bold text-sm">
          <span>Games <span class="text-yellow-500">COMING SOON!!!</span></span>
          <button type="button" class="bg-gray-500 text-white py-2 px-3 rounded-lg text-xs font-bold cursor-not-allowed" disabled>
            Play
          </button>
        </div>
        <p class="text-sm leading-relaxed">
          Play games and earn Telegram Stars
        </p>
      </div>
    </div>
    <div class="flex bg-gray-800 shadow-lg rounded-xl p-5 my-5 w-full max-w-xl mx-auto hover:-translate-y-1 transition-transform">
      <img src="@/assets/pre.avif" alt="Telegram Premium" class="w-12 h-12 rounded-xl mr-4">
      <div class="flex-1 text-left">
        <div class="flex justify-between items-center flex-wrap font-bold text-sm">
          <span>Telegram Premium</span>
          <router-link to="/buypre">
            <button class="bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-bold hover:bg-blue-700">
              GET VERIFIED
            </button>
          </router-link>
        </div>
        <p class="text-sm leading-relaxed">
          Get a Verified Blue Check by upgrading to Telegram Premium.
        </p>
      </div>
    </div>
    <div class="flex bg-gray-800 shadow-lg rounded-xl p-5 my-5 w-full max-w-xl mx-auto hover:-translate-y-1 transition-transform">
      <img src="@/assets/star.jpg" alt="Telegram Stars" class="w-12 h-12 rounded-xl mr-4">
      <div class="flex-1 text-left">
        <div class="flex justify-between items-center flex-wrap font-bold text-sm">
          <span>Telegram Stars</span>
          <router-link to="/buystar">
            <button class="bg-yellow-500 text-gray-900 py-2 px-3 rounded-lg text-xs font-bold hover:bg-yellow-600">
              GIFT
            </button>
          </router-link>
        </div>
        <p class="text-sm leading-relaxed">
          Gift Telegram Stars to enhance the experience for yourself and your loved ones!
        </p>
      </div>
    </div>
    <div class="flex bg-gray-800 shadow-lg rounded-xl p-5 my-5 w-full max-w-xl mx-auto hover:-translate-y-1 transition-transform">
      <img src="@/assets/tonicon.jpg" alt="Telegram Stars" class="w-12 h-12 rounded-xl mr-4">
      <div class="flex-1 text-left">
        <div class="flex justify-between items-center flex-wrap font-bold text-sm">
          <span>Swap Stars To TON</span>
          <router-link to="/swapstar">
            <button class="bg-gray-500 text-white py-2 px-3 rounded-lg text-xs font-bold hover:bg-gray-600">
              SWAP
            </button>
          </router-link>
        </div>
        <p class="text-sm leading-relaxed">
          Will be sent directly to your wallet address!
        </p>
      </div>
    </div>
  </div>
</template>
