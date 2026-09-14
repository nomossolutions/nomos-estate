export type PropertyType = 'sale' | 'rent';

export type PropertyInsert = Omit<Property, 'id' | 'created_at'>;

export interface Property {
  id: string;
  title: string;
  slug?: string;
  location: string;
  price: number;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  type: PropertyType;
  is_new: boolean;
  created_at: string;
  is_featured?: boolean;
  is_active?: boolean;
  lat?: number;
  lng?: number;
  description?: string;
  year_built?: number;
  parking?: number;
  amenities?: string[];
  /**
   * Categoría de la propiedad, definida por el admin en /admin/categorias.
   * Antes la categoría no era un dato: se infería del título.
   * Requiere la migración 20260914_categorias_de_propiedad.sql.
   */
  category_id?: string | null;
}
