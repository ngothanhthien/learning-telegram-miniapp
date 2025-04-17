import { defineStore } from 'pinia'
import { useMiniApp } from 'vue-tg/latest'
import { queryStringToObject } from '../utils/index'

interface UserStoreState {
  userInfo: UserInfo | null
}

interface UserInfo {
  id: string
  first_name: string
  last_name: string
  username: string
  language_code: string
  photo_url: string
  phone_number: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }) as UserStoreState,
  actions: {
    init(force = false) {
      if (this.userInfo && !force) {
        return
      }

      const { initData } = useMiniApp()
      if (!initData) {
        return
      }
      const raw = queryStringToObject(initData)
      if (!raw.user) {
        return
      }
      this.userInfo = JSON.parse(raw.user) as UserInfo

      // TODO: add user to database if not exists
    },
    updatePhoneNumber(phoneNumber: string) {
      if (!this.userInfo) {
        return
      }
      this.userInfo.phone_number = phoneNumber

      // TODO: update user in database
    },
  },
  getters: {
  },
})
