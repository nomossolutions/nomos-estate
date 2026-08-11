# Nomos Estate

Plataforma de bienes raíces de lujo desarrollada con Next.js.

## Autor

Nomos Digital

## Tecnologías

- **Framework:** Next.js 16, React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4
- **Base de datos:** Supabase
- **Mapas:** Leaflet, React-Leaflet
- **Iconos:** React Icons
- **Notificaciones:** Sonner

## Estructura del proyecto

```
├── app/                # Rutas y páginas de la aplicación
├── components/         # Componentes React reutilizables
│   ├── admin/          # Componentes del panel de administración
│   └── ui/             # Componentes de interfaz genéricos
├── data/               # Datos y diccionarios
├── lib/                # Utilidades y configuración
│   └── supabase/       # Configuración de Supabase
├── public/             # Archivos estáticos (imágenes, iconos)
└── types/              # Definiciones de tipos TypeScript
```

## Iniciar desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.
