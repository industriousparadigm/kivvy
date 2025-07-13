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
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-rose-100 bg-white rounded-3xl hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        {activity.imageUrl && !activity.imageUrl.includes('example.com') ? (
          <Image
            src={activity.imageUrl}
            alt={activity.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-3xl"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center relative rounded-t-3xl`}>
            <div className="text-center z-10">
              <div className={`w-16 h-16 mx-auto mb-3 ${config.bgColor} rounded-full flex items-center justify-center shadow-sm border border-white/50`}>
                <div className={`w-8 h-8 ${config.badgeColor} rounded-full`}></div>
              </div>
              <div className={`${config.textColor} font-medium text-base`}>
                {config.name}
              </div>
            </div>
          </div>
        )}
        
        {/* Gentle category badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${config.badgeColor} text-white border-0 shadow-sm text-xs px-2 py-1 rounded-full`}>
            {config.name}
          </Badge>
        </div>
        
        {/* Heart button */}
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm rounded-full transition-all duration-300"
          >
            <Heart className="h-4 w-4 text-rose-400 hover:text-rose-600 transition-colors" />
          </Button>
        </div>
        
        {/* Rating */}
        {activity.averageRating && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/95 rounded-full px-2 py-1 shadow-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-gray-700">
              {activity.averageRating.toFixed(1)}
            </span>
          </div>
        )}
        
        {/* Verified badge */}
        {activity.provider.isVerified && (
          <div className="absolute bottom-3 right-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-medium text-lg text-rose-900 line-clamp-2 leading-tight">
              {activity.title}
            </h3>
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-semibold text-amber-800">
                {formatPrice(activity.price)}
              </div>
            </div>
          </div>

          <p className="text-rose-700 text-sm line-clamp-2 leading-relaxed">
            {activity.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-rose-600">
              <MapPin className="h-3 w-3" />
              <span className="truncate text-xs">{activity.location}</span>
            </div>
            <div className="flex items-center space-x-1 text-amber-700 font-medium">
              <Users className="h-3 w-3" />
              <span className="text-xs">{activity.ageMin}-{activity.ageMax} anos</span>
            </div>
          </div>

          {activity.nextSessions && activity.nextSessions.length > 0 && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs font-medium">{activity.nextSessions.length} sessões</span>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <div className="text-xs text-rose-600">
              Com <span className="font-medium">{activity.provider.businessName}</span>
              {activity.provider.isVerified && (
                <span className="ml-1 text-emerald-600">✓</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link href={`/activities/${activity.id}`} className="w-full">
          <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-2xl py-3 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300">
            Saber Mais
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}