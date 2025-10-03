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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      account_creation_requests: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          full_name: string
          id: string
          notes: string | null
          password_sent: boolean | null
          payment_id: string | null
          processed_at: string | null
          role_type: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          full_name: string
          id?: string
          notes?: string | null
          password_sent?: boolean | null
          payment_id?: string | null
          processed_at?: string | null
          role_type: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          password_sent?: boolean | null
          payment_id?: string | null
          processed_at?: string | null
          role_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_creation_requests_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          content: string | null
          feedback: string | null
          file_urls: string[] | null
          graded_at: string | null
          graded_by: string | null
          id: string
          score: number | null
          status: string | null
          submitted_at: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          content?: string | null
          feedback?: string | null
          file_urls?: string[] | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number | null
          status?: string | null
          submitted_at?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          content?: string | null
          feedback?: string | null
          file_urls?: string[] | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number | null
          status?: string | null
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          allow_late_submission: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          instructions: string | null
          lesson_id: string
          max_score: number | null
          rubric: Json | null
          submission_format: string | null
          title: string
          updated_at: string
        }
        Insert: {
          allow_late_submission?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          lesson_id: string
          max_score?: number | null
          rubric?: Json | null
          submission_format?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          allow_late_submission?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          lesson_id?: string
          max_score?: number | null
          rubric?: Json | null
          submission_format?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_users: {
        Row: {
          batch_id: string
          created_at: string
          created_by: string
          default_password: string
          id: string
          user_id: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          created_by: string
          default_password: string
          id?: string
          user_id: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          created_by?: string
          default_password?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_users_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_connections: {
        Row: {
          access_token: string | null
          api_key: string | null
          api_secret: string | null
          broker_name: string
          created_at: string
          id: string
          metadata: Json | null
          refresh_token: string | null
          request_token: string | null
          status: string
          token_expiry: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          api_key?: string | null
          api_secret?: string | null
          broker_name: string
          created_at?: string
          id?: string
          metadata?: Json | null
          refresh_token?: string | null
          request_token?: string | null
          status?: string
          token_expiry?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          api_key?: string | null
          api_secret?: string | null
          broker_name?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          refresh_token?: string | null
          request_token?: string | null
          status?: string
          token_expiry?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration: number | null
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          duration: number | null
          id: string
          instructor: string | null
          intro_video_url: string | null
          prerequisites: string[] | null
          price: number | null
          status: Database["public"]["Enums"]["course_status"] | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration?: number | null
          id?: string
          instructor?: string | null
          intro_video_url?: string | null
          prerequisites?: string[] | null
          price?: number | null
          status?: Database["public"]["Enums"]["course_status"] | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration?: number | null
          id?: string
          instructor?: string | null
          intro_video_url?: string | null
          prerequisites?: string[] | null
          price?: number | null
          status?: Database["public"]["Enums"]["course_status"] | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      funds: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          notes: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          file_type: string
          file_url: string
          id: string
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_type: string
          file_url: string
          id?: string
          order_index?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_type?: string
          file_url?: string
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gallery_settings: {
        Row: {
          id: string
          show_titles: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          show_titles?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          show_titles?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      lesson_discussions: {
        Row: {
          content: string
          created_at: string
          id: string
          lesson_id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lesson_id: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lesson_id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_discussions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_discussions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "lesson_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          content_data: Json | null
          created_at: string
          description: string | null
          duration: number | null
          id: string
          is_free: boolean | null
          lesson_type: string | null
          module_id: string
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          content_data?: Json | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          is_free?: boolean | null
          lesson_type?: string | null
          module_id: string
          order_index: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          content_data?: Json | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          is_free?: boolean | null
          lesson_type?: string | null
          module_id?: string
          order_index?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          color_tag: string | null
          content: string | null
          created_at: string
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color_tag?: string | null
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color_tag?: string | null
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          manual_verification_notes: string | null
          payment_type: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          manual_verification_notes?: string | null
          payment_type: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          manual_verification_notes?: string | null
          payment_type?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      playbooks: {
        Row: {
          created_at: string
          description: string | null
          entry_rules: string | null
          exit_rules: string | null
          id: string
          name: string
          notes: string | null
          risk_reward: string | null
          strategies: Json | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entry_rules?: string | null
          exit_rules?: string | null
          id?: string
          name: string
          notes?: string | null
          risk_reward?: string | null
          strategies?: Json | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entry_rules?: string | null
          exit_rules?: string | null
          id?: string
          name?: string
          notes?: string | null
          risk_reward?: string | null
          strategies?: Json | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          experience_level: string | null
          full_name: string | null
          id: string
          phone: string | null
          starting_fund: number | null
          trading_style: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          starting_fund?: number | null
          trading_style?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          starting_fund?: number | null
          trading_style?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_question_responses: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          points_earned: number | null
          question_id: string
          quiz_attempt_id: string
          time_spent: number | null
          user_answer: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct: boolean
          points_earned?: number | null
          question_id: string
          quiz_attempt_id: string
          time_spent?: number | null
          user_answer: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          points_earned?: number | null
          question_id?: string
          quiz_attempt_id?: string
          time_spent?: number | null
          user_answer?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_question_responses_quiz_attempt_id_fkey"
            columns: ["quiz_attempt_id"]
            isOneToOne: false
            referencedRelation: "user_quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          image_url: string | null
          options: Json | null
          order_index: number
          points: number | null
          question_settings: Json | null
          question_text: string
          question_type: string
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          image_url?: string | null
          options?: Json | null
          order_index: number
          points?: number | null
          question_settings?: Json | null
          question_text: string
          question_type: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          image_url?: string | null
          options?: Json | null
          order_index?: number
          points?: number | null
          question_settings?: Json | null
          question_text?: string
          question_type?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string | null
          created_at: string
          description: string | null
          id: string
          lesson_id: string | null
          module_id: string | null
          passing_score: number | null
          time_limit: number | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string | null
          module_id?: string | null
          passing_score?: number | null
          time_limit?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string | null
          module_id?: string | null
          passing_score?: number | null
          time_limit?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      real_results: {
        Row: {
          created_at: string
          id: string
          image_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_audit_log: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: string
          metadata: Json | null
          role_id: string | null
          target_user_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          metadata?: Json | null
          role_id?: string | null
          target_user_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          metadata?: Json | null
          role_id?: string | null
          target_user_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_audit_log_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          granted: boolean | null
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          role_id: string | null
        }
        Insert: {
          created_at?: string | null
          granted?: boolean | null
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          role_id?: string | null
        }
        Update: {
          created_at?: string | null
          granted?: boolean | null
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          hierarchy_level: number | null
          id: string
          is_system_role: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hierarchy_level?: number | null
          id?: string
          is_system_role?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hierarchy_level?: number | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          auto_renew: boolean | null
          billing_cycle: number | null
          created_at: string
          currency: string
          end_date: string | null
          id: string
          next_billing_date: string | null
          plan_type: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          razorpay_subscription_id: string | null
          start_date: string | null
          status: string
          total_cycles: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          auto_renew?: boolean | null
          billing_cycle?: number | null
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          next_billing_date?: string | null
          plan_type: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          razorpay_subscription_id?: string | null
          start_date?: string | null
          status?: string
          total_cycles?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          auto_renew?: boolean | null
          billing_cycle?: number | null
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          next_billing_date?: string | null
          plan_type?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          razorpay_subscription_id?: string | null
          start_date?: string | null
          status?: string
          total_cycles?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trade_extractions: {
        Row: {
          broker_type: string | null
          created_at: string
          extraction_confidence: number | null
          id: string
          image_data: string
          processed_trades: Json | null
          raw_extraction: Json | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          broker_type?: string | null
          created_at?: string
          extraction_confidence?: number | null
          id?: string
          image_data: string
          processed_trades?: Json | null
          raw_extraction?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          broker_type?: string | null
          created_at?: string
          extraction_confidence?: number | null
          id?: string
          image_data?: string
          processed_trades?: Json | null
          raw_extraction?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          created_at: string
          date: string
          entry_price: number | null
          entry_time: string | null
          exchange: string | null
          execution_rating: number | null
          exit_price: number | null
          exit_time: string | null
          id: string
          management_rating: number | null
          market_segment: string | null
          mood: string | null
          notes: string | null
          option_type: string | null
          playbook_id: string | null
          pnl: number | null
          position_type: string | null
          quantity: number | null
          risk_reward_ratio: string | null
          screenshots: string[] | null
          setup_rating: number | null
          strategy: string | null
          symbol: string
          tags: string[] | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          entry_price?: number | null
          entry_time?: string | null
          exchange?: string | null
          execution_rating?: number | null
          exit_price?: number | null
          exit_time?: string | null
          id?: string
          management_rating?: number | null
          market_segment?: string | null
          mood?: string | null
          notes?: string | null
          option_type?: string | null
          playbook_id?: string | null
          pnl?: number | null
          position_type?: string | null
          quantity?: number | null
          risk_reward_ratio?: string | null
          screenshots?: string[] | null
          setup_rating?: number | null
          strategy?: string | null
          symbol: string
          tags?: string[] | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          entry_price?: number | null
          entry_time?: string | null
          exchange?: string | null
          execution_rating?: number | null
          exit_price?: number | null
          exit_time?: string | null
          id?: string
          management_rating?: number | null
          market_segment?: string | null
          mood?: string | null
          notes?: string | null
          option_type?: string | null
          playbook_id?: string | null
          pnl?: number | null
          position_type?: string | null
          quantity?: number | null
          risk_reward_ratio?: string | null
          screenshots?: string[] | null
          setup_rating?: number | null
          strategy?: string | null
          symbol?: string
          tags?: string[] | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_data: Json | null
          achievement_type: string
          course_id: string | null
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_data?: Json | null
          achievement_type: string
          course_id?: string | null
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_data?: Json | null
          achievement_type?: string
          course_id?: string | null
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_enrollments: {
        Row: {
          completion_date: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          completion_date?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          id: string
          lesson_id: string
          user_id: string
          watch_time: number | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          id?: string
          lesson_id: string
          user_id: string
          watch_time?: number | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          id?: string
          lesson_id?: string
          user_id?: string
          watch_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_attempts: {
        Row: {
          answers: Json | null
          attempted_at: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          time_taken: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          attempted_at?: string
          id?: string
          passed: boolean
          quiz_id: string
          score: number
          time_taken?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          attempted_at?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          time_taken?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          expires_at: string | null
          id: string
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_role_to_user: {
        Args: { role_name: string; target_user_id: string }
        Returns: boolean
      }
      assign_user_role: {
        Args: {
          assigned_by_user_id?: string
          expires_at?: string
          role_name: string
          target_user_id: string
        }
        Returns: boolean
      }
      cleanup_expired_reset_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_course_module: {
        Args: { p_course_id: string; p_description?: string; p_title: string }
        Returns: {
          course_id: string
          created_at: string
          description: string | null
          duration: number | null
          id: string
          order_index: number
          title: string
          updated_at: string
        }
      }
      create_profile_for_user: {
        Args: {
          target_user_id: string
          user_email: string
          user_full_name?: string
        }
        Returns: boolean
      }
      current_user_has_page_permission: {
        Args: {
          page_permission: Database["public"]["Enums"]["permission_type"]
        }
        Returns: boolean
      }
      current_user_has_permission: {
        Args: {
          permission_name: Database["public"]["Enums"]["permission_type"]
        }
        Returns: boolean
      }
      delete_module_cascade: {
        Args: { p_module_id: string }
        Returns: boolean
      }
      get_all_playbooks_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          description: string | null
          entry_rules: string | null
          exit_rules: string | null
          id: string
          name: string
          notes: string | null
          risk_reward: string | null
          strategies: Json | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }[]
      }
      get_all_profiles_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string | null
          created_at: string
          email: string | null
          experience_level: string | null
          full_name: string | null
          id: string
          phone: string | null
          starting_fund: number | null
          trading_style: string | null
          updated_at: string
        }[]
      }
      get_all_trades_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          date: string
          entry_price: number | null
          entry_time: string | null
          exchange: string | null
          execution_rating: number | null
          exit_price: number | null
          exit_time: string | null
          id: string
          management_rating: number | null
          market_segment: string | null
          mood: string | null
          notes: string | null
          option_type: string | null
          playbook_id: string | null
          pnl: number | null
          position_type: string | null
          quantity: number | null
          risk_reward_ratio: string | null
          screenshots: string[] | null
          setup_rating: number | null
          strategy: string | null
          symbol: string
          tags: string[] | null
          type: string
          updated_at: string
          user_id: string
        }[]
      }
      get_user_permissions: {
        Args: { user_uuid: string }
        Returns: {
          permission: Database["public"]["Enums"]["permission_type"]
          role_name: string
        }[]
      }
      has_active_subscription: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      has_free_access: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      has_free_access_updated: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      has_role: {
        Args: { role_name: string; user_uuid: string }
        Returns: boolean
      }
      has_subscription_access: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin_bypass: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      is_admin_secure: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      is_super_admin_bypass: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      merge_duplicate_accounts: {
        Args: { keep_user_id: string; remove_user_id: string }
        Returns: boolean
      }
      remove_role_from_user: {
        Args: { role_name: string; target_user_id: string }
        Returns: boolean
      }
      reorder_modules: {
        Args: { p_module_updates: Json }
        Returns: boolean
      }
      should_upgrade_to_premium: {
        Args: { course_uuid: string; user_uuid: string }
        Returns: boolean
      }
      upgrade_academy_user_to_premium: {
        Args: { course_uuid: string; upgraded_by?: string; user_uuid: string }
        Returns: Json
      }
      user_has_page_permission: {
        Args: {
          page_permission: Database["public"]["Enums"]["permission_type"]
          user_uuid: string
        }
        Returns: boolean
      }
      user_has_permission: {
        Args: {
          permission_name: Database["public"]["Enums"]["permission_type"]
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      course_status: "draft" | "published" | "archived" | "trial" | "flagship"
      permission_type:
        | "access_dashboard"
        | "access_trades"
        | "access_calendar"
        | "access_playbooks"
        | "access_analytics"
        | "access_academy"
        | "access_notebook"
        | "access_funds"
        | "access_brokers"
        | "access_wiggly_ai"
        | "access_admin"
        | "create_trades"
        | "edit_trades"
        | "delete_trades"
        | "export_trades"
        | "create_playbooks"
        | "edit_playbooks"
        | "delete_playbooks"
        | "share_playbooks"
        | "create_notes"
        | "edit_notes"
        | "delete_notes"
        | "manage_funds"
        | "connect_brokers"
        | "use_ai_features"
        | "view_courses"
        | "enroll_courses"
        | "create_courses"
        | "edit_courses"
        | "delete_courses"
        | "manage_users"
        | "grade_assignments"
        | "moderate_discussions"
        | "manage_roles"
        | "manage_permissions"
        | "view_all_users"
        | "edit_user_profiles"
        | "delete_users"
        | "view_analytics"
        | "manage_subscriptions"
        | "system_settings"
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
      course_status: ["draft", "published", "archived", "trial", "flagship"],
      permission_type: [
        "access_dashboard",
        "access_trades",
        "access_calendar",
        "access_playbooks",
        "access_analytics",
        "access_academy",
        "access_notebook",
        "access_funds",
        "access_brokers",
        "access_wiggly_ai",
        "access_admin",
        "create_trades",
        "edit_trades",
        "delete_trades",
        "export_trades",
        "create_playbooks",
        "edit_playbooks",
        "delete_playbooks",
        "share_playbooks",
        "create_notes",
        "edit_notes",
        "delete_notes",
        "manage_funds",
        "connect_brokers",
        "use_ai_features",
        "view_courses",
        "enroll_courses",
        "create_courses",
        "edit_courses",
        "delete_courses",
        "manage_users",
        "grade_assignments",
        "moderate_discussions",
        "manage_roles",
        "manage_permissions",
        "view_all_users",
        "edit_user_profiles",
        "delete_users",
        "view_analytics",
        "manage_subscriptions",
        "system_settings",
      ],
    },
  },
} as const
