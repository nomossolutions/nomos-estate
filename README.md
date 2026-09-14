# Nomos Estate

Plataforma de bienes raíces de lujo desarrollada con Next.js.

## Autor

Nomos Digital

## Tecnologías

- **Framework:** Next.js 16 (App Router), React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4
- **Base de datos y auth:** Supabase
- **Mapas:** Leaflet, React-Leaflet
- **Iconos:** React Icons
- **Notificaciones:** Sonner
- **Tipografía:** Jost y Manrope, auto-alojadas (SIL Open Font License 1.1 — ver `public/fonts/README.md`)

## Estructura del proyecto

```
├── app/                  # Rutas (App Router)
│   ├── admin/            # Panel de administración
│   │   ├── categorias/   # Categorías de propiedad (las que usa el filtro público)
│   │   ├── propiedades/  # Listado, alta y edición de propiedades
│   │   └── usuarios/     # Directorio y asignación de roles
│   ├── properties/       # Ficha pública de una propiedad
│   ├── about/            # Sobre nosotros
│   └── login/            # Acceso
├── components/
│   ├── admin/            # Componentes del panel (sidebar, formulario, filtros)
│   └── ui/               # Componentes de interfaz y primitivas del sistema
├── lib/
│   ├── supabase/         # Clientes de Supabase (navegador, servidor, middleware)
│   ├── categories.ts     # Lectura de categorías
│   └── i18n.ts           # Textos de la interfaz (español)
├── public/
│   └── fonts/            # Tipografías auto-alojadas y su licencia
├── supabase/
│   ├── migrations/       # Cambios de esquema, para correr en el SQL Editor
│   └── seed/             # Datos de ejemplo
├── types/                # Tipos TypeScript (propiedad, colección, base de datos)
├── diseño/               # Material de diseño de referencia (no se importa desde el código)
├── DESIGN.md             # Sistema de diseño: el mundo visual y sus reglas
└── PRODUCT.md            # Contexto de producto
```

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

Necesita un archivo `.env` con las credenciales de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Base de datos

Los cambios de esquema viven en `supabase/migrations/` y **se corren a mano** en el
SQL Editor de Supabase, en orden. Hay que correrlos antes de usar las funciones que
dependen de ellos:

| Migración | Qué agrega |
|---|---|
| `20260914_categorias_de_propiedad.sql` | Tabla `property_categories` y columna `properties.category_id`. Sin ella, el filtro por categoría y su pantalla en el panel no aparecen. |

Para cargar datos de ejemplo: `supabase/seed/20_propiedades.sql` (borra lo que haya
y carga 20 propiedades: 10 casas y 10 departamentos, mitad en venta y mitad en
alquiler).

## Sistema de diseño

`DESIGN.md` es la fuente de verdad visual. Antes de agregar pantallas conviene
leerlo: el sistema tiene reglas duras —ninguna sombra, una sola familia de
esquinas, nada centrado, el acento en ≤10% de la pantalla— y hay herramientas de
verificación que las auditan.
