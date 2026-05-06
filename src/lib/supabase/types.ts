export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          profile: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          profile?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      assessments: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          started_at: string;
          completed_at: string | null;
          score_summary: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          score_summary?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assessments"]["Insert"]>;
        Relationships: [];
      };
      assessment_answers: {
        Row: {
          id: string;
          user_id: string;
          assessment_id: string;
          question_id: string;
          option_key: string;
          trait_effects: Json;
          answered_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_id: string;
          question_id: string;
          option_key: string;
          trait_effects?: Json;
          answered_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assessment_answers"]["Insert"]>;
        Relationships: [];
      };
      psychometric_profiles: {
        Row: {
          id: string;
          user_id: string;
          assessment_id: string;
          profile: Json;
          confidence_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_id: string;
          profile?: Json;
          confidence_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["psychometric_profiles"]["Insert"]>;
        Relationships: [];
      };
      career_recommendations: {
        Row: {
          id: string;
          user_id: string;
          assessment_id: string | null;
          recommendations: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_id?: string | null;
          recommendations?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["career_recommendations"]["Insert"]>;
        Relationships: [];
      };
      selected_careers: {
        Row: {
          id: string;
          user_id: string;
          career_recommendation_id: string | null;
          career_id: string;
          career_title: string;
          selection: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          career_recommendation_id?: string | null;
          career_id: string;
          career_title: string;
          selection?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["selected_careers"]["Insert"]>;
        Relationships: [];
      };
      roadmaps: {
        Row: {
          id: string;
          user_id: string;
          selected_career_id: string | null;
          roadmap: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          selected_career_id?: string | null;
          roadmap?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadmaps"]["Insert"]>;
        Relationships: [];
      };
      roadmap_progress: {
        Row: {
          id: string;
          user_id: string;
          roadmap_id: string;
          milestone_id: string;
          task_id: string;
          completed: boolean;
          completed_at: string | null;
          progress: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          roadmap_id: string;
          milestone_id: string;
          task_id: string;
          completed?: boolean;
          completed_at?: string | null;
          progress?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadmap_progress"]["Insert"]>;
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          content: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          content: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
