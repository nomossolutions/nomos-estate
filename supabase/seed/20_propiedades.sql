-- ============================================================================
-- Nomos Estate · Seed de 20 propiedades (v2)
-- ============================================================================
--
-- QUÉ HACE
--   1. Borra TODAS las propiedades existentes.
--   2. Asegura las dos categorías: Casa y Departamento.
--   3. Inserta 20 propiedades con este reparto exacto:
--
--        CASA         10   →  5 en venta  +  5 en alquiler
--        DEPARTAMENTO 10   →  5 en venta  +  5 en alquiler
--        ────────────────────────────────────────────────
--        TOTAL        20   → 10 en venta  + 10 en alquiler
--
-- PRECONDICIÓN
--   Requiere la migración de categorías corrida antes:
--     supabase/migrations/20260914_categorias_de_propiedad.sql
--
-- CÓMO CORRERLO
--   Supabase → SQL Editor → pegar todo → Run.
--   Todo va en una transacción: si algo falla, no queda nada a medias, así que no
--   te puede dejar el catálogo por la mitad.
--
-- SOBRE LAS IMÁGENES
--   Fotos reales servidas desde el CDN de Unsplash. Verificadas: responden
--   image/jpeg. Son material de demostración — reemplazalas por fotografía
--   propia antes de publicar.
--
-- SOBRE LOS DATOS
--   Nombres, direcciones y descripciones son verosímiles pero inventados: es data
--   de demostración. Ninguna afirmación comercial es real.
-- ============================================================================

begin;


-- ----------------------------------------------------------------------------
-- 1. Borrar todo
-- ----------------------------------------------------------------------------
delete from public.properties;


-- ----------------------------------------------------------------------------
-- 2. Las dos categorías
-- ----------------------------------------------------------------------------
insert into public.property_categories (name, slug, sort_order, is_active) values
  ('Casa',        'casa',        10, true),
  ('Departamento','departamento',20, true)
on conflict (slug) do update
  set is_active = excluded.is_active,
      sort_order = excluded.sort_order;


-- ----------------------------------------------------------------------------
-- 3. Las 20 propiedades
-- ----------------------------------------------------------------------------
-- `category_id` se resuelve por slug con subconsulta: no hay UUID a mano.
-- `created_at` escalonado para que el orden del catálogo (más reciente primero)
-- tenga sentido y el paginador muestre páginas distintas.
insert into public.properties (
  title, slug, location, price, images,
  beds, baths, sqft, parking, year_built,
  type, category_id, description, amenities,
  lat, lng, is_active, is_featured, is_new, created_at
) values

-- ============================================================================
-- CASAS · EN VENTA (5)
-- ============================================================================

('Villa en Venta Cap Ferrat', 'villa-venta-cap-ferrat',
 'Chemin du Roy, Cap Ferrat, Costa Azul, Francia', 4200000,
 array['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'],
 6, 5, 520, 4, 1928, 'sale',
 (select id from public.property_categories where slug = 'casa'),
 'Villa belle époque sobre la península, con vista abierta a la bahía de Villefranche. Salones de doble altura con molduras originales, jardines en terrazas y piscina de borde infinito orientada al sur. Cinco minutos a pie del puerto.',
 array['Piscina','Jardín','Aire Acondicionado','Sistema de Seguridad','Cuarto de servicio','Vista al mar'],
 43.6899, 7.3325, true, true, false, now() - interval '1 day'),

('Casa en Venta Lake Como', 'casa-venta-lake-como',
 'Via Regina, Cernobbio, Lago de Como, Italia', 2950000,
 array['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200'],
 5, 4, 430, 3, 1975, 'sale',
 (select id from public.property_categories where slug = 'casa'),
 'Residencia restaurada en 2019 sobre la ribera oeste del lago. Ventanales en todo el frente al agua, muelle privado y jardín de 1.200 m² con olivos centenarios y cipreses.',
 array['Jardín','Aire Acondicionado','Hogar Inteligente','Vista al mar','Parrilla'],
 45.8431, 9.0778, true, true, false, now() - interval '46 days'),

