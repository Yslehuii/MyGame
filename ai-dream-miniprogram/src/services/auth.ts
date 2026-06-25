import { post, del } from './request'
import { LoginResponse } from '../types/user'

export function wechatLogin(code: string) {
  return post<LoginResponse>('/auth/wechat-login', { code })
}

export function deleteAccount() {
  return del('/auth/account')
}
