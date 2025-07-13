'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { ActivityCard } from '@/components/activities/activity-card';
import { ActivityFilters } from '@/components/activities/activity-filters';
import { Button } from '@/components/ui/button';
import { MapPin, Heart } from 'lucide-react';

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
    endTime?: string;
    availableSpots: number;
    capacity?: number;
    price?: number;
  }>;
  savedCount?: number;
}

interface FilterState {
  search: string;
  category: string;
  location: string;
  ageGroup: string;
  minPrice: string;
  maxPrice: string;
  date: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    location: '',
    ageGroup: '',
    minPrice: '',
    maxPrice: '',
    date: '',
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchActivities = useCallback(
    async (resetPage = false) => {
      if (resetPage) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      try {
        setError(null); // Clear previous errors
        
        const params = new URLSearchParams({
          page: resetPage ? '1' : page.toString(),
          limit: '12',
        });

        // Add filters to params
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });

        const response = await fetch(`/api/activities?${params.toString()}`);
        if (!response.ok) {
          if (response.status === 500) {
            throw new Error('Os nossos elfos encontraram um problema técnico. Tenta novamente em alguns momentos!');
          } else if (response.status === 404) {
            throw new Error('Não conseguimos encontrar atividades neste momento.');
          } else {
            throw new Error('Algo correu mal ao carregar as atividades. Verifica a tua ligação à internet!');
          }
        }

        const data = await response.json();
        const newActivities = data.activities || [];

        if (resetPage) {
          setActivities(newActivities);
        } else {
          setActivities(prev => [...prev, ...newActivities]);
        }

        setHasMore(data.pagination?.hasNext || newActivities.length === 12);
        if (!resetPage) {
          setPage(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters, page]
  );

  useEffect(() => {
    fetchActivities(true);
  }, [filters, fetchActivities]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchActivities(false);
    }
  };

  const retryFetch = () => {
    fetchActivities(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
      <Header />

      {/* Warm Page Header */}
      <div className="bg-white/90 border-b border-rose-100">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-light text-rose-900 mb-4">
              Aventuras especiais
              <br />
              <span className="font-semibold text-amber-800">para o teu pequeno</span>
            </h1>
            <p className="mt-4 text-lg text-rose-700 max-w-2xl mx-auto">
              Cada atividade é uma oportunidade para criar memórias preciosas
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ActivityFilters onFiltersChange={handleFiltersChange} />
            </div>
          </div>

          {/* Activities Grid */}
          <div className="lg:col-span-3">
            {/* Results Summary */}
            {!loading && (
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {activities.length > 0
                    ? `${activities.length} ${activities.length === 1 ? 'atividade encontrada' : 'atividades encontradas'}`
                    : 'Nenhuma atividade encontrada'}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Porto e Matosinhos</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 bg-white/60 rounded-3xl animate-pulse border border-rose-100" />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-rose-600" />
                </div>
                <h3 className="text-2xl font-medium text-rose-900 mb-4">Algo não correu bem</h3>
                <p className="text-rose-700 mb-6">{error}</p>
                <Button onClick={retryFetch} className="bg-rose-600 hover:bg-rose-700 text-white">
                  Tentar Novamente
                </Button>
              </div>
            )}

            {/* Activities Grid */}
            {!loading && !error && activities.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {activities.map(activity => (
                    <div key={activity.id} className="transform hover:scale-[1.02] transition-transform duration-300">
                      <ActivityCard activity={activity} />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-12 text-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      size="lg"
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {loadingMore ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          A carregar mais...
                        </>
                      ) : (
                        <>
                          Ver Mais Atividades
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && !error && activities.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-rose-600" />
                </div>
                
                <h3 className="text-2xl font-medium text-rose-900 mb-4">
                  Nenhuma atividade encontrada
                </h3>
                <p className="text-rose-700 max-w-md mx-auto leading-relaxed mb-8">
                  Não encontrámos atividades com esses critérios. 
                  Que tal ajustar os filtros?
                </p>
                
                <Button
                  onClick={() =>
                    setFilters({
                      search: '',
                      category: '',
                      location: '',
                      ageGroup: '',
                      minPrice: '',
                      maxPrice: '',
                      date: '',
                    })
                  }
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Mostrar Todas as Atividades
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
