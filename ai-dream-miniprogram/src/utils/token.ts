import Taro from '@tarojs/taro'
import { STORAGE_KEYS } from './constants'

export function getAccessToken(): string {
  return Taro.getStorageSync(STORAGE_KEYS.ACCESS_TOKEN) || ''
}

export function getRefreshToken(): string {
  return Taro.getStorageSync(STORAGE_KEYS.REFRESH_TOKEN) || ''
}

export function setTokens(access: string, refresh: string): void {
  Taro.setStorageSync(STORAGE_KEYS.ACCESS_TOKEN, access)
  Taro.setStorageSync(STORAGE_KEYS.REFRESH_TOKEN, refresh)
}

export function clearTokens(): void {
  Taro.removeStorageSync(STORAGE_KEYS.ACCESS_TOKEN)
  Taro.removeStorageSync(STORAGE_KEYS.REFRESH_TOKEN)
  Taro.removeStorageSync(STORAGE_KEYS.USER_INFO)
}

export function isLoggedIn(): boolean {
  return !!getAccessToken()
}
