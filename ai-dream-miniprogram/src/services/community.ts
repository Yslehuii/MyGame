import { get, post, del } from './request'
import { Dream, Comment } from '../types/dream'

export function getCommunityFeed(skip = 0, limit = 20, sort = 'latest') {
  return get<Dream[]>(`/community/feed?skip=${skip}&limit=${limit}&sort=${sort}`)
}

export function toggleLike(id: string) {
  return post(`/community/${id}/like`)
}

export function getComments(dreamId: string) {
  return get<Comment[]>(`/community/${dreamId}/comments`)
}

export function postComment(dreamId: string, content: string) {
  return post<Comment>(`/community/${dreamId}/comments`, { content })
}

export function deleteComment(commentId: string) {
  return del(`/community/comments/${commentId}`)
}

export function reportDream(dreamId: string, reason: string) {
  return post(`/community/${dreamId}/report`, { reason })
}