('Casa en Venta Beverly Hills', 'casa-venta-beverly-hills',
 '1142 Sunset Plaza Drive, Beverly Hills, California, EE. UU.', 5600000,
 array['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=1200'],
 5, 6, 610, 4, 2021, 'sale',
 (select id from public.property_categories where slug = 'casa'),
 'Casa contemporánea de dos niveles con vista a la ciudad desde casi todos los ambientes. Piscina desbordante, sala de cine, bodega climatizada y garaje para cuatro autos.',
 array['Piscina','Aire Acondicionado','Hogar Inteligente','Sistema de Seguridad','Gimnasio','Vista al mar'],
 34.0900, -118.3860, true, true, true, now() - interval '73 days'),

('Casa en Venta Notting Hill', 'casa-venta-notting-hill',
 'Ladbroke Square, Notting Hill, Londres, Reino Unido', 3850000,
 array['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200'],
 5, 3, 310, 2, 1865, 'sale',
 (select id from public.property_categories where slug = 'casa'),
 'Townhouse victoriana de cinco pisos frente al jardín privado de Ladbroke Square. Conserva chimeneas de mármol y cornucopias originales, con cocina y baños renovados en 2020. Acceso al garden square comunitario.',
 array['Jardín','Aire Acondicionado','Sistema de Seguridad','Cuarto de servicio'],
 51.5115, -0.2055, true, false, false, now() - interval '175 days'),

('Casa en Venta Kamakura', 'casa-venta-kamakura',
 '2-14-3 Yamanouchi, Kamakura, Kanagawa, Japón', 1980000,
 array['https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200'],
 4, 3, 280, 2, 2016, 'sale',
 (select id from public.property_categories where slug = 'casa'),
 'Casa de diseño con patio interior japonés y vista al monte Fuji en días despejados. Estructura de cedro, baño de ofuro y suelo de madera de hinoki. Construida por un estudio local en 2016.',
 array['Jardín','Aire Acondicionado','Hogar Inteligente','Losa radiante'],
 35.3192, 139.5467, true, false, true, now() - interval '19 days'),

-- ============================================================================
-- CASAS · EN ALQUILER (5)
-- ============================================================================

('Casa en Alquiler Hamptons', 'casa-alquiler-hamptons',
 'Ferry Road, Sag Harbor, Nueva York, EE. UU.', 22000,
 array['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=1200'],
 6, 5, 480, 3, 2012, 'rent',
 (select id from public.property_categories where slug = 'casa'),
 'Casa de verano amoblada a diez minutos de la playa. Piscina con deck de teca, cancha de tenis y dependencia para invitados sobre el garaje. Alquiler mensual, mínimo dos meses.',
 array['Piscina','Jardín','Aire Acondicionado','Amoblado','Parrilla','Cuarto de servicio'],
 40.9976, -72.2934, true, true, false, now() - interval '27 days'),

('Casa en Alquiler Provence', 'casa-alquiler-provence',
 'Route de Gordes, Ménerbes, Luberon, Francia', 8500,
 array['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200'],
 4, 3, 320, 2, 1780, 'rent',
 (select id from public.property_categories where slug = 'casa'),
 'Masía de piedra restaurada entre viñedos y lavanda, con piscina orientada al valle. Muros de un metro de espesor que mantienen el fresco en verano. Amoblada, alquiler por temporada.',
 array['Piscina','Jardín','Amoblado','Parrilla','Losa radiante'],
 43.8333, 5.2333, true, false, false, now() - interval '38 days'),

('Casa en Alquiler Cherry Creek', 'casa-alquiler-cherry-creek',
 '2450 E Alameda Avenue, Denver, Colorado, EE. UU.', 6900,
 array['https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200'],
 4, 4, 390, 2, 2009, 'rent',
 (select id from public.property_categories where slug = 'casa'),
 'Casa familiar en el barrio de Cherry Creek, cerca de los colegios y del distrito comercial. Sótano terminado, jardín con riego automático y garaje doble. Contrato anual.',
 array['Jardín','Aire Acondicionado','Losa radiante','Amoblado','Sistema de Seguridad'],
 39.7280, -104.9670, true, false, false, now() - interval '95 days'),

('Casa en Alquiler Bali', 'casa-alquiler-bali',
 'Jalan Pantai Nyanyi, Canggu, Bali, Indonesia', 4200,
 array['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200'],
 3, 3, 240, 2, 2019, 'rent',
 (select id from public.property_categories where slug = 'casa'),
 'Villa de estilo balinés con piscina privada rodeada de arrozales. Pabellón abierto para living y comedor, y tres pabellones cerrados con aire acondicionado. Amoblada, incluye servicio de jardinería.',
 array['Piscina','Jardín','Aire Acondicionado','Amoblado','Hogar Inteligente'],
 -8.6478, 115.1077, true, true, true, now() - interval '55 days'),

