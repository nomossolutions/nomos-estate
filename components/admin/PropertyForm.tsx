"use client";

import {
  FiInfo,
  FiFileText,
  FiImage,
  FiUploadCloud,
  FiTrash2,
  FiMapPin,
  FiMap,
  FiMinimize2,
  FiHome,
  FiDroplet,
  FiNavigation,
  FiRefreshCw,
  FiSave,
} from "react-icons/fi";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Property, PropertyInsert } from "@/types/property";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";
import DynamicPropertyMap from "@/components/DynamicPropertyMap";

interface PropertyFormProps {
  initialData?: Property;
  /**
   * Categorías definidas por el admin (/admin/categorias). Si la migración no
   * corrió, llega vacío y el campo no se muestra.
   */
  categorias?: { id: string; name: string }[];
}

export default function PropertyForm({
  initialData,
  categorias = [],
}: PropertyFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditMode = !!initialData;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Property>>({
    title: initialData?.title || "",
    price: initialData?.price || 0,
    type: initialData?.type || "sale",
    /* El nombre del campo es `category_id` para que caiga en la columna real:
       este objeto se escribe tal cual contra `properties`. */
    category_id: initialData?.category_id ?? null,
    location: initialData?.location || "",
    lat: initialData?.lat ?? undefined,
    lng: initialData?.lng ?? undefined,
    beds: initialData?.beds || 0,
    baths: initialData?.baths || 0,
    sqft: initialData?.sqft || 0,
    description: initialData?.description || "",
    year_built: initialData?.year_built || new Date().getFullYear(),
    parking: initialData?.parking || 0,
    amenities: initialData?.amenities || [],
    is_featured: initialData?.is_featured || false,
    is_active: initialData?.is_active ?? true,
    images: initialData?.images || [],
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [nuevaComodidad, setNuevaComodidad] = useState("");
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(
    initialData?.images || [],
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value, type } = e.target as HTMLInputElement;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsedValue: any = value;

    if (type === "number") {
      const optionalFields = ["lat", "lng"];
      parsedValue =
        value === ""
          ? optionalFields.includes(id)
            ? undefined
            : 0
          : Number(value);
    } else if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({ ...prev, [id]: parsedValue }));
  };

  /*
   * Comodidades dinámicas.
   *
   * Antes era una lista fija de ocho checkboxes (`AMENITIES_LIST`), así que solo
   * se podían cargar esas ocho y ninguna propiedad podía tener otra cosa —
   * "Vista al mar" o "Amoblado" no existían como posibilidad. Ahora el admin
   * escribe la comodidad y se agrega; las sugeridas quedan como atajo, no como
   * límite.
   */
  const agregarComodidad = (valor: string) => {
    const limpio = valor.trim();
    if (!limpio) return;
    setFormData((prev) => {
      const actuales = prev.amenities || [];
      /* Comparación sin distinguir mayúsculas ni acentos: "jardin" y "Jardín"
         son la misma comodidad, y duplicarlas ensuciaría la ficha. */
      const norm = (s: string) =>
        s
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
      if (actuales.some((a) => norm(a) === norm(limpio))) return prev;
      return { ...prev, amenities: [...actuales, limpio] };
    });
    setNuevaComodidad('');
  };

  const quitarComodidad = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: (prev.amenities || []).filter((a) => a !== amenity),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...filesArray]);

      const newPreviewUrls = filesArray.map((file) =>
        URL.createObjectURL(file),
      );
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));

    // Determine if it was an existing image or a new one
    const existingImagesCount = formData.images?.length || 0;

    if (index < existingImagesCount) {
      // It's an existing image, remove it from formData
      setFormData((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index),
      }));
    } else {
      // It's a new image, remove it from newImages
      const newImageIndex = index - existingImagesCount;
      setNewImages((prev) => prev.filter((_, i) => i !== newImageIndex));
    }
  };

  const incrementValue = (
    field: "beds" | "baths" | "sqft" | "year_built" | "parking",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (Number(prev[field]) || 0) + 1,
    }));
  };

  const decrementValue = (
    field: "beds" | "baths" | "sqft" | "year_built" | "parking",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, (Number(prev[field]) || 0) - 1),
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Upload new images if any
      const uploadedImageUrls: string[] = [];

      for (const file of newImages) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("property_images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("property_images").getPublicUrl(filePath);

        uploadedImageUrls.push(publicUrl);
      }

      // Combine existing images with newly uploaded ones
      const finalImages = [...(formData.images || []), ...uploadedImageUrls];

      // 2. Prepare final data for submit
      const propertyData = {
        ...formData,
        images: finalImages,
        slug:
          formData.title && !initialData?.slug
            ? generateSlug(formData.title)
            : initialData?.slug || generateSlug(formData.title || ""),
      };

      // 3. Save to database
      if (isEditMode && initialData?.id) {
        const { error: updateError } = await supabase
          .from("properties")
          .update(propertyData as PropertyInsert)
          .eq("id", initialData.id);

        if (updateError) throw updateError;
        toast.success("Propiedad actualizada correctamente");
      } else {
        const { error: insertError } = await supabase
          .from("properties")
          .insert([propertyData as PropertyInsert]);

        if (insertError) throw insertError;
        toast.success("Propiedad creada correctamente");
      }

      router.push("/admin/propiedades");
      router.refresh(); // Refresh the data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error saving property:", err);
      const message = err.message || "Error al guardar la propiedad";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Sugerencias, no una lista cerrada. Antes esto era `AMENITIES_LIST` y era lo
   * único que se podía cargar; ahora es un atajo para lo habitual. Lo que no esté
   * acá se escribe a mano.
   */
  const SUGERENCIAS = [
    "Piscina",
    "Jardín",
    "Aire Acondicionado",
    "Hogar Inteligente",
    "Balcón",
    "Gimnasio",
    "Sistema de Seguridad",
    "Ascensor",
    "Parrilla",
    "Cochera",
    "Amoblado",
    "Vista al mar",
    "Losa radiante",
    "Cuarto de servicio",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mb-24 pb-24 md:pb-0"
    >
      <div className="xl:col-span-8 space-y-8">
        {error && (
          <div role="alert" className="bg-laca-tenue text-laca p-4 rounded border border-laca/40 mb-6">
            {error}
          </div>
        )}

        <div className="bg-hoja-alta border-rule transition-colors overflow-hidden">
          <div className="px-8 py-6 border-b border-rule flex items-center justify-between gap-3 ">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border border-rule text-tinta-tenue">
                <FiInfo className="text-lg" />
              </div>
              <h2 className="font-display text-folio font-normal text-tinta">
                Información Básica
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer bg-hoja-alta px-3 py-1.5 rounded border border-rule-fuerte">
                <input
                  id="is_featured"
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-laton border-rule-fuerte rounded focus:border-tinta"
                />
                <span className="text-sm font-medium text-tinta transition-colors">
                  Destacada
                </span>
              </label>
              <label
                className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded border transition-colors ${
                  formData.is_active
                    ? "bg-sage/15 border-sage/40 text-sage"
                    : "bg-laca-tenue border-laca/40 text-laca"
                }`}
              >
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 border-rule-fuerte rounded"
                />
                <span className="text-sm font-medium">
                  {formData.is_active ? "Activa" : "Inactiva"}
                </span>
              </label>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="group">
              <label
                className="block text-sm font-medium text-tinta mb-1.5"
                htmlFor="title"
              >
                Título de la Propiedad <span className="text-laca">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full text-base px-4 py-2.5 rounded border-rule-fuerte bg-hoja-alta text-tinta placeholder:text-text-muted focus:border-tinta transition-all"
                placeholder="ej. Penthouse Moderno con Vista al Mar"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-tinta mb-1.5"
                  htmlFor="price"
                >
                  Precio <span className="text-laca">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                    $
                  </span>
                  <input
                    id="price"
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-7 pr-4 py-2.5 rounded border-rule-fuerte bg-hoja-alta text-tinta placeholder:text-text-muted focus:border-tinta transition-all text-base font-medium"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-tinta mb-1.5"
                  htmlFor="type"
                >
                  Operación
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded border-rule-fuerte bg-hoja-alta text-tinta focus:border-tinta transition-all text-base cursor-pointer"
                >
                  <option value="sale">En Venta</option>
                  <option value="rent">En Alquiler</option>
                </select>
                <p className="mt-1.5 text-menudo text-tinta-tenue">
                  Venta o alquiler. Es independiente de la categoría.
                </p>
              </div>
            </div>

            {/* Categoría: la define el admin en /admin/categorias. Lo que elija
                acá es lo que hace que la propiedad aparezca en ese filtro. */}
            {categorias.length > 0 && (
              <div>
                <label
                  className="block text-sm font-medium text-tinta mb-1.5"
                  htmlFor="category_id"
                >
                  Categoría
                </label>
                <select
                  id="category_id"
                  value={formData.category_id ?? ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded border-rule-fuerte bg-hoja-alta text-tinta focus:border-tinta transition-all text-base cursor-pointer"
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-menudo text-tinta-tenue">
                  Sin categoría, la propiedad no aparece al filtrar por categoría.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-hoja-alta border-rule transition-colors overflow-hidden">
          <div className="px-8 py-6 border-b border-rule flex items-center gap-3 ">
            <div className="flex h-9 w-9 items-center justify-center border border-rule text-tinta-tenue">
              <FiFileText className="text-lg" />
            </div>
            <h2 className="font-display text-folio font-normal text-tinta">Descripción</h2>
          </div>
          <div className="p-8">
            <textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded border-rule-fuerte bg-hoja-alta text-tinta placeholder:text-text-muted focus:border-tinta transition-all text-base leading-relaxed resize-y min-h-[200px]"
              placeholder="Describe las características, el vecindario y puntos destacados..."
            />
            <div className="mt-2 text-right text-xs text-text-muted">
              {(formData.description || "").length} / 2000 caracteres
            </div>
          </div>
        </div>

        <div className="bg-hoja-alta border-rule transition-colors overflow-hidden">
          <div className="px-8 py-6 border-b border-rule flex justify-between items-center ">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border border-rule text-tinta-tenue">
                <FiImage className="text-lg" />
              </div>
              <h2 className="font-display text-folio font-normal text-tinta">Galería</h2>
            </div>
            <span className="text-xs font-medium text-text-muted bg-hoja-baja px-2 py-1 rounded">
              JPG, PNG, WEBP
            </span>
          </div>
          <div className="p-8">
            <div className="relative border-2 border-dashed border-rule-fuerte rounded bg-hoja-baja p-10 text-center hover:bg-hoja-baja hover:border-laton transition-colors cursor-pointer group">
              <label htmlFor="image-upload" className="sr-only">Subir imágenes de la propiedad</label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-hoja-alta rounded flex items-center justify-center text-laton group-hover:scale-110 transition-transform duration-300">
                  <FiUploadCloud className="text-2xl" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-tinta">
                    Haz clic o arrastra imágenes aquí
                  </p>
                  <p className="text-xs text-text-muted">
                    Tamaño máximo 5MB por imagen
                  </p>
                </div>
              </div>
            </div>

            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {imagePreviewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded overflow-hidden relative group"
                  >
                    <Image
                      src={url}
                      alt={`Property image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Eliminar imagen ${index + 1}`}
                        className="w-11 h-11 rounded bg-hoja-alta text-laca hover:bg-laca/10 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="sello absolute left-2 top-2 border-hoja bg-tinta text-hoja">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-8">
        <div className="bg-hoja-alta border-rule transition-colors overflow-hidden">
          <div className="px-6 py-4 border-b border-rule flex items-center gap-3 ">
            <div className="flex h-9 w-9 items-center justify-center border border-rule text-tinta-tenue">
              <FiMapPin className="text-lg" />
            </div>
            <h2 className="font-display text-folio font-normal text-tinta">Ubicación</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-tinta mb-1.5"
                htmlFor="location"
              >
                Dirección <span className="text-laca">*</span>
              </label>
              <input
                id="location"
                type="text"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded border-rule-fuerte bg-hoja-alta text-tinta placeholder:text-text-muted focus:border-tinta transition-all text-sm"
                placeholder="Calle, Ciudad, Código Postal"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-sm font-medium text-tinta mb-1.5"
                  htmlFor="lat"
                >
                  Latitud
                </label>
                <input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.lat ?? ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded border-rule-fuerte bg-hoja-alta text-tinta placeholder:text-text-muted focus:border-tinta transition-all text-sm"
                  placeholder="ej. 40.7128"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-tinta mb-1.5"
                  htmlFor="lng"
                >
                  Longitud
                </label>
                <input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.lng ?? ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded border-rule-fuerte bg-hoja-alta text-tinta placeholder:text-text-muted focus:border-tinta transition-all text-sm"
                  placeholder="ej. -74.0060"
                />
              </div>
            </div>
            {typeof formData.lat === "number" &&
            typeof formData.lng === "number" ? (
              <div className="mt-4">
                <DynamicPropertyMap
                  lat={formData.lat}
                  lng={formData.lng}
                  address={formData.location}
                />
              </div>
            ) : (
              <div className="relative h-48 w-full rounded overflow-hidden bg-hoja-baja border border-rule-fuerte group">
                <Image
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600"
                  alt="Vista del mapa"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-hoja text-tinta px-3 py-1.5 rounded backdrop-blur-sm text-xs font-bold flex items-center gap-1">
                    <FiMap className="text-sm text-laton" /> Ubicación en el Mapa
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-hoja-alta border-rule transition-colors overflow-hidden lg:sticky lg:top-24">
          <div className="px-6 py-4 border-b border-rule flex items-center gap-3 ">
            <div className="flex h-9 w-9 items-center justify-center border border-rule text-tinta-tenue">
              <FiMinimize2 className="text-lg" />
            </div>
            <h2 className="font-display text-folio font-normal text-tinta">Detalles</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label
                  className="text-xs text-text-muted font-medium mb-1 block"
                  htmlFor="sqft"
                >
                  Área (m²)
                </label>
                <input
                  id="sqft"
                  type="number"
                  min="0"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  className="w-full text-left px-3 py-2 rounded border-rule-fuerte bg-hoja-baja text-tinta focus:bg-hoja-alta focus:border-tinta transition-all text-sm"
                  placeholder="0"
                />
              </div>
              <div className="group">
                <label
                  className="text-xs text-text-muted font-medium mb-1 block"
                  htmlFor="year_built"
                >
                  Año de Construcción
                </label>
                <input
                  id="year_built"
                  type="number"
                  value={formData.year_built}
                  onChange={handleInputChange}
                  className="w-full text-left px-3 py-2 rounded border-rule-fuerte bg-hoja-baja text-tinta focus:bg-hoja-alta focus:border-tinta transition-all text-sm"
                  placeholder="YYYY"
                />
              </div>
            </div>

            <hr className="border-rule" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-tinta flex items-center gap-2">
                  <FiHome className="text-text-muted text-sm" /> Dormitorios
                </label>
                <div className="flex items-center border border-rule-fuerte rounded overflow-hidden bg-hoja-alta">
                  <button
                    type="button"
                    onClick={() => decrementValue("beds")}
                    aria-label="Reducir dormitorios"
                    className="w-11 h-11 flex items-center justify-center hover:bg-hoja-baja text-text-secondary transition-colors border-r border-rule-fuerte cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={formData.beds}
                    className="w-10 text-center border-none bg-transparent text-tinta p-0 focus:ring-0 text-sm font-medium"
                    aria-label="Número de dormitorios"
                  />
                  <button
                    type="button"
                    onClick={() => incrementValue("beds")}
                    aria-label="Aumentar dormitorios"
                    className="w-11 h-11 flex items-center justify-center hover:bg-hoja-baja text-text-secondary transition-colors border-l border-rule-fuerte cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-tinta flex items-center gap-2">
                  <FiDroplet className="text-text-muted text-sm" /> Baños
                </label>
                <div className="flex items-center border border-rule-fuerte rounded overflow-hidden bg-hoja-alta">
                  <button
                    type="button"
                    onClick={() => decrementValue("baths")}
                    aria-label="Reducir baños"
                    className="w-11 h-11 flex items-center justify-center hover:bg-hoja-baja text-text-secondary transition-colors border-r border-rule-fuerte cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={formData.baths}
                    className="w-10 text-center border-none bg-transparent text-tinta p-0 focus:ring-0 text-sm font-medium"
                    aria-label="Número de baños"
                  />
                  <button
                    type="button"
                    onClick={() => incrementValue("baths")}
                    aria-label="Aumentar baños"
                    className="w-11 h-11 flex items-center justify-center hover:bg-hoja-baja text-text-secondary transition-colors border-l border-rule-fuerte cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-tinta flex items-center gap-2">
                  <FiNavigation className="text-text-muted text-sm" />{" "}
                  Estacionamiento
                </label>
                <div className="flex items-center border border-rule-fuerte rounded overflow-hidden bg-hoja-alta">
                  <button
                    type="button"
                    onClick={() => decrementValue("parking")}
                    aria-label="Reducir estacionamiento"
                    className="w-11 h-11 flex items-center justify-center hover:bg-hoja-baja text-text-secondary transition-colors border-r border-rule-fuerte cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={formData.parking}
                    className="w-10 text-center border-none bg-transparent text-tinta p-0 focus:ring-0 text-sm font-medium"
                    aria-label="Número de estacionamientos"
                  />
                  <button
                    type="button"
                    onClick={() => incrementValue("parking")}
                    aria-label="Aumentar estacionamiento"
                    className="w-11 h-11 flex items-center justify-center hover:bg-hoja-baja text-text-secondary transition-colors border-l border-rule-fuerte cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-rule" />

            <div>
              <h3 className="text-sm font-bold text-tinta mb-1">Comodidades</h3>
              <p className="mb-4 text-menudo text-tinta-tenue">
                Escribilas y se agregan a la propiedad. Son tuyas: no hay una
                lista cerrada.
              </p>

              {/* Cargadas: se quitan con un clic */}
              {(formData.amenities || []).length > 0 && (
                <ul className="mb-4 flex flex-wrap gap-2">
                  {(formData.amenities || []).map((amenity) => (
                    <li key={amenity}>
                      <button
                        type="button"
                        onClick={() => quitarComodidad(amenity)}
                        aria-label={`Quitar ${amenity}`}
                        className="group inline-flex items-center gap-2 border border-rule-fuerte bg-hoja-alta px-3 py-1.5 text-menudo text-tinta transition-colors hover:border-laca/40 hover:text-laca"
                      >
                        {amenity}
                        <span aria-hidden="true" className="text-tinta-tenue group-hover:text-laca">
                          ×
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Alta: Enter agrega, así se pueden cargar varias seguidas */}
              <div className="flex gap-3">
                <input
                  id="nueva-comodidad"
                  type="text"
                  value={nuevaComodidad}
                  onChange={(e) => setNuevaComodidad(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      agregarComodidad(nuevaComodidad);
                    }
                  }}
                  maxLength={40}
                  placeholder="Ej.: Vista al mar, Amoblado, Parrilla…"
                  className="w-full border border-rule-fuerte bg-hoja-alta px-4 py-2.5 text-menudo text-tinta placeholder:text-tinta-tenue/70 transition-colors focus:border-tinta focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => agregarComodidad(nuevaComodidad)}
                  disabled={!nuevaComodidad.trim()}
                  className="inline-flex h-11 shrink-0 items-center border border-rule-fuerte px-4 text-menudo font-medium text-tinta transition-colors hover:border-tinta disabled:opacity-40"
                >
                  Agregar
                </button>
              </div>

              {/* Sugerencias: atajo, no límite */}
              <div className="mt-5">
                <p className="indicador mb-2">Sugerencias</p>
                <div className="flex flex-wrap gap-2">
                  {SUGERENCIAS
                    .filter((s) => !(formData.amenities || []).includes(s))
                    .map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => agregarComodidad(s)}
                        className="border border-dashed border-rule-fuerte px-3 py-1.5 text-menudo text-tinta-tenue transition-colors hover:border-tinta hover:text-tinta"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-tinta bg-hoja p-4 pb-safe pt-3 md:hidden">
        <button
          type="button"
          onClick={() => router.push("/admin/propiedades")}
          className="flex-1 border border-rule-fuerte bg-hoja-alta py-3 text-menudo font-medium text-tinta transition-colors hover:border-tinta"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex flex-1 items-center justify-center gap-2 border border-tinta bg-tinta py-3 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover disabled:opacity-50"
        >
          {isLoading ? <FiRefreshCw className="animate-spin" /> : "Guardar"}
        </button>
      </div>

      {/* Barra de acciones fija en desktop */}
      <div className="sticky bottom-0 z-40 hidden justify-end gap-3 border-t border-rule bg-hoja/95 py-4 pb-safe backdrop-blur-sm md:flex xl:col-span-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-12 border border-rule-fuerte bg-hoja-alta px-6 text-menudo font-medium text-tinta transition-colors hover:border-tinta"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 items-center gap-2 border border-tinta bg-tinta px-6 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover disabled:opacity-50"
        >
          {isLoading ? (
            <FiRefreshCw className="animate-spin" />
          ) : (
            <>
              <FiSave aria-hidden="true" />
              Guardar Propiedad
            </>
          )}
        </button>
      </div>
    </form>
  );
}
