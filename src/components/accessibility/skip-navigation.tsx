'use client';

import { cn } from '@/lib/utils';

interface SkipNavigationProps {
  className?: string;
}

export function SkipNavigation({ className }: SkipNavigationProps) {
  return (
    <a
      href="#main-content"
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
        'bg-blue-600 text-white px-4 py-2 rounded-md font-medium',
        'z-50 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
    >
      Saltar para o conteúdo principal
    </a>
  );
}

// Skip links for complex navigation
export function SkipLinks() {
  const links = [
    { href: '#main-content', text: 'Saltar para o conteúdo principal' },
    { href: '#main-navigation', text: 'Saltar para a navegação principal' },
    { href: '#search', text: 'Saltar para a pesquisa' },
    { href: '#footer', text: 'Saltar para o rodapé' },
  ];

  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              'bg-blue-600 text-white px-4 py-2 rounded-md font-medium',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'hover:bg-blue-700'
            )}
          >
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );
}