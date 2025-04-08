import axios from 'axios'
import { defineStore } from 'pinia'

export const useTonStore = defineStore('ton', {
  state: () => ({
    tonRate: 0,
    lastUpdated: 0,
  }),
  actions: {
    async fetchTonRate() {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd')
        this.tonRate = response.data['the-open-network'].usd
        this.lastUpdated = Date.now()
      }
      catch (error) {
        console.error('❌ Lỗi khi lấy tỷ giá TON:', error)
      }
    },
    isRateExpired() {
      return (Date.now() - this.lastUpdated) > 1000 * 30 // 30 seconds
    },
  },
  getters: {
  },
})
