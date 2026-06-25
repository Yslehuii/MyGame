export interface Notification {
  id: string
  type: string // like, comment, follow, system
  title?: string
  content?: string
  sender_id?: string
  target_type?: string
  target_id?: string
  is_read: boolean
  created_at: string
}
