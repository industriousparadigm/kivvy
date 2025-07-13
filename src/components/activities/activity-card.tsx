import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Users, Star, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

interface ActivityCardProps {
  activity: {
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
  };
}

// Category themes with warm, nurturing colors
const categoryConfig = {
  DANCE: { 
    gradient: 'from-rose-200 to-pink-200', 
    name: 'Dança',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-900',
    badgeColor: 'bg-rose-600'
  },
  SPORTS: { 
    gradient: 'from-amber-200 to-orange-200', 
    name: 'Desporto',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-900',
    badgeColor: 'bg-amber-600'
  },
  ARTS_CRAFTS: { 
    gradient: 'from-purple-200 to-rose-200', 
    name: 'Arte',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-900',
    badgeColor: 'bg-purple-600'
  },
  MUSIC: { 
    gradient: 'from-blue-200 to-cyan-200', 
    name: 'Música',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    badgeColor: 'bg-blue-600'
  },
  SCIENCE: { 
    gradient: 'from-emerald-200 to-teal-200', 
    name: 'Ciência',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-900',
    badgeColor: 'bg-emerald-600'
  },
  TECHNOLOGY: { 
    gradient: 'from-indigo-200 to-blue-200', 
    name: 'Tecnologia',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-900',
    badgeColor: 'bg-indigo-600'
  },
  EDUCATION: { 
    gradient: 'from-teal-200 to-cyan-200', 
    name: 'Educação',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-900',
    badgeColor: 'bg-teal-600'
  },
  LANGUAGES: { 
    gradient: 'from-violet-200 to-purple-200', 
    name: 'Idiomas',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-900',
    badgeColor: 'bg-violet-600'
  },
  OUTDOOR: { 
    gradient: 'from-green-200 to-emerald-200', 
    name: 'Ar Livre',
    bgColor: 'bg-green-50',
    textColor: 'text-green-900',
    badgeColor: 'bg-green-600'
  },
  SWIMMING: { 
    gradient: 'from-cyan-200 to-blue-200', 
    name: 'Natação',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-900',
    badgeColor: 'bg-cyan-600'
  },
  MARTIAL_ARTS: { 
    gradient: 'from-red-200 to-orange-200', 
    name: 'Artes Marciais',
    bgColor: 'bg-red-50',
    textColor: 'text-red-900',
    badgeColor: 'bg-red-600'
  },
  THEATER: { 
    gradient: 'from-pink-200 to-rose-200', 
    name: 'Teatro',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-900',
    badgeColor: 'bg-pink-600'
  },
  OTHER: { 
    gradient: 'from-gray-200 to-slate-200', 
    name: 'Outras',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-900',
    badgeColor: 'bg-gray-600'
  },
  COOKING: { 
    gradient: 'from-orange-200 to-red-200', 
    name: 'Culinária',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-900',
    badgeColor: 'bg-orange-600'
  },
  DEFAULT: { 
    gradient: 'from-rose-200 to-amber-200', 
    name: 'Atividade',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-900',
    badgeColor: 'bg-rose-600'
  },
};

export function ActivityCard({ activity }: ActivityCardProps) {
  const config = categoryConfig[activity.category as keyof typeof categoryConfig] || categoryConfig.DEFAULT;
  
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white rounded-3xl hover:-translate-y-2 shadow-lg">
      <div className="relative h-56 overflow-hidden">
        {activity.imageUrl && !activity.imageUrl.includes('example.com') ? (
          <Image
            src={activity.imageUrl}
            alt={activity.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 rounded-t-3xl"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center relative rounded-t-3xl`}>
            <div className="text-center z-10">
              <Heart className="h-12 w-12 text-white/80 mx-auto mb-2" />
              <div className="text-white/90 font-light text-lg">
                {config.name}
              </div>
            </div>
          </div>
        )}
        
        {/* Simple heart button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <Heart className="h-5 w-5 text-rose-400 hover:text-rose-600 hover:fill-rose-600 transition-all" />
          </Button>
        </div>
        
        {/* Price badge */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg">
            <div className="text-lg font-semibold text-amber-800">
              {formatPrice(activity.price)}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-light text-xl text-rose-900 leading-tight mb-3">
              {activity.title}
            </h3>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-rose-700">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-amber-600" />
                <span>{activity.provider.city}</span>
              </div>
              <div className="w-1 h-1 bg-rose-300 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-amber-600" />
                <span>{activity.ageMin}-{activity.ageMax} anos</span>
              </div>
            </div>
          </div>

          {activity.averageRating && (
            <div className="flex items-center justify-center space-x-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-amber-700">
                {activity.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-rose-600 ml-1">
                ({activity.reviewCount || 0} avaliações)
              </span>
            </div>
          )}

          <div className="text-center">
            <div className="text-sm text-rose-600">
              por <span className="font-medium text-amber-700">{activity.provider.businessName}</span>
              {activity.provider.isVerified && (
                <span className="ml-1 text-emerald-600 font-medium">✓ Verificado</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/activities/${activity.id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-2xl py-4 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Reservar Experiência
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}