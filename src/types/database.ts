// Auto-generated types from Supabase schema
// Do not edit column names without updating migrations

export type IdeaStatus = 'active' | 'threshold_reached' | 'building' | 'launched'
export type SupportType = 'vote' | 'pledge'
export type IdeaCategory = 'automation' | 'creativity' | 'productivity' | 'analysis' | 'other'

export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  created_at: string
}

export interface Idea {
  id: string
  created_at: string
  title: string
  description: string
  submitter_id: string | null
  category: IdeaCategory
  status: IdeaStatus
  vote_count: number
  backer_count: number
  vote_threshold: number
  funding_goal: number | null    // cents, Phase 2 only
  funding_raised: number          // cents
  tags: string[]
  image_url: string | null
}

export interface Support {
  id: string
  created_at: string
  idea_id: string
  user_id: string
  type: SupportType
  amount: number | null           // cents, Phase 2 pledges only
}

export interface Comment {
  id: string
  created_at: string
  idea_id: string
  user_id: string
  content: string
  parent_id: string | null        // threading
}

// Joined types for UI
export interface IdeaWithProfile extends Idea {
  profiles: Pick<Profile, 'username' | 'avatar_url'> | null
}

export interface CommentWithProfile extends Comment {
  profiles: Pick<Profile, 'username' | 'avatar_url'> | null
  replies?: CommentWithProfile[]
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      ideas: {
        Row: Idea
        Insert: Omit<Idea, 'id' | 'created_at' | 'vote_count' | 'backer_count' | 'funding_raised'>
        Update: Partial<Omit<Idea, 'id' | 'created_at'>>
      }
      supports: {
        Row: Support
        Insert: Omit<Support, 'id' | 'created_at'>
        Update: never
      }
      comments: {
        Row: Comment
        Insert: Omit<Comment, 'id' | 'created_at'>
        Update: Partial<Pick<Comment, 'content'>>
      }
    }
  }
}
