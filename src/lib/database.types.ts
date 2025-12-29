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
          email: string | null
          full_name: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: string
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          is_active?: boolean
          created_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          subject_id: string | null
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          subject_id?: string | null
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string | null
          name?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          subject_id: string | null
          chapter_id: string | null
          question_text: string | null
          question_image_url: string | null
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          correct_option: string | null
          explanation: string | null
          difficulty: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subject_id?: string | null
          chapter_id?: string | null
          question_text?: string | null
          question_image_url?: string | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          correct_option?: string | null
          explanation?: string | null
          difficulty?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string | null
          chapter_id?: string | null
          question_text?: string | null
          question_image_url?: string | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          correct_option?: string | null
          explanation?: string | null
          difficulty?: string
          created_by?: string | null
          created_at?: string
        }
      }
      question_categories: {
        Row: {
          id: string
          question_id: string | null
          category_id: string | null
        }
        Insert: {
          id?: string
          question_id?: string | null
          category_id?: string | null
        }
        Update: {
          id?: string
          question_id?: string | null
          category_id?: string | null
        }
      }
      student_attempts: {
        Row: {
          id: string
          student_id: string | null
          question_id: string | null
          selected_option: string | null
          is_correct: boolean | null
          attempted_at: string
        }
        Insert: {
          id?: string
          student_id?: string | null
          question_id?: string | null
          selected_option?: string | null
          is_correct?: boolean | null
          attempted_at?: string
        }
        Update: {
          id?: string
          student_id?: string | null
          question_id?: string | null
          selected_option?: string | null
          is_correct?: boolean | null
          attempted_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
