# Nomos Estate · Documentación para el equipo de backend

Este documento explica cómo está armado el proyecto **hoy**, con datos verificados
contra la base real. Reemplaza a la guía de migración a MongoDB que estaba en el
repo (era un plan descartado).

---

## 1. Qué es el producto

Plataforma inmobiliaria de lujo, en español, con dos superficies:

- **Pública:** catálogo filtrable, ficha de propiedad con galería y mapa, contacto
  con el agente, página "Sobre nosotros".
- **Panel de administración** (protegido por rol): propiedades, categorías y
  usuarios.

El backend es **Supabase completo**: base de datos PostgreSQL, autenticación y
storage de imágenes. No hay API propia ni servidor intermedio — el frontend habla
directo con Supabase.

---

## 2. Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Lenguaje | TypeScript |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + contraseña) |
| Storage | Supabase Storage (imágenes de propiedades) |
| Mapas | Leaflet + OpenStreetMap (sin API key) |

Variables de entorno necesarias (`.env`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 3. Modelo de datos

### `properties` — 21 columnas, verificadas contra la base

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | |
| `slug` | text | Único. Es la URL pública |
| `location` | text | Dirección en texto libre |
| `price` | number | Sin moneda: se asume USD |
| `images` | text[] | URLs de Supabase Storage |
| `beds`, `baths`, `sqft`, `parking` | number | `parking` es nullable |
| `year_built` | number | Nullable |
| `type` | `property_type` | Enum: **`'sale' \| 'rent'`** |
| `description` | text | Nullable |
| `amenities` | text[] | Nullable |
| `lat`, `lng` | number | Nullable. Si faltan, el mapa no se muestra |
| `is_active` | boolean | `false` = oculta del sitio público |
| `is_featured` | boolean | Curaduría: aparece en "Colecciones Destacadas" |
| `is_new` | boolean | **Sin uso. Ver §7** |
| `category_id` | uuid | FK → `property_categories`. Nullable. Ver §4 |
| `created_at` | timestamptz | Default `now()` |

### `property_categories`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | Ej.: "Casa", "Departamento" |
| `slug` | text | Único. Es lo que viaja en la URL del filtro |
| `sort_order` | integer | El orden del filtro público lo define el admin |
| `is_active` | boolean | `false` = no se ofrece en el filtro, sin borrarla |
| `created_at` | timestamptz | |

FK: `properties.category_id → property_categories.id ON DELETE RESTRICT`.
El `RESTRICT` es deliberado: **no se puede borrar una categoría en uso**, para no
dejar propiedades sin clasificar en silencio. Para retirarla del filtro se usa
`is_active = false`. La aplicación traduce ese error de Postgres a un mensaje
concreto que le dice al admin cuántas propiedades la están usando.

### `user_roles`

| Columna | Tipo |
|---|---|
| `id` | uuid (PK) |
| `user_id` | uuid → `auth.users` |
| `role` | `app_role` (enum: `'admin' \| 'user'`) |

---

## 4. Migraciones: se corren a mano

Están en `supabase/migrations/` y **no se aplican automáticamente**. Hay que
ejecutarlas en el SQL Editor de Supabase, en orden. Todas son idempotentes.

| Archivo | Qué hace | Estado |
|---|---|---|
| `20260914_categorias_de_propiedad.sql` | Crea `property_categories`, agrega `properties.category_id`, políticas RLS, 7 categorías iniciales y backfill de las propiedades existentes | **Aplicada** |

**Sin esta migración el código degrada, no se rompe:** el filtro por categoría y su
pantalla en el panel simplemente no aparecen. Es intencional — el sitio sigue
funcionando con las propiedades sin clasificar.

El seed de ejemplo, `supabase/seed/20_propiedades.sql`, borra todo y carga 20
propiedades (10 casas y 10 departamentos, mitad en venta y mitad en alquiler).

---

## 5. Seguridad: RLS y auth

**Todo el acceso pasa por Row Level Security.** No hay service role key en el
frontend — solo la clave anónima, y por eso **el frontend no puede crear tablas ni
ejecutar DDL**. Eso explica por qué las migraciones se corren a mano.

Comportamiento verificado:

- Escritura anónima a `properties` → **rechazada** (`401`, violación de RLS).
- Lectura pública de `properties` y `property_categories` → permitida. El visitante
  necesita leer las categorías para armar el filtro sin tener sesión.
- Escritura en `property_categories` → solo `authenticated` con `public.is_admin()`.

### Autenticación

`lib/supabase/` tiene tres clientes, y usar el correcto importa:

| Archivo | Cuándo |
|---|---|
| `client.ts` | Componentes de cliente (`'use client'`) |
| `server.ts` | Server Components, Server Actions, route handlers |
| `middleware.ts` | Refresco de sesión en cada request |

`middleware.ts` (raíz) protege **todas** las rutas `/admin/*`:

1. Sin sesión → redirige a `/login`.
2. Con sesión pero sin rol `admin` → redirige a `/`.
3. El chequeo de rol se hace contra `user_roles` en cada request.

### Funciones RPC

| Función | Devuelve |
|---|---|
| `get_admin_users()` | Lista de usuarios con su rol. **Es la única forma de listar usuarios**: `auth.users` no es accesible desde el cliente |
| `is_admin()` | Boolean, usado por las políticas RLS |
| `ensure_user_role()` | Crea el rol por defecto de un usuario nuevo |

---

## 6. Rutas y quién puede verlas

| Ruta | Acceso | Notas |
|---|---|---|
| `/` | Público | Catálogo con filtros por query string |
| `/properties/[slug]` | Público | Acepta **slug o id** |
| `/about`, `/login` | Público | |
| `/admin` | Admin | Panel con métricas |
| `/admin/propiedades` | Admin | Listado, alta (`/nueva`) y edición (`/[slug]/editar`) |
| `/admin/categorias` | Admin | ABM de categorías |
| `/admin/usuarios` | Admin | Directorio y cambio de rol (`/asignar-rol`) |

### Filtros del catálogo (query string)

| Parámetro | Columna | Notas |
|---|---|---|
| `location` | `location` **o** `title` | Búsqueda `ilike` en ambos |
| `minPrice` / `maxPrice` | `price` | |
| `categoria` | `category_id` | Es el **slug** de la categoría, no el nombre |
| `operation` | `type` | `sale` o `rent` |
| `beds` / `baths` | `beds` / `baths` | Mínimo, no exacto |
| `page` | — | 9 por página |

**Regla de robustez que conviene respetar si agregan filtros:** un parámetro que no
se puede interpretar **se ignora**, nunca devuelve un catálogo vacío. Un
`?beds=abc` debe mostrar todo, no mentir diciendo que no hay propiedades
(ese bug existía: un `NaN` propagado a la consulta vaciaba los resultados).

Lo mismo con una categoría inexistente: se ignora. Un enlace viejo no debe vaciar
la página.

---

## 7. Deuda técnica conocida

Estos son los puntos que un backend debería tener en el radar. Están documentados
en el código donde corresponde, pero conviene que los conozcan:

### 7.1 `is_new` es una columna muerta

Existe en la base pero **ningún formulario la escribe**, así que siempre vale
`false` (salvo ediciones manuales: hoy hay filas con `true` de origen incierto).
La aplicación **ya no la lee**: la etiqueta "Nuevo" se deriva de `created_at`
contra un umbral de 30 días, porque la fecha es el dato real y una bandera se
desincroniza.

**Acción sugerida:** `alter table properties drop column is_new;` cuando quieran
limpiarla.

### 7.2 `type` es operación, no categoría

Históricamente el filtro por categoría se aproximaba con `title ILIKE '%Casa%'`,
o sea dependía de cómo alguien titulaba la propiedad. Eso está resuelto con
`category_id`. **Pero el nombre de la columna sigue siendo engañoso:** `type`
significa venta/alquiler, y la categoría es otra cosa. La interfaz los llama
"Operación" y "Categoría" para no confundirlos.

**Acción sugerida:** renombrar `type` → `operation` y su enum
`property_type` → `operation_type`. Es un cambio de esquema, y de ahí en adelante
`type` deja de ser ambiguo.

### 7.3 `location` es texto libre

No hay ciudad, barrio ni país como campos separados, así que no se puede filtrar
por ubicación estructurada ni ordenar por zona. El buscador hace `ilike` sobre el
texto completo.

**Acción sugerida:** columnas `city`, `state`/`region`, `country` y un `location`
como dirección, si el negocio necesita filtros geográficos.

### 7.4 Sin historial de precios

`price` es un valor único que se sobreescribe. No hay forma de saber que una
propiedad bajó de precio, que es uno de los datos más valiosos para un comprador.

**Acción sugerida:** tabla `property_price_history` con `(property_id, price, changed_at)`.

### 7.5 Imágenes sin validación de esquema

`images` es un `text[]` de URLs. Nada garantiza que apunten al bucket correcto ni
que sean del proyecto.

---

## 8. Cómo se escribe en la base

Tres caminos distintos, y conviene conocerlos antes de tocar permisos:

1. **Server Actions** (`app/admin/*/actions.ts`) — para categorías y roles.
   Verifican el rol de administrador **del lado del servidor**. Ocultar el enlace
   en la interfaz no alcanza: una Server Action es un endpoint.
2. **Cliente de navegador** (`PropertyForm.tsx`) — alta y edición de propiedades,
   incluyendo subida de imágenes a Storage.
3. **SQL manual** — migraciones y seed, corridos por una persona en el SQL Editor.

---

## 9. Preguntas frecuentes

**¿Por qué el frontend no puede aplicar migraciones?**
Porque solo tiene la clave anónima y RLS lo bloquea. Necesita un service role key
o un Personal Access Token con permisos de administración. Hoy no está configurado.

**¿Por qué la tabla de usuarios no se consulta directo?**
Porque `auth.users` pertenece al esquema de Supabase Auth y no es accesible desde
el cliente. Se usa el RPC `get_admin_users()`.

**¿Dónde viven las imágenes?**
En Supabase Storage. `PropertyForm.tsx` sube el archivo y guarda la URL pública en
`properties.images`.

**¿Por qué el sitio funciona si falta una migración?**
Por diseño: las funciones que dependen de una tabla que no existe devuelven vacío y
la interfaz **oculta el control** en vez de mostrarlo roto. Así el sitio público
nunca se cae por un cambio de esquema que todavía no se aplicó.
