import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/session-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { SkipNavigation } from '@/components/accessibility/skip-navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kivvy - Atividades para Crianças',
  description:
    'Plataforma de descoberta e reserva de atividades para crianças em Portugal',
  keywords: [
    'kivvy',
    'atividades',
    'crianças',
    'Porto',
    'Matosinhos',
    'natação',
    'dança',
    'programação',
  ],
  authors: [{ name: 'Kivvy Team' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Kivvy - Atividades para Crianças',
    description:
      'Descobre e reserva as melhores atividades para crianças no Porto e Matosinhos',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'Kivvy',
    images: [
      {
        url: '/images/hero-birthday-party.png',
        width: 1200,
        height: 630,
        alt: 'Kivvy - Atividades para Crianças',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kivvy - Atividades para Crianças',
    description:
      'Descobre e reserva as melhores atividades para crianças no Porto e Matosinhos',
    images: ['/images/hero-birthday-party.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <SkipNavigation />
        <ErrorBoundary>
          <AuthProvider>
            <main id="main-content">
              {children}
            </main>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
