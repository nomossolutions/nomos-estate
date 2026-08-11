# Guía de migración: Supabase → MongoDB + Node/Express

## Contexto actual

El proyecto usa Supabase como backend completo: base de datos, autenticación y storage. El objetivo es reemplazarlo por un backend propio con **MongoDB, Node.js y Express**.

---

## 1. Estructura de datos

### Colección: `properties`

```js
{
  _id: ObjectId,
  title: String,
  slug: String,           // único, indexado
  location: String,
  price: Number,
  images: [String],       // URLs de imágenes
  beds: Number,
  baths: Number,
  sqft: Number,
  type: "sale" | "rent",
  is_new: Boolean,
  is_featured: Boolean,
  is_active: Boolean,
  lat: Number,
  lng: Number,
  description: String,
  year_built: Number,
  parking: Number,
  amenities: [String],
  created_at: Date
}
```

### Colección: `users`

```js
{
  _id: ObjectId,
  email: String,          // único
  password: String,       // hasheado con bcrypt
  role: "admin" | "user",
  created_at: Date
}
```

### Collection: `refresh_tokens` (para sesiones)

```js
{
  _id: ObjectId,
  user_id: ObjectId,
  token: String,
  expires_at: Date
}
```

---

## 2. Endpoints necesarios

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Crear usuario |
| POST | `/api/auth/login` | Login, retorna JWT |
| POST | `/api/auth/logout` | Eliminar refresh token |
| GET | `/api/auth/me` | Obtener usuario actual (requiere JWT) |

### Properties

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/properties` | Listar propiedades (público, con filtros y paginación) |
| GET | `/api/properties/:slug` | Detalle por slug (público) |
| POST | `/api/properties` | Crear propiedad (admin) |
| PUT | `/api/properties/:id` | Actualizar propiedad (admin) |
| PATCH | `/api/properties/:id/toggle` | Activar/desactivar (admin) |

### Users (admin)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/users` | Listar usuarios con roles (admin) |
| PATCH | `/api/admin/users/:id/role` | Cambiar rol (admin) |
| POST | `/api/admin/users` | Crear usuario con rol (admin) |

### Storage

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/upload` | Subir imagen, retorna URL (admin) |

---

## 3. Query params para listado de propiedades

El endpoint `GET /api/properties` debe soportar:

```
?page=1&limit=12
&location=Punta del Este
&type=sale
&minPrice=500000
&maxPrice=2000000
&beds=3
&baths=2
&featured=true
&active=true
```

La respuesta debe incluir `total` para la paginación:

```json
{
  "data": [...],
  "total": 48,
  "page": 1,
  "limit": 12
}
```

---

## 4. Autenticación

Usar **JWT** (access token + refresh token):

- **Access token**: 15 min de vida, se envía en header `Authorization: Bearer <token>`
- **Refresh token**: 7 días, se guarda en cookie httpOnly o en localStorage
- **Password hashing**: bcrypt con 10 rounds

### Middleware de verificación

```js
// Verificar token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
}

// Verificar admin
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
```

---

## 5. Desconectar Supabase

### 5.1 Eliminar paquetes

```bash
npm uninstall @supabase/ssr @supabase/supabase-js
```

### 5.2 Eliminar carpeta `lib/supabase/`

Borrar los archivos:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`

### 5.3 Eliminar variables de entorno

Borrar de `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 5.4 Eliminar tipos

Borrar `types/supabase.ts`.

### 5.5 Actualizar `next.config.ts`

Eliminar las imágenes remotas de Supabase en `images.remotePatterns`:
```ts
// Eliminar estos dos objetos:
{ protocol: 'https', hostname: 'sjlojbdoihgappqtmads.supabase.co' },
{ protocol: 'https', hostname: 'dsvnzmshjwtksegfppeu.supabase.co' },
```

Agregar el dominio de tu backend para las imágenes.

---

## 6. Conectar el nuevo backend

### 6.1 Crear cliente API

Crear `lib/api.ts`:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
```

### 6.2 Crear cliente autenticado

Crear `lib/auth-client.ts`:

```ts
let accessToken: string | null = null;

export function setToken(token: string | null) {
  accessToken = token;
}

export async function authFetch(path: string, options?: RequestInit) {
  return apiFetch(path, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
```

### 6.3 Variables de entorno nuevas

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL_SERVER=http://localhost:3001
```

---

## 7. Archivos a modificar en el frontend

Cada archivo que importa Supabase debe reescribirse para usar `apiFetch` o `authFetch`:

| Archivo | Cambio principal |
|---------|------------------|
| `app/page.tsx` | `apiFetch('/api/properties?...')` en vez de query Supabase |
| `app/properties/[slug]/page.tsx` | `apiFetch('/api/properties/' + slug)` |
| `app/login/page.tsx` | `apiFetch('/api/auth/login', {method:'POST', body})` |
| `app/auth/callback/route.ts` | Manejar JWT en vez de code exchange |
| `app/admin/properties/page.tsx` | `authFetch('/api/admin/properties?...')` |
| `app/admin/properties/[slug]/edit/page.tsx` | `authFetch(...)` |
| `app/admin/users/page.tsx` | `authFetch('/api/admin/users')` |
| `app/admin/users/actions.ts` | `authFetch(...)` |
| `components/FeaturedCollection.tsx` | `apiFetch('/api/properties?featured=true&limit=2')` |
| `components/Navbar.tsx` | `authFetch('/api/auth/me')` |
| `components/LogoutButton.tsx` | `authFetch('/api/auth/logout', {method:'POST'})` |
| `components/admin/PropertyForm.tsx` | `authFetch(...)` para crear/editar + upload separado |
| `middleware.ts` | Reemplazar lógica de Supabase por verificación JWT propia |

---

## 8. Storage de imágenes

Opciones:
1. **Local**: Multer + carpeta `public/uploads/` (para desarrollo)
2. **Cloud**: AWS S3, Cloudinary, o similar

Si usas Multer:

```js
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
```

La imagen se sirve desde `/uploads/nombre.jpg` (carpeta pública de Next.js).

---

## 9. Resumen de pasos

1. Crear el backend Express con las rutas documentadas arriba
2. Configurar MongoDB con las colecciones `properties`, `users`, `refresh_tokens`
3. Implementar JWT + bcrypt para auth
4. Ejecutar `npm uninstall @supabase/ssr @supabase/supabase-js`
5. Borrar `lib/supabase/`, `types/supabase.ts`
6. Crear `lib/api.ts` y `lib/auth-client.ts`
7. Actualizar `.env` con `NEXT_PUBLIC_API_URL`
8. Actualizar `next.config.ts` (imágenes remotas)
9. Reescribir los 13 archivos listados en la sección 7
10. Actualizar `middleware.ts` para usar JWT propio
11. Configurar storage de imágenes (Multer o cloud)
