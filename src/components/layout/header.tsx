'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User, Menu, X, Heart, ShoppingBag, Settings } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center shadow-sm">
                <Heart className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-semibold text-rose-900">KidsHiz</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/activities"
              className="text-rose-700 hover:text-rose-900 transition-colors font-medium"
            >
              Atividades
            </Link>
            <Link
              href="/about"
              className="text-rose-700 hover:text-rose-900 transition-colors font-medium"
            >
              Sobre
            </Link>
            <Link
              href="/contact"
              className="text-rose-700 hover:text-rose-900 transition-colors font-medium"
            >
              Contacto
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-800 hover:bg-rose-50">
                    <Heart className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-800 hover:bg-rose-50">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <div className="flex items-center space-x-2 hover:bg-rose-50 rounded-xl px-3 py-2 transition-colors cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rose-400 to-amber-400 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-rose-800">
                      {session.user?.name || session.user?.email}
                    </span>
                  </div>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()} className="border-rose-200 text-rose-700 hover:bg-rose-50">
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-rose-700 hover:text-rose-900 hover:bg-rose-50">Entrar</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6">Registar</Button>
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
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Perfil
                    </Button>
                  </Link>
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
