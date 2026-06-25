import { get, post, del, patch } from './request'
import { Dream, DreamCreateParams } from '../types/dream'

export function getMyDreams(skip = 0, limit = 20) {
  return get<Dream[]>(`/dreams/my?skip=${skip}&limit=${limit}`)
}

export function getLikedDreams(skip = 0, limit = 20) {
  return get<Dream[]>(`/dreams/liked?skip=${skip}&limit=${limit}`)
}

export function getDreamDetail(id: string) {
  return get<Dream>(`/dreams/${id}`)
}

export function createDream(data: DreamCreateParams) {
  return post<Dream>('/dreams', data)
}

export function deleteDream(id: string) {
  return del(`/dreams/${id}`)
}

export function toggleShare(id: string, is_shared: boolean) {
  return patch<Dream>(`/dreams/${id}/share`, { is_shared })
}

// 管理后台 API
export function getPendingDreams(skip = 0, limit = 20) {
  return get<Dream[]>(`/dreams/admin/pending?skip=${skip}&limit=${limit}`)
}

export function reviewDream(id: string, action: 'approve' | 'reject') {
  return post(`/dreams/admin/review/${id}`, { action })
}
