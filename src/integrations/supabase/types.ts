export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          from_date: string | null
          id: string
          is_current: boolean | null
          personal_info_id: string
          postal_code: string
          state: string
          to_date: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          from_date?: string | null
          id?: string
          is_current?: boolean | null
          personal_info_id: string
          postal_code: string
          state: string
          to_date?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          from_date?: string | null
          id?: string
          is_current?: boolean | null
          personal_info_id?: string
          postal_code?: string
          state?: string
          to_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_personal_info_id_fkey"
            columns: ["personal_info_id"]
            isOneToOne: false
            referencedRelation: "personal_information"
            referencedColumns: ["id"]
          },
        ]
      }
      aliases: {
        Row: {
          alias_name: string
          created_at: string
          id: string
          personal_info_id: string
        }
        Insert: {
          alias_name: string
          created_at?: string
          id?: string
          personal_info_id: string
        }
        Update: {
          alias_name?: string
          created_at?: string
          id?: string
          personal_info_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aliases_personal_info_id_fkey"
            columns: ["personal_info_id"]
            isOneToOne: false
            referencedRelation: "personal_information"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_attempts: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          evidence_url: string | null
          id: string
          needs_verification: boolean | null
          removal_request_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["automation_status"]
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          evidence_url?: string | null
          id?: string
          needs_verification?: boolean | null
          removal_request_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["automation_status"]
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          evidence_url?: string | null
          id?: string
          needs_verification?: boolean | null
          removal_request_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["automation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_attempts_removal_request_id_fkey"
            columns: ["removal_request_id"]
            isOneToOne: false
            referencedRelation: "removal_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          blog_post_id: string
          blog_tag_id: string
          id: string
        }
        Insert: {
          blog_post_id: string
          blog_tag_id: string
          id?: string
        }
        Update: {
          blog_post_id?: string
          blog_tag_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_blog_tag_id_fkey"
            columns: ["blog_tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          ai_generated_summary: string | null
          ai_keywords: Json | null
          ai_seo_score: number | null
          author_id: string
          canonical_url: string | null
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image_url: string | null
          og_title: string | null
          published_at: string | null
          read_time_minutes: number | null
          slug: string
          status: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          ai_generated_summary?: string | null
          ai_keywords?: Json | null
          ai_seo_score?: number | null
          author_id: string
          canonical_url?: string | null
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          ai_generated_summary?: string | null
          ai_keywords?: Json | null
          ai_seo_score?: number | null
          author_id?: string
          canonical_url?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      broker_removal_processes: {
        Row: {
          broker_id: string
          created_at: string
          created_by: string | null
          effective_from: string
          id: string
          process_details: string
          version: number
        }
        Insert: {
          broker_id: string
          created_at?: string
          created_by?: string | null
          effective_from?: string
          id?: string
          process_details: string
          version: number
        }
        Update: {
          broker_id?: string
          created_at?: string
          created_by?: string | null
          effective_from?: string
          id?: string
          process_details?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "broker_removal_processes_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "data_brokers"
            referencedColumns: ["id"]
          },
        ]
      }
      data_brokers: {
        Row: {
          created_at: string
          id: string
          name: string
          removal_process: string
          success_rate: number
          typical_timeframe: string
          updated_at: string
          website_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          removal_process: string
          success_rate: number
          typical_timeframe: string
          updated_at?: string
          website_url: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          removal_process?: string
          success_rate?: number
          typical_timeframe?: string
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      email_addresses: {
        Row: {
          created_at: string
          email: string
          id: string
          is_primary: boolean | null
          personal_info_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_primary?: boolean | null
          personal_info_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_primary?: boolean | null
          personal_info_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_addresses_personal_info_id_fkey"
            columns: ["personal_info_id"]
            isOneToOne: false
            referencedRelation: "personal_information"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_documents: {
        Row: {
          document_type: string | null
          file_path: string
          id: string
          personal_info_id: string
          uploaded_at: string
          verified: boolean | null
        }
        Insert: {
          document_type?: string | null
          file_path: string
          id?: string
          personal_info_id: string
          uploaded_at?: string
          verified?: boolean | null
        }
        Update: {
          document_type?: string | null
          file_path?: string
          id?: string
          personal_info_id?: string
          uploaded_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "identity_documents_personal_info_id_fkey"
            columns: ["personal_info_id"]
            isOneToOne: false
            referencedRelation: "personal_information"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_sends: {
        Row: {
          bounced_at: string | null
          clicked_at: string | null
          id: string
          newsletter_id: string
          opened_at: string | null
          sent_at: string
          subscriber_id: string
          unsubscribed_at: string | null
        }
        Insert: {
          bounced_at?: string | null
          clicked_at?: string | null
          id?: string
          newsletter_id: string
          opened_at?: string | null
          sent_at?: string
          subscriber_id: string
          unsubscribed_at?: string | null
        }
        Update: {
          bounced_at?: string | null
          clicked_at?: string | null
          id?: string
          newsletter_id?: string
          opened_at?: string | null
          sent_at?: string
          subscriber_id?: string
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_sends_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_sends_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "newsletter_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          preferences: Json | null
          status: string
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          preferences?: Json | null
          status?: string
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          preferences?: Json | null
          status?: string
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          click_count: number | null
          content: string
          created_at: string
          created_by: string | null
          html_content: string | null
          id: string
          open_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          subscriber_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          click_count?: number | null
          content: string
          created_at?: string
          created_by?: string | null
          html_content?: string | null
          id?: string
          open_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          subscriber_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          click_count?: number | null
          content?: string
          created_at?: string
          created_by?: string | null
          html_content?: string | null
          id?: string
          open_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          subscriber_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      personal_information: {
        Row: {
          created_at: string
          date_of_birth: string | null
          full_name: string
          id: string
          id_verification_complete: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          full_name: string
          id?: string
          id_verification_complete?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id?: string
          id_verification_complete?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      phone_numbers: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          personal_info_id: string
          phone_number: string
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          personal_info_id: string
          phone_number: string
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          personal_info_id?: string
          phone_number?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phone_numbers_personal_info_id_fkey"
            columns: ["personal_info_id"]
            isOneToOne: false
            referencedRelation: "personal_information"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          email_notifications: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      removal_request_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          created_by: string | null
          id: string
          removal_request_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          removal_request_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          removal_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "removal_request_activities_removal_request_id_fkey"
            columns: ["removal_request_id"]
            isOneToOne: false
            referencedRelation: "removal_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      removal_requests: {
        Row: {
          broker_id: string
          completed_at: string | null
          created_at: string
          id: string
          last_communication_date: string | null
          next_follow_up_date: string | null
          notes: string | null
          status: Database["public"]["Enums"]["removal_request_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          broker_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          last_communication_date?: string | null
          next_follow_up_date?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["removal_request_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          broker_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          last_communication_date?: string | null
          next_follow_up_date?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["removal_request_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "removal_requests_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "data_brokers"
            referencedColumns: ["id"]
          },
        ]
      }
      text_to_speech_logs: {
        Row: {
          character_count: number
          created_at: string
          id: string
          text_content: string
          user_id: string | null
          voice_id: string
        }
        Insert: {
          character_count: number
          created_at?: string
          id?: string
          text_content: string
          user_id?: string | null
          voice_id: string
        }
        Update: {
          character_count?: number
          created_at?: string
          id?: string
          text_content?: string
          user_id?: string | null
          voice_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { input_text: string }
        Returns: string
      }
      generate_speech: {
        Args: { text_content: string; voice_id: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "moderator"
      automation_status: "pending" | "in_progress" | "completed" | "failed"
      removal_request_status: "pending" | "in_progress" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "moderator"],
      automation_status: ["pending", "in_progress", "completed", "failed"],
      removal_request_status: ["pending", "in_progress", "completed", "failed"],
    },
  },
} as const