('Casa en Alquiler Cotswolds', 'casa-alquiler-cotswolds',
 'Church Lane, Bibury, Gloucestershire, Reino Unido', 5400,
 array['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&q=80&w=1200'],
 4, 3, 290, 2, 1830, 'rent',
 (select id from public.property_categories where slug = 'casa'),
 'Casa de campo de piedra caliza junto al río Coln, en una de las aldeas más fotografiadas de los Cotswolds. Chimeneas de leña, jardín amurallado y cocina reformada. Contrato anual.',
 array['Jardín','Losa radiante','Amoblado','Parrilla'],
 51.7580, -1.8320, true, false, false, now() - interval '64 days'),

-- ============================================================================
-- DEPARTAMENTOS · EN VENTA (5)
-- ============================================================================

('Departamento en Venta Upper East Side', 'departamento-venta-upper-east-side',
 '870 Park Avenue, Upper East Side, Nueva York, EE. UU.', 3450000,
 array['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200'],
 3, 3, 210, 1, 1912, 'sale',
 (select id from public.property_categories where slug = 'departamento'),
 'Piso de época en Park Avenue con vistas al parque. Techos de 3,20 m, suelos de roble originales y tres ventanales al este. El edificio tiene portero y conserje 24 horas.',
 array['Ascensor','Aire Acondicionado','Sistema de Seguridad','Cuarto de servicio'],
 40.7789, -73.9580, true, true, false, now() - interval '3 days'),

('Departamento en Venta Aoyama', 'departamento-venta-aoyama',
 '3-6-8 Minami-Aoyama, Minato-ku, Tokio, Japón', 1890000,
 array['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=1200'],
 2, 2, 96, 1, 2018, 'sale',
 (select id from public.property_categories where slug = 'departamento'),
 'Departamento de dos dormitorios en un edificio de 2018 en Minami-Aoyama, a diez minutos del parque Yoyogi. Terminaciones en piedra y madera de nogal, con vista al skyline de Shinjuku.',
 array['Aire Acondicionado','Ascensor','Hogar Inteligente','Losa radiante','Sistema de Seguridad'],
 35.6670, 139.7130, true, false, true, now() - interval '82 days'),

('Departamento en Venta Eixample', 'departamento-venta-eixample',
 'Carrer de Provença 280, Eixample, Barcelona, España', 1250000,
 array['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'],
 3, 2, 165, 1, 1910, 'sale',
 (select id from public.property_categories where slug = 'departamento'),
 'Finca regia del Eixample con los mosaicos hidráulicos y los balcones originales recuperados. Tres ambientes amplios sobre Provença, con galería al patio de manzana.',
 array['Ascensor','Aire Acondicionado','Balcón','Losa radiante'],
 41.3935, 2.1656, true, true, false, now() - interval '6 days'),

('Departamento en Venta Victoria Harbour', 'departamento-venta-victoria-harbour',
 '18 Kowloon Station, West Kowloon, Hong Kong', 2650000,
 array['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=1200'],
 3, 3, 140, 2, 2020, 'sale',
 (select id from public.property_categories where slug = 'departamento'),
 'Piso alto sobre Victoria Harbour con vista directa al skyline de la isla. Tres dormitorios en suite, cocina integrada y acceso directo a la estación de Kowloon.',
 array['Piscina','Gimnasio','Aire Acondicionado','Ascensor','Sistema de Seguridad','Vista al mar'],
 22.3050, 114.1600, true, false, false, now() - interval '104 days'),

('Departamento en Venta Jardins', 'departamento-venta-jardins',
 'Rua Oscar Freire 1200, Jardins, São Paulo, Brasil', 890000,
 array['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1200'],
 3, 3, 155, 2, 2015, 'sale',
 (select id from public.property_categories where slug = 'departamento'),
 'Departamento de tres ambientes a dos cuadras de Oscar Freire. Balcón con parrilla, cocina con isla y dos cocheras cubiertas. Edificio con pileta y gimnasio.',
 array['Piscina','Gimnasio','Aire Acondicionado','Balcón','Parrilla','Ascensor'],
 -23.5629, -46.6685, true, false, true, now() - interval '118 days'),

-- ============================================================================
-- DEPARTAMENTOS · EN ALQUILER (5)
-- ============================================================================

