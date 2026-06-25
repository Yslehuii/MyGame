// 备案期间临时使用直连IP，备案通过后改回 https://vistacloud.cloud/api/v1
export const BASE_URL = 'http://8.156.36.17/api/v1'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info'
} as const

export const MOOD_TAGS = [
  '平静', '快乐', '焦虑', '悲伤', '恐惧', '奇幻', '神秘', '温馨'
]

export const PAGE_SIZE = 10
