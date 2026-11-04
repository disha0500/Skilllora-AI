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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bias_audit_logs: {
        Row: {
          break_penalty_detected: boolean | null
          break_penalty_neutralized: boolean | null
          candidate_id: string | null
          checks_passed: string
          created_at: string | null
          event_type: string
          fairness_score: number | null
          id: string
          job_id: string | null
          mitigation_notes: string | null
          observations: string
        }
        Insert: {
          break_penalty_detected?: boolean | null
          break_penalty_neutralized?: boolean | null
          candidate_id?: string | null
          checks_passed?: string
          created_at?: string | null
          event_type: string
          fairness_score?: number | null
          id: string
          job_id?: string | null
          mitigation_notes?: string | null
          observations?: string
        }
        Update: {
          break_penalty_detected?: boolean | null
          break_penalty_neutralized?: boolean | null
          candidate_id?: string | null
          checks_passed?: string
          created_at?: string | null
          event_type?: string
          fairness_score?: number | null
          id?: string
          job_id?: string | null
          mitigation_notes?: string | null
          observations?: string
        }
        Relationships: []
      }
      candidate_skills: {
        Row: {
          candidate_id: string
          category: string | null
          confidence_score: number | null
          id: string
          is_transferable: boolean | null
          name: string
          proficiency: string | null
          transferred_from_responsibility: string | null
          validation_status: string | null
        }
        Insert: {
          candidate_id: string
          category?: string | null
          confidence_score?: number | null
          id: string
          is_transferable?: boolean | null
          name: string
          proficiency?: string | null
          transferred_from_responsibility?: string | null
          validation_status?: string | null
        }
        Update: {
          candidate_id?: string
          category?: string | null
          confidence_score?: number | null
          id?: string
          is_transferable?: boolean | null
          name?: string
          proficiency?: string | null
          transferred_from_responsibility?: string | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_skills_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          bio: string | null
          career_break_reason: string | null
          career_break_years: number | null
          created_at: string | null
          current_or_previous_role: string
          email: string
          has_career_break: boolean | null
          id: string
          location: string
          name: string
          phone: string | null
          target_role: string
          total_years_experience: number | null
        }
        Insert: {
          bio?: string | null
          career_break_reason?: string | null
          career_break_years?: number | null
          created_at?: string | null
          current_or_previous_role: string
          email: string
          has_career_break?: boolean | null
          id: string
          location?: string
          name: string
          phone?: string | null
          target_role: string
          total_years_experience?: number | null
        }
        Update: {
          bio?: string | null
          career_break_reason?: string | null
          career_break_years?: number | null
          created_at?: string | null
          current_or_previous_role?: string
          email?: string
          has_career_break?: boolean | null
          id?: string
          location?: string
          name?: string
          phone?: string | null
          target_role?: string
          total_years_experience?: number | null
        }
        Relationships: []
      }
      course_resources: {
        Row: {
          description: string | null
          duration_hours: number | null
          id: string
          is_sap_official: boolean | null
          level: string | null
          provider: string | null
          rating: number | null
          skills_covered: Json
          title: string
          url: string
        }
        Insert: {
          description?: string | null
          duration_hours?: number | null
          id: string
          is_sap_official?: boolean | null
          level?: string | null
          provider?: string | null
          rating?: number | null
          skills_covered?: Json
          title: string
          url: string
        }
        Update: {
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_sap_official?: boolean | null
          level?: string | null
          provider?: string | null
          rating?: number | null
          skills_covered?: Json
          title?: string
          url?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          career_break_friendly: boolean | null
          company: string
          department: string | null
          description: string
          experience_level: string | null
          id: string
          location: string
          min_years_exp: number | null
          posted_date: string | null
          preferred_skills: Json
          required_skills: Json
          salary_range: string | null
          title: string
          transferable_acceptable_skills: Json | null
        }
        Insert: {
          career_break_friendly?: boolean | null
          company: string
          department?: string | null
          description: string
          experience_level?: string | null
          id: string
          location: string
          min_years_exp?: number | null
          posted_date?: string | null
          preferred_skills?: Json
          required_skills?: Json
          salary_range?: string | null
          title: string
          transferable_acceptable_skills?: Json | null
        }
        Update: {
          career_break_friendly?: boolean | null
          company?: string
          department?: string | null
          description?: string
          experience_level?: string | null
          id?: string
          location?: string
          min_years_exp?: number | null
          posted_date?: string | null
          preferred_skills?: Json
          required_skills?: Json
          salary_range?: string | null
          title?: string
          transferable_acceptable_skills?: Json | null
        }
        Relationships: []
      }
      skill_evidence: {
        Row: {
          action: string | null
          candidate_id: string
          candidate_skill_id: string | null
          created_at: string | null
          id: string
          missing_details: string | null
          raw_evidence_text: string | null
          result: string | null
          rubric_feedback: string | null
          situation: string | null
          skill_name: string
          suggested_followup_tasks: string | null
          task: string | null
          validation_score: number | null
          validation_status: string | null
        }
        Insert: {
          action?: string | null
          candidate_id: string
          candidate_skill_id?: string | null
          created_at?: string | null
          id: string
          missing_details?: string | null
          raw_evidence_text?: string | null
          result?: string | null
          rubric_feedback?: string | null
          situation?: string | null
          skill_name: string
          suggested_followup_tasks?: string | null
          task?: string | null
          validation_score?: number | null
          validation_status?: string | null
        }
        Update: {
          action?: string | null
          candidate_id?: string
          candidate_skill_id?: string | null
          created_at?: string | null
          id?: string
          missing_details?: string | null
          raw_evidence_text?: string | null
          result?: string | null
          rubric_feedback?: string | null
          situation?: string | null
          skill_name?: string
          suggested_followup_tasks?: string | null
          task?: string | null
          validation_score?: number | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_evidence_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_evidence_candidate_skill_id_fkey"
            columns: ["candidate_skill_id"]
            isOneToOne: false
            referencedRelation: "candidate_skills"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
