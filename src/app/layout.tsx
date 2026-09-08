import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FIRE-GUARD ID | Deteksi Titik Api Karhutla & Analisis Trajektori Asap Real-Time',
  description:
    'Sistem pemantauan titik kebakaran hutan dan lahan (Karhutla) di wilayah sekitar Anda, dilengkapi analisis trajektori arah angin dan proyeksi ancaman kabut asap.',
  keywords: [
    'deteksi kebakaran hutan',
    'pantau karhutla indonesia',
    'hotspot nasa firms',
    'sipongi klhk',
    'arah angin asap kebakaran',
    'kualitas udara pm25'
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark bg-zinc-950 text-zinc-100 antialiased h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* Leaflet JS */}
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        ></script>
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-orange-900/50 selection:text-white">
        {children}
      </body>
    </html>
  );
}
