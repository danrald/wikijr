// Database types for the Supabase schema defined in backend/supabase/migrations.
// Hand-written to match `supabase gen types typescript` output; regenerate with
// `npm run gen:types` (requires the local Supabase stack running via Docker).
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
      Test: {
        Row: {
          id: number
          created_at: string
          Name: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          Name?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          Name?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          id: string
          slug: string
          title: string
          content: string | null
          tags: string[]
          author_id: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content?: string | null
          tags?: string[]
          author_id?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string | null
          tags?: string[]
          author_id?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pages_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'pages'
            referencedColumns: ['id']
          },
        ]
      }
      page_versions: {
        Row: {
          id: string
          page_id: string
          title: string
          content: string | null
          tags: string[]
          edited_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          title: string
          content?: string | null
          tags?: string[]
          edited_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          title?: string
          content?: string | null
          tags?: string[]
          edited_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'page_versions_page_id_fkey'
            columns: ['page_id']
            isOneToOne: false
            referencedRelation: 'pages'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
