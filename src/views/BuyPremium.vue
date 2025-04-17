<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTelegram } from '../composables/useTelegram'

const { user } = useTelegram()
const usernameInput = ref('')
const purchaseType = ref('self')
const tonPriceDisplay = ref('💰 Select a package to see TON price')
const tonPriceInUsd = ref(0)
const selectedMonths = ref(null)
const showOrderModal = ref(false)
const orderDetails = ref({
  orderId: '',
  username: '',
  amount: '',
  price: 0,
  tonAmount: 0,
  tonkeeperLink: '',
  paymentLink: '',
})

const subscriptionOptions = [
  { months: 3, price: 14 },
  { months: 6, price: 19 },
  { months: 12, price: 33 },
]

function updateRecipient() {
  if (purchaseType.value === 'self') {
    usernameInput.value = user.value?.username || 'No username found'
  }
  else {
    usernameInput.value = ''
  }
}

function selectSubscription(months: number, price: number) {
  selectedMonths.value = months
  if (tonPriceInUsd.value > 0) {
    const tonAmount = (price / tonPriceInUsd.value).toFixed(2)
    tonPriceDisplay.value = `💰 ${tonAmount} TON`
  }
  else {
    tonPriceDisplay.value = '❌ Failed to load TON price'
  }
}

async function fetchTonPrice() {
  try {
    const response = await fetch('https://tonapi.io/v2/rates?tokens=ton&currencies=usd')
    const data = await response.json()
    tonPriceInUsd.value = data.rates.TON.prices.USD
    return data.rates.TON.prices.USD
  }
  catch (error) {
    console.error('Error fetching TON price:', error)
    tonPriceDisplay.value = '❌ Failed to load TON price'
    return null
  }
}

async function fetchTonReceiver() {
  try {
    const response = await fetch('/api/get-ton-receiver')
    const data = await response.json()
    if (data.success) {
      return data.TON_RECEIVER
    }
    else {
      console.error('❌ Err TON_RECEIVER:', data.error)
      return null
    }
  }
  catch (error) {
    console.error('❌ API ERR:', error)
    return null
  }
}

async function buyPremium() {
  const username = usernameInput.value.trim()

  if (!username || selectedMonths.value === null) {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'warning',
        title: '⚠️ Missing Information',
        text: 'Please select a subscription and enter a valid username.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      })
    }
    return
  }

  const option = subscriptionOptions.find(opt => opt.months === selectedMonths.value)
  if (!option)
    return

  const price = option.price

  // Get TON price
  if (!tonPriceInUsd.value) {
    const price = await fetchTonPrice()
    if (!price) {
      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: '❌ TON Price Error',
          text: 'Failed to fetch TON price. Please try again later.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Retry',
        })
      }
      return
    }
  }

  // Get TON receiver address
  const tonReceiver = await fetchTonReceiver()
  if (!tonReceiver) {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: '❌ Receiver Error',
        text: 'Failed to fetch TON receiver. Please try again later.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Retry',
      })
    }
    return
  }

  const tonAmount = (price / tonPriceInUsd.value + 0.01).toFixed(2)

  // Create unique order ID
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 10)
  const rawOrderId = `${timestamp}-${username}-${selectedMonths.value}-${randomString}`

  // Generate order ID with SHA-256
  const encoder = new TextEncoder()
  const data = encoder.encode(rawOrderId)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const orderId = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('').substring(0, 20)

  // Create payment links
  const tonkeeperLink = `tonkeeper://transfer/${tonReceiver}?amount=${Math.round(tonAmount * 1e9)}&text=${encodeURIComponent(orderId)}`
  const paymentLink = `https://app.tonkeeper.com/transfer/${tonReceiver}?amount=${Math.round(tonAmount * 1e9)}&text=${encodeURIComponent(orderId)}`

  // Send order to backend
  const userId = user.value?.id || 'null'
  const queryParams = new URLSearchParams({
    userId,
    amount: selectedMonths.value.toString(),
    username,
    price: price.toString(),
    tonAmount,
    paymentLink,
    orderId,
    service: 'Buy Premium',
  }).toString()

  fetch(`/api/process-payment?${queryParams}`, { method: 'GET' })

  // Update order details and show modal
  orderDetails.value = {
    orderId,
    username,
    amount: `${selectedMonths.value} Months`,
    price,
    tonAmount,
    tonkeeperLink,
    paymentLink,
  }
  showOrderModal.value = true
}

function closeOrderModal() {
  showOrderModal.value = false
}

async function checkTransaction(orderId: string) {
  try {
    const response = await fetch('/api/check-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
    const result = await response.json()

    if (result.success) {
      if (window.Swal) {
        window.Swal.fire({
          icon: 'success',
          title: '✅ Transaction Verified!',
          text: `Transaction ID: ${result.transactionId}`,
          confirmButtonColor: '#28a745',
        })
      }
    }
    else {
      if (window.Swal) {
        window.Swal.fire({
          icon: 'warning',
          title: '⚠️ Transaction Not Found!',
          text: result.message,
          confirmButtonColor: '#d33',
        })
      }
    }
  }
  catch (error) {
    console.error('❌ Error checking transaction:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: '❌ Error',
        text: 'Error checking transaction',
        confirmButtonColor: '#d33',
      })
    }
  }
}

