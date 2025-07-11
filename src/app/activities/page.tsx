'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { ActivityCard } from '@/components/activities/activity-card';
import { ActivityFilters } from '@/components/activities/activity-filters';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Filter } from 'lucide-react';

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
        if (!response.ok) throw new Error('Failed to fetch activities');

        const newActivities = await response.json();

        if (resetPage) {
          setActivities(newActivities);
        } else {
          setActivities(prev => [...prev, ...newActivities]);
        }

        setHasMore(newActivities.length === 12);
        if (!resetPage) {
          setPage(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Explora Atividades para Crianças
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Descobre experiências incríveis no Porto e Matosinhos
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
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activities Grid */}
            {!loading && activities.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {activities.map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      variant="outline"
                      size="lg"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />A
                          carregar...
                        </>
                      ) : (
                        'Ver Mais Atividades'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && activities.length === 0 && (
              <div className="text-center py-12">
                <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma atividade encontrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Tenta ajustar os teus filtros ou procurar por algo diferente.
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
                  variant="outline"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
