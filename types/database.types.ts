export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          mobile_number: string | null
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          mobile_number?: string | null
          role?: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          mobile_number?: string | null
          role?: 'admin' | 'user'
          created_at?: string
        }
      }
      images: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          location: string
          cloudinary_url: string
          cloudinary_public_id: string
          is_verified: boolean
          camera_model: string | null
          gps_latitude: number | null
          gps_longitude: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          location: string
          cloudinary_url: string
          cloudinary_public_id: string
          is_verified?: boolean
          camera_model?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          location?: string
          cloudinary_url?: string
          cloudinary_public_id?: string
          is_verified?: boolean
          camera_model?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          created_at?: string
        }
      }
    }
  }
}
