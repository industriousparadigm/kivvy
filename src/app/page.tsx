import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ActivityCard } from '@/components/activities/activity-card';
import { Header } from '@/components/layout/header';
import { Heart, Shield, Star } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price: number;
  location: string;
  category: string;
  ageMin: number;
  ageMax: number;
  averageRating?: number;
  reviewCount?: number;
  provider: {
    id: string;
    businessName: string;
    city: string;
    isVerified: boolean;
  };
  nextSessions?: Array<{
    id: string;
    startTime: string;
    availableSpots: number;
  }>;
}

// Fetch featured activities
async function getFeaturedActivities() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/activities?limit=6`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );
    if (!response.ok) return { activities: [] };
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch featured activities:', error);
    return { activities: [] };
  }
}

export default async function HomePage() {
  const { activities: featuredActivities } = await getFeaturedActivities();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 page-enter">
      <Header />

      {/* Nurturing Hero Section */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Image */}
          <div className="relative h-96 bg-gradient-to-r from-rose-100 to-amber-100 rounded-3xl mb-12 overflow-hidden shadow-lg">
            <Image
              src="/images/hero-birthday-party.png"
              alt="Crianças felizes numa festa de aniversário no centro de atividades"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <div className="text-xs uppercase tracking-wider opacity-90 mb-2">
                Um momento especial
              </div>
              <div className="text-lg font-medium">
                Quando os olhinhos brilham de alegria
              </div>
            </div>
          </div>

          <div className="text-center stagger-children">
            <h1 className="text-4xl sm:text-6xl font-light mb-6 text-rose-900 leading-tight">
              Onde pequenos sonhos
              <br />
              <span className="font-semibold text-amber-800">ganham vida</span>
            </h1>
            <p className="text-lg sm:text-xl text-rose-700 max-w-2xl mx-auto leading-relaxed mb-12">
              Atividades pensadas com carinho para criar memórias que durarão
              para sempre
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 stagger-children">
            <Link href="/activities">
              <Button
                size="lg"
                className="nurturing-button warm-gradient-hover text-white px-10 py-4 text-lg rounded-full shadow-lg"
              >
                Descobrir Atividades
              </Button>
            </Link>
            <Link href="#featured">
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-4 text-lg rounded-full border-2 border-amber-300 text-amber-800 hover:bg-amber-50 transition-all duration-300"
              >
                Festa de Aniversário
              </Button>
            </Link>
          </div>

          {/* Gentle Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center stagger-children">
            <div className="bg-white/80 rounded-2xl p-6 shadow-sm gentle-hover card-enter">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 floating-heart">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <div className="text-rose-900 font-medium">Cuidado & Carinho</div>
              <div className="text-rose-700 text-sm mt-1">Em cada detalhe</div>
            </div>
            <div className="bg-white/80 rounded-2xl p-6 shadow-sm gentle-hover card-enter">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 floating-heart">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-rose-900 font-medium">Totalmente Seguro</div>
              <div className="text-rose-700 text-sm mt-1">
                Tranquilidade para ti
              </div>
            </div>
            <div className="bg-white/80 rounded-2xl p-6 shadow-sm gentle-hover card-enter">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 floating-heart">
                <Star className="h-6 w-6 text-rose-600" />
              </div>
              <div className="text-rose-900 font-medium">Momentos Únicos</div>
              <div className="text-rose-700 text-sm mt-1">
                Que ficam no coração
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stories from Mothers */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-rose-900 mb-4">
              Histórias que aquecem o coração
            </h2>
            <p className="text-lg text-rose-700 max-w-xl mx-auto">
              O que outras mães dizem sobre estes momentos especiais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {/* Story Card 1 */}
            <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 gentle-hover card-enter">
              <div className="relative h-48 rounded-2xl mb-4 overflow-hidden">
                <Image
                  src="/images/testimonial-art-activity.png"
                  alt="Mãos de crianças criando projetos de arte coloridos"
                  fill
                  className="object-cover"
                />
              </div>
              <blockquote className="text-rose-800 italic mb-3">
                &ldquo;Nunca vi a Maria tão concentrada. Chegou a casa e disse:
                &lsquo;Mãe, sou uma artista!&rsquo;&rdquo;
              </blockquote>
              <div className="text-sm text-rose-600">
                — Ana, mãe da Maria (5 anos)
              </div>
            </div>

            {/* Story Card 2 */}
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 gentle-hover card-enter">
              <div className="relative h-48 rounded-2xl mb-4 overflow-hidden">
                <Image
                  src="/images/testimonial-music-dance.png"
                  alt="Pequeno grupo de crianças com instrumentos musicais"
                  fill
                  className="object-cover"
                />
              </div>
              <blockquote className="text-amber-800 italic mb-3">
                &ldquo;O Pedro era tímido. Agora dança pela casa toda. É pura
                alegria vê-lo assim.&rdquo;
              </blockquote>
              <div className="text-sm text-amber-600">
                — Sofia, mãe do Pedro (4 anos)
              </div>
            </div>

            {/* Story Card 3 */}
            <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 md:col-span-2 lg:col-span-1 gentle-hover card-enter">
              <div className="relative h-48 rounded-2xl mb-4 overflow-hidden">
                <Image
                  src="/images/testimonial-special-moment.png"
                  alt="Pai dando abraço carinhoso à criança antes da atividade"
                  fill
                  className="object-cover"
                />
              </div>
              <blockquote className="text-rose-800 italic mb-3">
                &ldquo;A festa da Beatriz foi perfeita. Ela ainda fala dos
                amigos que fez naquele dia.&rdquo;
              </blockquote>
              <div className="text-sm text-rose-600">
                — Carla, mãe da Beatriz (6 anos)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section
        id="featured"
        className="py-20 bg-gradient-to-b from-amber-50 to-rose-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-rose-900 mb-4">
              Aventuras que esperam pelo teu pequeno
            </h2>
            <p className="text-lg text-rose-700 max-w-xl mx-auto">
              Cada atividade é uma nova descoberta, um novo sorriso
            </p>
          </div>

          <Suspense
            fallback={
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-white/60 rounded-3xl animate-pulse border border-rose-100"
                  />
                ))}
              </div>
            }
          >
            {featuredActivities.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredActivities.slice(0, 6).map((activity: Activity) => (
                  <div
                    key={activity.id}
                    className="transform hover:scale-[1.02] transition-transform duration-300"
                  >
                    <ActivityCard activity={activity} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-rose-600" />
                </div>
                <p className="text-rose-700 text-lg">
                  A preparar experiências especiais...
                </p>
              </div>
            )}
          </Suspense>

          <div className="text-center mt-16">
            <Link href="/activities">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Ver Todas as Aventuras
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
