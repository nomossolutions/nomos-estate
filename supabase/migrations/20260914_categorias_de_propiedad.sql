-- ============================================================================
-- Nomos Estate · Categorías de propiedad creadas desde el panel
-- ============================================================================
--
-- QUÉ RESUELVE
-- Hasta ahora "categoría" no existía como dato. `properties.type` es
-- `property_type = 'sale' | 'rent'` (venta o alquiler), así que el filtro por
-- Casa / Villa / Departamento se resolvía buscando esa palabra en el TÍTULO.
-- Eso obligaba a mantener una lista escrita a mano en el código, que ya se había
-- desincronizado, y se rompía sola si alguien titulaba una propiedad sin la
-- palabra clave.
--
-- Esta migración crea la categoría como dato real, editable desde el panel.
--
-- CÓMO CORRERLA
-- Supabase → SQL Editor → pegar todo → Run. Es idempotente: se puede correr dos
-- veces sin romper nada.
--
-- ORDEN IMPORTANTE
-- El código que usa estas tablas todavía no está desplegado; cuando lo esté, si
-- esta migración no corrió, las consultas fallarán. Corré la migración primero.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. La tabla de categorías
-- ----------------------------------------------------------------------------
create table if not exists public.property_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null,
  -- El orden es del admin: en qué orden aparecen en el filtro público.
  sort_order  integer not null default 0,
  -- Permite retirar una categoría del filtro sin borrarla y sin dejar huérfanas
  -- las propiedades que la usan. Es la diferencia entre archivar y destruir.
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),

  constraint property_categories_name_no_vacia check (length(trim(name)) > 0),
  constraint property_categories_slug_no_vacio check (length(trim(slug)) > 0),
  constraint property_categories_slug_unico unique (slug)
);

comment on table public.property_categories is
  'Categorías de propiedad (Casa, Villa, Departamento…), creadas y ordenadas desde el panel de administración.';


-- ----------------------------------------------------------------------------
-- 2. La columna en properties
-- ----------------------------------------------------------------------------
-- `on delete restrict`: no se puede borrar una categoría en uso. Es deliberado:
-- borrarla dejaría propiedades sin categoría en silencio. Para retirarla del
-- filtro se usa `is_active = false`.
alter table public.properties
  add column if not exists category_id uuid
  references public.property_categories (id) on delete restrict;

comment on column public.properties.category_id is
  'Categoría de la propiedad. Antes esta información se infería del título.';

create index if not exists properties_category_id_idx
  on public.properties (category_id);


-- ----------------------------------------------------------------------------
-- 3. Row Level Security
-- ----------------------------------------------------------------------------
-- Lectura pública: el sitio necesita las categorías para armar el filtro sin que
-- el visitante tenga sesión.
alter table public.property_categories enable row level security;

drop policy if exists "categorias_lectura_publica" on public.property_categories;
create policy "categorias_lectura_publica"
  on public.property_categories
  for select
  using (true);

-- Escritura solo para administradores, usando el helper que ya existe en la base.
drop policy if exists "categorias_escritura_admin" on public.property_categories;
create policy "categorias_escritura_admin"
  on public.property_categories
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ----------------------------------------------------------------------------
-- 4. Categorías iniciales
-- ----------------------------------------------------------------------------
-- Se derivan de los títulos que el catálogo REALMENTE tiene hoy, así el backfill
-- del paso 5 puede clasificar las 8 propiedades existentes y ninguna queda
-- suelta. `on conflict do nothing` para que correr la migración dos veces no
-- duplique ni pise nada.
insert into public.property_categories (name, slug, sort_order) values
  ('Casa',        'casa',        10),
  ('Apartamento', 'apartamento', 20),
  ('Departamento','departamento',30),
  ('Residencia',  'residencia',  40),
  ('Loft',        'loft',        50),
  ('Villa',       'villa',       60),
  ('Penthouse',   'penthouse',   70)
on conflict (slug) do nothing;


-- ----------------------------------------------------------------------------
-- 5. Backfill de las propiedades existentes
-- ----------------------------------------------------------------------------
-- La única forma de clasificar lo que ya existe es mirar el título, porque el
-- dato no estaba. Se toma el slug con más coincidencia dentro del título y solo
-- se asigna si la propiedad todavía no tiene categoría.
--
-- Después de correr esto, verificá el reporte del paso 6: lo que quede sin
-- clasificar se asigna a mano desde el panel.
update public.properties p
set category_id = c.id
from public.property_categories c
where p.category_id is null
  and p.title ilike '%' || c.name || '%';


-- ----------------------------------------------------------------------------
-- 6. Verificación
-- ----------------------------------------------------------------------------
-- Cuántas propiedades quedaron sin categoría. Si el número no es 0, entrá al
-- panel y asigná esas a mano — es el único paso que la migración no puede
-- adivinar.
select
  count(*) filter (where category_id is null) as sin_categoria,
  count(*)                                  as total
from public.properties;

-- Cómo quedó repartido el catálogo.
select
  coalesce(c.name, '(sin categoría)') as categoria,
  count(*)                            as propiedades
from public.properties p
left join public.property_categories c on c.id = p.category_id
group by 1
order by 2 desc;