async function cancelOrder(orderId: string) {
  try {
    const response = await fetch('/api/cancel-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
    const result = await response.json()

    if (result.success) {
      if (window.Swal) {
        window.Swal.fire({
          icon: 'info',
          title: '❌ Order Canceled!',
          text: 'Your order has been canceled successfully.',
          confirmButtonColor: '#d33',
        })
      }
      showOrderModal.value = false
    }
    else {
      if (window.Swal) {
        window.Swal.fire({
          icon: 'warning',
          title: '⚠️ Cannot Cancel Order!',
          text: result.message,
          confirmButtonColor: '#d33',
        })
      }
    }
  }
  catch (error) {
    console.error('❌ Error canceling order:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: '❌ Error',
        text: 'Error canceling order',
        confirmButtonColor: '#d33',
      })
    }
  }
}

onMounted(async () => {
  updateRecipient()
  await fetchTonPrice()
})
</script>

<template>
  <div class="p-5 max-w-md mx-auto">
    <div class="bg-gray-800 rounded-xl p-6 shadow-lg text-white">
      <div class="flex flex-col items-center">
        <div class="premium-logo" />
        <h2 class="text-xl font-bold mt-2 mb-1 text-blue-400 text-center">
          Telegram Premium
        </h2>
        <p class="text-sm text-gray-300 text-center">
          Get a Verified Blue Check by upgrading to Telegram Premium.
        </p>
      </div>

      <div class="flex justify-center mt-4 space-x-4">
        <label class="flex items-center">
          <input
            v-model="purchaseType"
            type="radio"
            name="purchase-type"
            value="self"
            class="mr-2"
            @change="updateRecipient"
          >
          <span>For Myself</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="purchaseType"
            type="radio"
            name="purchase-type"
            value="gift"
            class="mr-2"
            @change="updateRecipient"
          >
          <span>Gift</span>
        </label>
      </div>

      <div class="bg-gray-700 rounded-lg p-4 mt-4">
        <input
          v-model="usernameInput"
          type="text"
          placeholder="Enter username"
          :disabled="purchaseType === 'self'"
          class="bg-gray-900 text-white border-none p-2 w-full text-center rounded-lg"
        >
      </div>

      <div class="grid grid-cols-3 gap-3 mt-4">
        <div
          v-for="option in subscriptionOptions"
          :key="option.months"
          class="bg-gray-700 p-3 rounded-lg text-center cursor-pointer transition-colors hover:bg-gray-600"
          :class="{ 'bg-blue-600': selectedMonths === option.months }"
          @click="selectSubscription(option.months, option.price)"
        >
          <div class="text-sm">
            For {{ option.months }} Months
          </div>
          <div class="font-bold">
            ${{ option.price }}
          </div>
        </div>
      </div>

      <div class="text-center p-4 mt-4 bg-gray-700 rounded-lg font-medium">
        {{ tonPriceDisplay }}
      </div>

      <button
        class="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg mt-4 hover:bg-blue-600 transition-colors"
        @click="buyPremium"
      >
        Order Telegram Premium
      </button>
    </div>

    <!-- Order Modal -->
    <div v-if="showOrderModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-gray-900 p-6 rounded-xl max-w-md w-full">
        <h2 class="text-xl font-bold text-white mb-4 text-center">
          Order Details
        </h2>

        <div class="text-white mb-6 space-y-2">
          <p><strong>Order ID:</strong> {{ orderDetails.orderId }}</p>
          <p><strong>Username:</strong> {{ orderDetails.username }}</p>
          <p><strong>Amount:</strong> {{ orderDetails.amount }}</p>
          <p><strong>Price:</strong> ${{ orderDetails.price }}</p>
          <p><strong>TON Amount:</strong> {{ orderDetails.tonAmount }} TON</p>
        </div>

        <div class="flex flex-col gap-3">
          <a
            :href="orderDetails.tonkeeperLink"
            target="_blank"
            class="bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            💰 Pay with TON (Tonkeeper)
          </a>

          <a
            :href="orderDetails.paymentLink"
            target="_blank"
            class="bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔗 Pay with Payment Link
          </a>

          <button
            class="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
            @click="checkTransaction(orderDetails.orderId)"
          >
            🔍 Check Transaction
          </button>

          <button
            class="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
            @click="cancelOrder(orderDetails.orderId)"
          >
            ❌ Cancel Order
          </button>

          <button
            class="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors mt-2"
            @click="closeOrderModal"
          >
            ⬅️ Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.premium-logo {
  width: 80px;
  height: 80px;
  background-image: url('/src/assets/pre.avif');
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  margin: 0 auto;
}
</style>
