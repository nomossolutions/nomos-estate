export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      properties: {
        Row: {
          amenities: string[] | null;
          baths: number;
          beds: number;
          /* Categoría editable desde el panel. La agrega la migración
             supabase/migrations/20260914_categorias_de_propiedad.sql */
          category_id: string | null;
          created_at: string;
          description: string | null;
          id: string;
          images: string[] | null;
          is_active: boolean;
          is_featured: boolean | null;
          is_new: boolean;
          lat: number | null;
          lng: number | null;
          location: string;
          parking: number | null;
          price: number;
          slug: string | null;
          sqft: number;
          title: string;
          type: Database['public']['Enums']['property_type'];
          year_built: number | null;
        };
        Insert: {
          amenities?: string[] | null;
          baths: number;
          beds: number;
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          images?: string[] | null;
          is_active?: boolean;
          is_featured?: boolean | null;
          is_new?: boolean;
          lat?: number | null;
          lng?: number | null;
          location: string;
          parking?: number | null;
          price: number;
          slug?: string | null;
          sqft: number;
          title: string;
          type: Database['public']['Enums']['property_type'];
          year_built?: number | null;
        };
        Update: {
          amenities?: string[] | null;
          baths?: number;
          beds?: number;
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          images?: string[] | null;
          is_active?: boolean;
          is_featured?: boolean | null;
          is_new?: boolean;
          lat?: number | null;
          lng?: number | null;
          location?: string;
          parking?: number | null;
          price?: number;
          slug?: string | null;
          sqft?: number;
          title?: string;
          type?: Database['public']['Enums']['property_type'];
          year_built?: number | null;
        };
        Relationships: [];
      };
      property_categories: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Insert: {
          id?: string;
          role?: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      ensure_user_role: { Args: never; Returns: undefined };
      get_admin_users: {
        Args: never;
        Returns: {
          email: string;
          id: string;
          role: Database['public']['Enums']['app_role'];
        }[];
      };
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      app_role: 'admin' | 'user';
      property_type: 'sale' | 'rent';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
