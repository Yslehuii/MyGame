import { get, put, post, del } from './request'
import { User, UserProfile } from '../types/user'
import { Dream } from '../types/dream'

export function getMyProfile() {
  return get<User>('/auth/me')
}

export function getUserById(id: string) {
  return get<any>(`/users/${id}`)
}

export function getUserDreams(userId: string, skip = 0, limit = 20) {
  return get<Dream[]>(`/dreams/user/${userId}?skip=${skip}&limit=${limit}`)
}

export function updateProfile(data: UserProfile) {
  return put<User>('/users/me', data)
}

export function followUser(id: string) {
  return post(`/users/follow/${id}`)
}

export function unfollowUser(id: string) {
  return del(`/users/follow/${id}`)
}