('Departamento en Alquiler Tribeca', 'departamento-alquiler-tribeca',
 '56 Leonard Street, Tribeca, Nueva York, EE. UU.', 12500,
 array['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200'],
 2, 2, 130, 1, 2016, 'rent',
 (select id from public.property_categories where slug = 'departamento'),
 'Departamento amoblado en Tribeca con ventanales de piso a techo y vista al Hudson. Edificio con pileta, gimnasio y salón comunitario. Contrato anual, admite mascotas.',
 array['Piscina','Gimnasio','Aire Acondicionado','Ascensor','Amoblado','Sistema de Seguridad'],
 40.7178, -74.0050, true, true, false, now() - interval '131 days'),

('Departamento en Alquiler South Kensington', 'departamento-alquiler-south-kensington',
 '22 Queen''s Gate Terrace, South Kensington, Londres, Reino Unido', 7800,
 array['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1200'],
 3, 2, 145, 1, 1885, 'rent',
 (select id from public.property_categories where slug = 'departamento'),
 'Piso de tres ambientes en el segundo piso de una casa georgiana, frente a los jardines de Queen''s Gate. Techos altos, chimeneas de mármol y cocina reformada. Amoblado.',
 array['Ascensor','Losa radiante','Amoblado','Cuarto de servicio'],
 51.4960, -0.1790, true, false, false, now() - interval '145 days'),

('Departamento en Alquiler Marais', 'departamento-alquiler-marais',
 '14 Rue des Archives, Le Marais, París, Francia', 4200,
 array['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200'],
 2, 1, 68, 0, 1850, 'rent',
 (select id from public.property_categories where slug = 'departamento'),
 'Departamento en un hôtel particulier del Marais, con vigas de madera a la vista y ventanas al patio interior. A pasos de la place des Vosges. Amoblado, contrato de un año.',
 array['Amoblado','Losa radiante','Aire Acondicionado'],
 48.8585, 2.3600, true, true, false, now() - interval '160 days'),

('Departamento en Alquiler Palermo Hollywood', 'departamento-alquiler-palermo-hollywood',
 'Bonpland 1800, Palermo Hollywood, Buenos Aires, Argentina', 1800,
 array['https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1200'],
 2, 2, 82, 1, 2017, 'rent',
 (select id from public.property_categories where slug = 'departamento'),
 'Departamento de dos ambientes con terraza propia de 20 m² y parrilla, en el corredor gastronómico de Palermo Hollywood. Amoblado y equipado. Contrato anual.',
 array['Aire Acondicionado','Balcón','Amoblado','Parrilla','Ascensor'],
 -34.5824, -58.4350, true, false, true, now() - interval '11 days'),

('Departamento en Alquiler Dubai Marina', 'departamento-alquiler-dubai-marina',
 'Dubai Marina Gate, Dubai Marina, Emiratos Árabes Unidos', 5400,
 array['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=1200',
       'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'],
 3, 3, 160, 2, 2021, 'rent',
 (select id from public.property_categories where slug = 'departamento'),
 'Departamento en torre sobre la marina, con vista al agua desde el living y la suite principal. Piscina en la terraza 40, gimnasio y acceso directo al paseo de la marina. Amoblado.',
 array['Piscina','Gimnasio','Aire Acondicionado','Ascensor','Amoblado','Vista al mar'],
 25.0800, 55.1400, true, false, false, now() - interval '190 days');


-- ----------------------------------------------------------------------------
-- 4. Verificación
-- ----------------------------------------------------------------------------

-- Esperado: total 20 · en_venta 10 · en_alquiler 10 · sin_categoria 0
select
  count(*)                                     as total,
  count(*) filter (where type = 'sale')        as en_venta,
  count(*) filter (where type = 'rent')        as en_alquiler,
  count(*) filter (where category_id is null)  as sin_categoria,
  count(*) filter (where is_featured)          as destacadas,
  count(*) filter (where is_active)            as publicadas
from public.properties;

-- Esperado: cada categoría 10, con 5 de venta y 5 de alquiler
select
  c.name                                            as categoria,
  count(*)                                          as total,
  count(*) filter (where p.type = 'sale')           as en_venta,
  count(*) filter (where p.type = 'rent')           as en_alquiler
from public.properties p
join public.property_categories c on c.id = p.category_id
group by c.name
order by c.name;

commit;
