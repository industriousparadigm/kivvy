'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Users, Euro } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterState {
  search: string;
  category: string;
  location: string;
  ageGroup: string;
  minPrice: string;
  maxPrice: string;
  date: string;
}

interface ActivityFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

const categories = [
  'Natação',
  'Dança',
  'Programação',
  'Música',
  'Artes',
  'Desporto',
  'Idiomas',
  'Ciências',
];

const ageGroups = [
  '3-5 anos',
  '6-8 anos',
  '9-12 anos',
  '13-15 anos',
  '16+ anos',
];

const locations = [
  'Porto',
  'Matosinhos',
  'Vila Nova de Gaia',
  'Maia',
  'Gondomar',
];

export function ActivityFilters({ onFiltersChange }: ActivityFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    location: '',
    ageGroup: '',
    minPrice: '',
    maxPrice: '',
    date: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      category: '',
      location: '',
      ageGroup: '',
      minPrice: '',
      maxPrice: '',
      date: '',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(
    value => value !== ''
  ).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Procurar atividades..."
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-1"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" size="sm">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpar
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={
                    filters.category === category ? 'primary' : 'outline'
                  }
                  size="sm"
                  onClick={() =>
                    updateFilter(
                      'category',
                      filters.category === category ? '' : category
                    )
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Location & Age Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Localização
              </label>
              <select
                value={filters.location}
                onChange={e => updateFilter('location', e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Todas as localizações</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Faixa Etária
              </label>
              <select
                value={filters.ageGroup}
                onChange={e => updateFilter('ageGroup', e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Todas as idades</option>
                {ageGroups.map(ageGroup => (
                  <option key={ageGroup} value={ageGroup}>
                    {ageGroup}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Euro className="inline h-4 w-4 mr-1" />
              Preço por Sessão
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Mín. €"
                type="number"
                value={filters.minPrice}
                onChange={e => updateFilter('minPrice', e.target.value)}
              />
              <Input
                placeholder="Máx. €"
                type="number"
                value={filters.maxPrice}
                onChange={e => updateFilter('maxPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Data
            </label>
            <Input
              type="date"
              value={filters.date}
              onChange={e => updateFilter('date', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
