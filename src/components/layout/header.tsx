'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User, Menu, X, Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900">KidsHiz</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/activities"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Atividades
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ShoppingBag className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Registar</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/activities"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Atividades
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>

            <div className="border-t border-gray-200 pt-3">
              {session ? (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <div className="text-sm font-medium text-gray-900">
                      {session.user?.name || session.user?.email}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Registar</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
