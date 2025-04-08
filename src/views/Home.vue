<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const user = ref(null)
    const phoneNumber = ref('Click to share your contact')

    const updateUserInfo = (userData, phone = 'Click to share your contact') => {
      user.value = userData
      phoneNumber.value = phone
    }

    const requestPhoneNumber = () => {
      return new Promise((resolve, reject) => {
        if (window.Telegram) {
          window.Telegram.WebApp.requestContact((sent, event) => {
            if (sent) {
              const phone = event?.responseUnsafe?.contact?.phone_number || ''
              resolve(phone)
            }
            else {
              reject(new Error('User denied contact sharing.'))
            }
          })
        }
        else {
          reject(new Error('Telegram WebApp not available'))
        }
      })
    }

    const updatePhoneNumber = async (id, phone) => {
      const apiUrl = `/api/updateuser?id=${encodeURIComponent(id)}
        &phone=${encodeURIComponent(phone)}`.replace(/\s+/g, '')

      try {
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (data.message && data.message.includes('✅')) {
          updateUserInfo(user.value, phone)
        }
        else {
          console.error('⚠️ Error from server:', data)
        }
      }
      catch (error) {
        console.error('❌ Error updating phone:', error)
      }
    }

    const saveUserToDB = async (userData, phone = '') => {
      if (!userData?.id) {
        console.error('❌ User ID is missing!')
        return
      }

      const apiUrl = `/api/adduser?id=${encodeURIComponent(userData.id)}
        &username=${encodeURIComponent(userData.username || '')}
        &name=${encodeURIComponent(`${userData.first_name} ${userData.last_name || ''}`)}
        &phone=${encodeURIComponent(phone)}
        &pic=${encodeURIComponent(userData.photo_url || '')}`.replace(/\s+/g, '')

      try {
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (!data.message || !data.message.includes('✅')) {
          console.error('⚠️ Error from server:', data)
        }
      }
      catch (error) {
        console.error('❌ Error saving user:', error)
      }
    }

    const checkUserContact = async (userData) => {
      if (!userData?.id) {
        console.warn('⚠️ User ID is missing!')
        return
      }

      const apiUrl = `/api/getuser?id=${encodeURIComponent(userData.id)}`
      try {
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (data?.user?.phone) {
          updateUserInfo(userData, data.user.phone)
        }
        else {
          console.warn('⚠️ No phone found, requesting contact...')
          const phone = await requestPhoneNumber()
          updateUserInfo(userData, phone)
          await updatePhoneNumber(userData.id, phone)
        }
      }
      catch (error) {
        console.error('❌ Error checking user contact:', error)
      }
    }

    const navigateTo = (path) => {
      router.push(path)
    }

    onMounted(async () => {
      // Initialize Telegram WebApp
      // if (window.Telegram) {
      //   window.Telegram.WebApp.ready()
      //   user.value = window.Telegram.WebApp.initDataUnsafe?.user || null

      //   if (user.value?.id) {
      //     await saveUserToDB(user.value)
      //     await checkUserContact(user.value)
      //   }
      // }
    })

    return {
      user,
      phoneNumber,
      navigateTo,
    }
  },
}
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
          <p class="text-base my-1">
            📞 +{{ phoneNumber }}
          </p>
        </div>
      </div>
      <p v-else class="text-center">
        Loading user data...
      </p>
    </div>
    <p class="text-base">
      Buy airtime and airtime package
    </p>
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
