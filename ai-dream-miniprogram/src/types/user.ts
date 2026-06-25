export interface User {
  id: string
  uid?: string
  email: string
  username: string
  nickname?: string
  avatar?: string
  bio?: string
  preferred_art_style?: string
  is_superuser?: boolean
  created_at: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface UserProfile {
  nickname?: string
  bio?: string
  avatar?: string
  preferred_art_style?: string
}
