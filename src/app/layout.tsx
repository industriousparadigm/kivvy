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
  title: 'KidsHiz - Atividades para Crianças',
  description:
    'Plataforma de descoberta e reserva de atividades para crianças em Portugal',
  keywords: [
    'atividades',
    'crianças',
    'Porto',
    'Matosinhos',
    'natação',
    'dança',
    'programação',
  ],
  authors: [{ name: 'KidsHiz Team' }],
  openGraph: {
    title: 'KidsHiz - Atividades para Crianças',
    description:
      'Descobre e reserva as melhores atividades para crianças no Porto e Matosinhos',
    type: 'website',
    locale: 'pt_PT',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
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
