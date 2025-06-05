export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      books: {
        Row: {
          book_number: number
          created_at: string | null
          format: string | null
          identifier: string
          identifier_de: string | null
          language: string | null
          metadata: Json | null
          testament: string
          title_de: string
          title_en: string
        }
        Insert: {
          book_number: number
          created_at?: string | null
          format?: string | null
          identifier: string
          identifier_de?: string | null
          language?: string | null
          metadata?: Json | null
          testament: string
          title_de: string
          title_en: string
        }
        Update: {
          book_number?: number
          created_at?: string | null
          format?: string | null
          identifier?: string
          identifier_de?: string | null
          language?: string | null
          metadata?: Json | null
          testament?: string
          title_de?: string
          title_en?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          book_number: number
          chapter_number: number
          created_at: string | null
          metadata: Json | null
        }
        Insert: {
          book_number: number
          chapter_number: number
          created_at?: string | null
          metadata?: Json | null
        }
        Update: {
          book_number?: number
          chapter_number?: number
          created_at?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_number_fkey"
            columns: ["book_number"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["book_number"]
          },
        ]
      }
      customers: {
        Row: {
          id: string
          subscription_customer_id: string | null
        }
        Insert: {
          id: string
          subscription_customer_id?: string | null
        }
        Update: {
          id?: string
          subscription_customer_id?: string | null
        }
        Relationships: []
      }
      exegesis_english: {
        Row: {
          author_image: string | null
          author_name: string
          book_number: number | null
          century: string
          chapter_number: number | null
          content: string
          created_at: string | null
          ektype: number
          exegesis_id: number | null
          id: number
          updated_at: string | null
          verse_number: number | null
        }
        Insert: {
          author_image?: string | null
          author_name: string
          book_number?: number | null
          century: string
          chapter_number?: number | null
          content: string
          created_at?: string | null
          ektype: number
          exegesis_id?: number | null
          id?: number
          updated_at?: string | null
          verse_number?: number | null
        }
        Update: {
          author_image?: string | null
          author_name?: string
          book_number?: number | null
          century?: string
          chapter_number?: number | null
          content?: string
          created_at?: string | null
          ektype?: number
          exegesis_id?: number | null
          id?: number
          updated_at?: string | null
          verse_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exegesis_english_book_number_chapter_number_verse_number_fkey"
            columns: ["book_number", "chapter_number", "verse_number"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["book_number", "chapter_number", "verse_number"]
          },
        ]
      }
      exegesis_german: {
        Row: {
          author_image: string | null
          author_name: string
          book_number: number | null
          century: string
          chapter_number: number | null
          content: string
          created_at: string | null
          ektype: number
          exegesis_id: number | null
          id: number
          updated_at: string | null
          verse_number: number | null
        }
        Insert: {
          author_image?: string | null
          author_name: string
          book_number?: number | null
          century: string
          chapter_number?: number | null
          content: string
          created_at?: string | null
          ektype: number
          exegesis_id?: number | null
          id?: number
          updated_at?: string | null
          verse_number?: number | null
        }
        Update: {
          author_image?: string | null
          author_name?: string
          book_number?: number | null
          century?: string
          chapter_number?: number | null
          content?: string
          created_at?: string | null
          ektype?: number
          exegesis_id?: number | null
          id?: number
          updated_at?: string | null
          verse_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exegesis_german_book_number_chapter_number_verse_number_fkey"
            columns: ["book_number", "chapter_number", "verse_number"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["book_number", "chapter_number", "verse_number"]
          },
        ]
      }
      exegesis_reporting: {
        Row: {
          created_at: string
          exegesis_id_english: number | null
          exegesis_id_german: number | null
          id: number
          improvement: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          exegesis_id_english?: number | null
          exegesis_id_german?: number | null
          id?: number
          improvement?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          exegesis_id_english?: number | null
          exegesis_id_german?: number | null
          id?: number
          improvement?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exegesis_reporting_exegesis_id_english_fkey"
            columns: ["exegesis_id_english"]
            isOneToOne: false
            referencedRelation: "exegesis_english"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exegesis_reporting_exegesis_id_german_fkey"
            columns: ["exegesis_id_german"]
            isOneToOne: false
            referencedRelation: "exegesis_german"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exegesis_reporting_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      folder_items: {
        Row: {
          created_at: string | null
          folder_id: number | null
          id: number
          is_private: boolean | null
          item_content: Json | null
          item_type: string
          notes: string | null
        }
        Insert: {
          created_at?: string | null
          folder_id?: number | null
          id?: number
          is_private?: boolean | null
          item_content?: Json | null
          item_type: string
          notes?: string | null
        }
        Update: {
          created_at?: string | null
          folder_id?: number | null
          id?: number
          is_private?: boolean | null
          item_content?: Json | null
          item_type?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folder_items_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string | null
          id: number
          is_private: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_private?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_private?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      highlights: {
        Row: {
          book_number: number | null
          chapter_number: number | null
          color: string
          created_at: string | null
          id: number
          user_id: string | null
          verse_number: number | null
        }
        Insert: {
          book_number?: number | null
          chapter_number?: number | null
          color: string
          created_at?: string | null
          id?: number
          user_id?: string | null
          verse_number?: number | null
        }
        Update: {
          book_number?: number | null
          chapter_number?: number | null
          color?: string
          created_at?: string | null
          id?: number
          user_id?: string | null
          verse_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "highlights_book_number_chapter_number_verse_number_fkey"
            columns: ["book_number", "chapter_number", "verse_number"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["book_number", "chapter_number", "verse_number"]
          },
          {
            foreignKeyName: "highlights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      library_books: {
        Row: {
          created_at: string | null
          file_path: string
          file_type: string | null
          id: string
          metadata: Json | null
          price: number
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_type?: string | null
          id?: string
          metadata?: Json | null
          price: number
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_type?: string | null
          id?: string
          metadata?: Json | null
          price?: number
        }
        Relationships: []
      }
      notes: {
        Row: {
          book_number: number | null
          chapter_number: number | null
          content: string
          created_at: string | null
          id: number
          is_private: boolean | null
          updated_at: string | null
          user_id: string | null
          verse_number: number | null
        }
        Insert: {
          book_number?: number | null
          chapter_number?: number | null
          content: string
          created_at?: string | null
          id?: number
          is_private?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          verse_number?: number | null
        }
        Update: {
          book_number?: number | null
          chapter_number?: number | null
          content?: string
          created_at?: string | null
          id?: number
          is_private?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          verse_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_book_number_chapter_number_verse_number_fkey"
            columns: ["book_number", "chapter_number", "verse_number"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["book_number", "chapter_number", "verse_number"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_invites: {
        Row: {
          email: string
        }
        Insert: {
          email?: string
        }
        Update: {
          email?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          discount: number | null
          expiry_date: string
          id: string
          influencer: string | null
          max_redemptions: number | null
          platform: string | null
          redeemed_count: number | null
          subscription_android_id: string | null
          subscription_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          discount?: number | null
          expiry_date: string
          id?: string
          influencer?: string | null
          max_redemptions?: number | null
          platform?: string | null
          redeemed_count?: number | null
          subscription_android_id?: string | null
          subscription_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          discount?: number | null
          expiry_date?: string
          id?: string
          influencer?: string | null
          max_redemptions?: number | null
          platform?: string | null
          redeemed_count?: number | null
          subscription_android_id?: string | null
          subscription_id?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          created_at: string
          id: number
          library_book_id: string | null
          transaction_details: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          library_book_id?: string | null
          transaction_details?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          library_book_id?: string | null
          transaction_details?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_library_book_id_fkey"
            columns: ["library_book_id"]
            isOneToOne: false
            referencedRelation: "library_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          customer_id: string | null
          device_info: Json | null
          email: string | null
          external_active: string | null
          id: string
          is_pre_signed: boolean | null
          phone: string | null
          preferences: Json | null
          purchase_date: string | null
          referrer_promo: string | null
          subscription_expiry: string | null
          subscription_plan: string | null
          subscription_status: string | null
          transaction_id: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          device_info?: Json | null
          email?: string | null
          external_active?: string | null
          id?: string
          is_pre_signed?: boolean | null
          phone?: string | null
          preferences?: Json | null
          purchase_date?: string | null
          referrer_promo?: string | null
          subscription_expiry?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          transaction_id?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          device_info?: Json | null
          email?: string | null
          external_active?: string | null
          id?: string
          is_pre_signed?: boolean | null
          phone?: string | null
          preferences?: Json | null
          purchase_date?: string | null
          referrer_promo?: string | null
          subscription_expiry?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          transaction_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      verses: {
        Row: {
          book_number: number
          chapter_number: number
          commentary: Json | null
          created_at: string | null
          is_encrypted: boolean | null
          text_de: string
          text_en: string
          verse_number: number
        }
        Insert: {
          book_number: number
          chapter_number: number
          commentary?: Json | null
          created_at?: string | null
          is_encrypted?: boolean | null
          text_de?: string
          text_en?: string
          verse_number: number
        }
        Update: {
          book_number?: number
          chapter_number?: number
          commentary?: Json | null
          created_at?: string | null
          is_encrypted?: boolean | null
          text_de?: string
          text_en?: string
          verse_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "verses_book_number_chapter_number_fkey"
            columns: ["book_number", "chapter_number"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["book_number", "chapter_number"]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
