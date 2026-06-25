export interface Notification {
  id: string
  type: string // like, comment, follow, system
  title: string
  content?: string
  source_id?: string
  source_type?: string
  is_read: boolean
  created_at: string
}
