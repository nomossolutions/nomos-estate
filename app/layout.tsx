import type { Metadata } from 'next';
import localFont from 'next/font/local';
import SiteChrome from '@/components/SiteChrome';
import Toaster from '@/components/Toaster';
import './globals.css';

/*
 * Fuentes self-hosted (SIL Open Font License 1.1 — ver public/fonts/README.md).
 *
 * No usamos next/font/google: el entorno de build de este proyecto no tiene
 * salida a red, así que una descarga en build rompería el build. Los .ttf se
 * compilan a woff2 y se subsetean en build, así que el formato de entrada es
 * irrelevante para el peso servido.
 *
 * Jost (display) + Manrope (texto): sans modernas y redondeadas. Reemplazan al
 * par Bodoni Moda + Archivo, que era un didone editorial de alto contraste.
 */
const jost = localFont({
  src: [
    { path: '../public/fonts/jost-400.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/jost-600.ttf', weight: '600', style: 'normal' },
  ],
  variable: '--font-folio',
  display: 'swap',
  fallback: ['Futura', 'Century Gothic', 'system-ui', 'sans-serif'],
  preload: true,
});

const manrope = localFont({
  src: [
    { path: '../public/fonts/manrope-400.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/manrope-500.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/manrope-600.ttf', weight: '600', style: 'normal' },
  ],
  variable: '--font-lectura',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
  preload: true,
});

export const metadata: Metadata = {
  title: 'Nomos Estate',
  description: 'Encuentra la propiedad de tus sueños con Nomos Estate',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${jost.variable} ${manrope.variable} font-lectura antialiased bg-hoja text-tinta`}
      >
        {/*
          CONTRATO DE DIRECCIÓN — Nomos Estate, home pública (app/page.tsx)
          THESIS: La fotografía es la obra y el vacío hace el trabajo: un lienzo neutro y frío donde el inmueble se exhibe, no se documenta. Se rechaza el scaffold héroe-centrado + grilla de tarjetas blancas flotantes.
          OWN-WORLD: Blanco de sala #FAFAFA con superficie elevada #FFFFFF, negro neutro #16171A, y el latón #8A6A1F como ÚNICO acento. Ninguna sombra: todo límite es una regla de 1px. Una sola familia de esquinas, 4px. Jost para display y Manrope para el texto. Cero iconos en círculo, cero eyebrows, cero numeración de serie, cero sellos.
          STORY: El visitante ve primero la fotografía de la propiedad, entiende el precio y la ubicación en el acto, y pasa a buscar o consultar sin que la interfaz se interponga.
          FIRST VIEWPORT: La fotografía entra a sangre ocupando todo el ancho, sin rail, sin marco y sin nada que le compita; sobre su borde inferior se apoya la fila de búsqueda. Debajo, sobre el lienzo, el titular de escala display alineado al margen izquierdo —nunca centrado— y los ejes de tipo.
          FORM: Sala Blanca — el museo fotográfico. Reemplaza al mundo anterior ("Folio y Sello"), que tomaba su autoridad del protocolo documental; este la toma de la precisión del vacío. El pivote conservó la estructura (reglas de 1px, esquinas únicas, asimetría, tipografía) y retiró la metáfora (serie, sello, foliación, papel cálido).
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-tinta focus:text-hoja focus:px-4 focus:py-2 focus:rounded-sm"
        >
          Saltar al contenido principal
        </a>
        <SiteChrome>{children}</SiteChrome>
        <Toaster />
      </body>
    </html>
  );
}
