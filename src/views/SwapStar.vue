<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTonStore } from '../stores/useTonStore'

const tonStore = useTonStore()

setInterval(() => {
  tonStore.fetchTonRate()
}, 10000)

const tonRate = computed(() => {
  return tonStore.tonRate
})

const selectedStars = ref(0)
const user = ref(null)
const showInputDialog = ref(false)
const walletInputValue = ref('')
const showConfirmDialog = ref(false)
const walletResolveCallback = ref(null)
const confirmResolveCallback = ref(null)

const starOptions = [
  { value: 100, label: '100' },
  { value: 250, label: '250' },
  { value: 500, label: '500' },
  { value: 750, label: '750' },
  { value: 1000, label: '1K' },
  { value: 1500, label: '1.5K' },
  { value: 2000, label: '2K' },
  { value: 2500, label: '2.5K' },
  { value: 3000, label: '3K' },
  { value: 3500, label: '3.5K' },
  { value: 4000, label: '4K' },
  { value: 4500, label: '4.5K' },
  { value: 5000, label: '5K' },
  { value: 6000, label: '6K' },
  { value: 7000, label: '7K' },
  { value: 8000, label: '8K' },
  { value: 9000, label: '9K' },
  { value: 10000, label: '10K' },
]

const tonAmount = computed(() => {
  return (selectedStars.value * tonRate.value).toFixed(6)
})

function selectStars(amount: number) {
  selectedStars.value = amount
}

async function checkUserStars(userId) {
  if (!userId)
    return { success: false, stars: 0 }

  try {
    const response = await fetch(`/api/getstars?id=${encodeURIComponent(userId)}`)
    const data = await response.json()
    return { success: true, stars: data.stars || 0 }
}
  catch (error) {
    console.error('Error fetching stars:', error)
    return { success: false, stars: 0 }
  }
}

function confirmWalletInput() {
  if (walletResolveCallback.value && walletInputValue.value) {
    walletResolveCallback.value(walletInputValue.value)
    showInputDialog.value = false
    walletInputValue.value = ''
    walletResolveCallback.value = null
  }
}

function confirmSwap() {
  if (confirmResolveCallback.value) {
    confirmResolveCallback.value(true)
    showConfirmDialog.value = false
    confirmResolveCallback.value = null
  }
}

async function promptForWalletAddress() {
  if (window.Swal) {
    const { value: walletAddress } = await window.Swal.fire({
      title: 'Enter your TON wallet address',
      input: 'text',
      inputPlaceholder: 'Wallet address',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a wallet address!'
        }
      },
    })

    return walletAddress
  }
  else {
    // Use custom dialog instead of prompt
    return new Promise((resolve) => {
      walletResolveCallback.value = resolve
      walletInputValue.value = ''
      showInputDialog.value = true
    })
  }
}

function showConfirmation() {
  return new Promise((resolve) => {
    if (window.Swal) {
      window.Swal.fire({
        title: 'Confirm Swap',
        text: `Swap ${selectedStars.value} Stars for ${tonAmount.value} TON?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Swap',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        resolve(result.isConfirmed)
      })
    }
    else {
      confirmResolveCallback.value = resolve
      showConfirmDialog.value = true
    }
  })
}

async function processSwap() {
  try {
    // Get wallet address, could be from user input or stored data
    const walletAddress = await promptForWalletAddress()

    if (!walletAddress) {
      console.error('Wallet address is required')
      return
    }

    // Call API to process the swap
    const apiUrl = `/api/swapstars?id=${encodeURIComponent(user.value?.id || '')}
      &stars=${encodeURIComponent(selectedStars.value)}
      &wallet=${encodeURIComponent(walletAddress)}`.replace(/\s+/g, '')

    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.success) {
      if (window.Swal) {
        window.Swal.fire({
          title: 'Success!',
          text: `Your ${tonAmount.value} TON will be sent to your wallet shortly!`,
          icon: 'success',
        })
      }
      else {
        console.warn(`Success! Your ${tonAmount.value} TON will be sent to your wallet shortly!`)
      }

      // Reset selection
      selectedStars.value = 0
    }
    else {
      console.error(data.message || 'Swap failed. Please try again.')
    }
  }
  catch (error) {
    console.error('Error processing swap:', error)
  }
}

async function swapNow() {
  if (!selectedStars.value)
    return

  if (!window.Telegram?.WebApp) {
    console.error('Telegram WebApp is not available')
    return
  }

  try {
    // Check if user has enough stars
    const response = await checkUserStars(user.value?.id)

    if (response.success && response.stars >= selectedStars.value) {
      const confirmed = await showConfirmation()
      if (confirmed) {
        processSwap()
      }
    }
    else {
      console.warn(`You don't have enough stars. Your balance: ${response.stars || 0} Stars`)
    }
  }
  catch (error) {
    console.error('Error checking stars balance:', error)
  }
}

onMounted(() => {
  // Initialize Telegram WebApp
  if (window.Telegram) {
    window.Telegram.WebApp.ready()
    user.value = window.Telegram.WebApp.initDataUnsafe?.user || null
  }
})
</script>

<template>
  <div class="p-5 max-w-md mx-auto">
    <div class="bg-gray-800 rounded-xl p-6 shadow-lg text-white">
      <div class="flex flex-col items-center">
        <img src="@/assets/tonicon.jpg" alt="TON Icon" class="w-12 h-12 rounded-lg">
        <h2 class="text-xl font-bold mt-2 mb-1">
          Swap Your Stars To TON 💱
        </h2>
        <p class="text-sm text-gray-400">
          Will be sent directly to your wallet address
        </p>
      </div>

      <div class="bg-gray-700 rounded-lg p-4 mt-4">
        <p class="text-sm text-gray-300">
          You receive
        </p>
        <h1 class="text-2xl font-bold">
          {{ tonAmount }} TON
        </h1>
      </div>

      <div class="grid grid-cols-3 gap-2 mt-4">
        <button
          v-for="option in starOptions"
          :key="option.value"
          class="py-2 px-1 rounded-md text-sm transition-colors" :class="[
            selectedStars === option.value
              ? 'bg-blue-600 font-bold'
              : 'bg-gray-600 hover:bg-gray-500',
          ]"
          @click="selectStars(option.value)"
        >
          {{ option.label }} ⭐
        </button>
      </div>

      <button
        class="w-full mt-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-md transition-colors"
        :disabled="!selectedStars"
        @click="swapNow"
      >
        Swap Now
      </button>
    </div>

    <!-- Custom Wallet Input Dialog -->
    <div v-if="showInputDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-xl max-w-sm w-full">
        <h3 class="text-lg font-bold mb-4">
          Enter your TON wallet address
        </h3>
        <input
          v-model="walletInputValue"
          type="text"
          class="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4"
          placeholder="Wallet address"
        >
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            @click="showInputDialog = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            :disabled="!walletInputValue"
            @click="confirmWalletInput"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-xl max-w-sm w-full">
        <h3 class="text-lg font-bold mb-2">
          Confirm Swap
        </h3>
        <p class="mb-4">
          Swap {{ selectedStars }} Stars for {{ tonAmount }} TON?
        </p>
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            @click="showConfirmDialog = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500"
            @click="confirmSwap"
          >
            Swap
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
