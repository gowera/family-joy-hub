export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string
          enrollment_id: string
          id: string
          notes: string | null
          present: boolean | null
          session_date: string
        }
        Insert: {
          created_at?: string
          enrollment_id: string
          id?: string
          notes?: string | null
          present?: boolean | null
          session_date: string
        }
        Update: {
          created_at?: string
          enrollment_id?: string
          id?: string
          notes?: string | null
          present?: boolean | null
          session_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          allergies: string | null
          created_at: string
          date_of_birth: string
          full_name: string
          id: string
          medical_conditions: string | null
          medication: string | null
          parent_id: string
          photo_consent: boolean | null
          special_needs: string | null
          updated_at: string
        }
        Insert: {
          allergies?: string | null
          created_at?: string
          date_of_birth: string
          full_name: string
          id?: string
          medical_conditions?: string | null
          medication?: string | null
          parent_id: string
          photo_consent?: boolean | null
          special_needs?: string | null
          updated_at?: string
        }
        Update: {
          allergies?: string | null
          created_at?: string
          date_of_birth?: string
          full_name?: string
          id?: string
          medical_conditions?: string | null
          medication?: string | null
          parent_id?: string
          photo_consent?: boolean | null
          special_needs?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          child_id: string
          created_at: string
          days_attending: string[] | null
          end_date: string | null
          enrollment_date: string
          id: string
          notes: string | null
          program_id: string
          start_date: string
          status: Database["public"]["Enums"]["enrollment_status"] | null
          updated_at: string
        }
        Insert: {
          child_id: string
          created_at?: string
          days_attending?: string[] | null
          end_date?: string | null
          enrollment_date?: string
          id?: string
          notes?: string | null
          program_id: string
          start_date: string
          status?: Database["public"]["Enums"]["enrollment_status"] | null
          updated_at?: string
        }
        Update: {
          child_id?: string
          created_at?: string
          days_attending?: string[] | null
          end_date?: string | null
          enrollment_date?: string
          id?: string
          notes?: string | null
          program_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["enrollment_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          address: string | null
          created_at: string
          email: string
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name: string
          id?: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          enrollment_id: string
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          reference: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          enrollment_id: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          enrollment_id?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          max_capacity: number | null
          name: string
          price_per_session: number | null
          session_days: string[]
          session_time: string
          start_date: string
          total_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          max_capacity?: number | null
          name: string
          price_per_session?: number | null
          session_days: string[]
          session_time: string
          start_date: string
          total_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          max_capacity?: number | null
          name?: string
          price_per_session?: number | null
          session_days?: string[]
          session_time?: string
          start_date?: string
          total_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          answers: Json
          created_at: string
          id: string
          survey_type: string
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          survey_type: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          survey_type?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string | null
          category: string
          content: string
          created_at: string
          id: string
          is_featured: boolean | null
          program_id: string | null
        }
        Insert: {
          author_name?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          program_id?: string | null
        }
        Update: {
          author_name?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          program_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_comments: {
        Row: {
          author: string
          content: string
          created_at: string
          fingerprint: string
          id: string
          video_id: number
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          fingerprint: string
          id?: string
          video_id: number
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          fingerprint?: string
          id?: string
          video_id?: number
        }
        Relationships: []
      }
      video_reactions: {
        Row: {
          created_at: string
          fingerprint: string
          kind: string
          video_id: number
        }
        Insert: {
          created_at?: string
          fingerprint: string
          kind: string
          video_id: number
        }
        Update: {
          created_at?: string
          fingerprint?: string
          kind?: string
          video_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_add_user_role: {
        Args: {
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      get_my_video_reactions: {
        Args: { _fingerprint: string }
        Returns: {
          kind: string
          video_id: number
        }[]
      }
      get_public_survey_responses: {
        Args: never
        Returns: {
          answers: Json
          created_at: string
          id: string
          survey_type: string
        }[]
      }
      get_users_with_roles: {
        Args: never
        Returns: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_email: string
          user_id: string
        }[]
      }
      get_video_comments: {
        Args: { _video_id: number }
        Returns: {
          author: string
          content: string
          created_at: string
          id: string
          video_id: number
        }[]
      }
      get_video_stats: {
        Args: never
        Returns: {
          comments: number
          likes: number
          saves: number
          shares: number
          video_id: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      remove_video_reaction: {
        Args: { _fingerprint: string; _kind: string; _video_id: number }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "viewer"
      enrollment_status: "active" | "completed" | "cancelled" | "waitlist"
      payment_method: "bank_transfer" | "card" | "cash" | "other"
      payment_status: "pending" | "paid" | "partial" | "refunded"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "staff", "viewer"],
      enrollment_status: ["active", "completed", "cancelled", "waitlist"],
      payment_method: ["bank_transfer", "card", "cash", "other"],
      payment_status: ["pending", "paid", "partial", "refunded"],
    },
  },
} as const
