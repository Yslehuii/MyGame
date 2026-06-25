export interface Dream {
  id: string
  user_id: string
  title?: string
  content: string
  elements?: Record<string, any>
  interpretation?: string
  psychological_insight?: string
  mood_score?: number
  crisis_detected: boolean
  tags?: string[]
  image_url?: string
  image_style?: string
  is_shared: boolean
  is_pending_review?: boolean
  review_status?: string
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  author_nickname?: string
  author_avatar?: string
  is_liked?: boolean
}

export interface DreamCreateParams {
  content: string
  title?: string
  generate_image?: boolean
  art_style?: string
  is_shared?: boolean
}

export interface Comment {
  id: string
  user_id: string
  dream_id: string
  content: string
  parent_id?: string
  created_at: string
  author_nickname?: string
  author_avatar?: string
}
