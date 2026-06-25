import { get, patch } from './request'
import { Notification } from '../types/notification'

export function getNotifications(skip = 0, limit = 20, unreadOnly = false) {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  })
  if (unreadOnly) params.set('unread_only', 'true')
  return get<Notification[]>(`/notifications?${params.toString()}`)
}

export function getUnreadCount() {
  return get<number>('/notifications/unread-count')
}

export function markAsRead(id: string) {
  return patch(`/notifications/${id}/read`)
}

export function markAllAsRead() {
  return patch('/notifications/read-all')
}
