import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { User } from '../types/user'
import { STORAGE_KEYS } from '../utils/constants'
import { clearTokens } from '../utils/token'

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: (() => {
    try {
      const info = Taro.getStorageSync(STORAGE_KEYS.USER_INFO)
      return info ? JSON.parse(info) : null
    } catch {
      return null
    }
  })(),
  isLoggedIn: !!Taro.getStorageSync(STORAGE_KEYS.ACCESS_TOKEN),
  setUser: (user) => {
    if (user) {
      Taro.setStorageSync(STORAGE_KEYS.USER_INFO, JSON.stringify(user))
    }
    set({ user, isLoggedIn: !!user })
  },
  logout: () => {
    clearTokens()
    set({ user: null, isLoggedIn: false })
  }
}))
