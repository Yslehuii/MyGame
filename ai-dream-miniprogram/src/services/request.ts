import Taro from '@tarojs/taro'
import { BASE_URL } from '../utils/constants'
import { getAccessToken, getRefreshToken, setTokens } from '../utils/token'

interface RequestOptions {
  url: string
  method?: keyof Taro.request.Method
  data?: any
  header?: Record<string, string>
}

export async function request<T = any>(options: RequestOptions): Promise<T> {
  const token = getAccessToken()
  const header: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.header
  }
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await Taro.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header
    })

    if (res.statusCode === 401) {
      const refreshed = await tryRefreshToken()
      if (refreshed) {
        return request(options)
      }
      Taro.navigateTo({ url: '/pages/login/index' })
      return Promise.reject(new Error('Unauthorized'))
    }

    if (res.statusCode >= 400) {
      console.error('[API Error]', res.statusCode, res.data)
      return Promise.reject(res.data)
    }

    return res.data as T
  } catch (err) {
    console.error('[API Error]', options.url, err)
    throw err
  }
}

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const res = await Taro.request({
      url: BASE_URL + '/auth/refresh',
      method: 'POST',
      data: { refresh_token: refreshToken }
    })
    if (res.statusCode === 200 && res.data.access_token) {
      setTokens(res.data.access_token, res.data.refresh_token || refreshToken)
      return true
    }
  } catch {
    console.error('[Auth] Token refresh failed')
  }
  return false
}

export function get<T = any>(url: string, data?: any) {
  return request<T>({ url, method: 'GET', data })
}

export function post<T = any>(url: string, data?: any) {
  return request<T>({ url, method: 'POST', data })
}

export function put<T = any>(url: string, data?: any) {
  return request<T>({ url, method: 'PUT', data })
}

export function del<T = any>(url: string) {
  return request<T>({ url, method: 'DELETE' })
}

export function patch<T = any>(url: string, data?: any) {
  return request<T>({ url, method: 'PATCH', data })
}
