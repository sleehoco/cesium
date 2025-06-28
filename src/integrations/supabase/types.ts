export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
