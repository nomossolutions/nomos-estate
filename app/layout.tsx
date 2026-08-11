import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toaster from '@/components/Toaster';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
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
        className={`${inter.variable} ${playfair.variable} font-body antialiased bg-clear-day text-charcoal`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-charcoal focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Saltar al contenido principal
        </a>
        <Navbar />
        <div id="main-content">
          {children}
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
