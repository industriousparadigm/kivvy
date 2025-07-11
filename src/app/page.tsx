import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ActivityCard } from '@/components/activities/activity-card';
import { Header } from '@/components/layout/header';
import {
  Search,
  Star,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price: number;
  location: string;
  category: string;
  ageGroup: string;
  rating?: number;
  totalReviews?: number;
  provider: {
    name: string;
  };
  _count?: {
    sessions: number;
  };
}

// This would typically come from an API call
async function getFeaturedActivities() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/activities?limit=6&featured=true`,
      {
        cache: 'no-store',
      }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch featured activities:', error);
    return [];
  }
}

function ActivityCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 rounded-t-xl"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default async function Home() {
  const featuredActivities = await getFeaturedActivities();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-yellow-300 mr-2" />
              <span className="text-lg font-medium">
                Descobrir • Reservar • Experienciar
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Atividades Incríveis para
              <span className="block text-yellow-300">Crianças Felizes</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-100">
              Descobre as melhores atividades para o teu filho no Porto e
              Matosinhos. De natação a programação, encontra experiências que
              vão inspirar e desenvolver.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/activities">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Explorar Atividades
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Saber Mais
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Atividades Disponíveis</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600">Prestadores de Confiança</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-pink-600">1000+</div>
              <div className="text-gray-600">Famílias Satisfeitas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Atividades em Destaque
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              As experiências mais populares escolhidas pelas famílias
            </p>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ActivityCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredActivities.length > 0 ? (
                featuredActivities.map((activity: Activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 mb-4">
                    Nenhuma atividade encontrada no momento.
                  </div>
                  <Link href="/activities">
                    <Button>Ver Todas as Atividades</Button>
                  </Link>
                </div>
              )}
            </div>
          </Suspense>

          {featuredActivities.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/activities">
                <Button size="lg" variant="outline">
                  Ver Todas as Atividades
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Porquê Escolher KidsHiz?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Qualidade Garantida
              </h3>
              <p className="text-gray-600">
                Todos os nossos prestadores são verificados e avaliados por
                outras famílias.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Para Todas as Idades
              </h3>
              <p className="text-gray-600">
                Desde os 3 aos 16 anos, temos atividades adequadas para cada
                fase do desenvolvimento.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto bg-pink-100 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Perto de Ti
              </h3>
              <p className="text-gray-600">
                Encontra atividades na tua área: Porto, Matosinhos e arredores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Pronto para Começar?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Regista-te hoje e descobre o mundo de possibilidades para o teu
            filho.
          </p>
          <div className="mt-8">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Criar Conta Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="text-xl font-bold">KidsHiz</span>
              </div>
              <p className="text-gray-400">
                A plataforma de descoberta e reserva de atividades para crianças
                em Portugal.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Para Pais</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/activities"
                    className="hover:text-white transition-colors"
                  >
                    Explorar Atividades
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="hover:text-white transition-colors"
                  >
                    Criar Conta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Centro de Ajuda
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Para Prestadores</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/provider/signup"
                    className="hover:text-white transition-colors"
                  >
                    Juntar-se ao KidsHiz
                  </Link>
                </li>
                <li>
                  <Link
                    href="/provider/resources"
                    className="hover:text-white transition-colors"
                  >
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/provider/support"
                    className="hover:text-white transition-colors"
                  >
                    Suporte
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Termos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 KidsHiz. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
