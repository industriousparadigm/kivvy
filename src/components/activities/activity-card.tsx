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
    ageGroup: string;
    rating?: number;
    totalReviews?: number;
    provider: {
      name: string;
    };
    _count?: {
      sessions: number;
    };
  };
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        {activity.imageUrl ? (
          <Image
            src={activity.imageUrl}
            alt={activity.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <div className="h-12 w-12 mx-auto mb-2 bg-white/80 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {activity.category}
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary">{activity.category}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        {activity.rating && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">
              {activity.rating.toFixed(1)}
            </span>
            {activity.totalReviews && (
              <span className="text-xs text-gray-600">
                ({activity.totalReviews})
              </span>
            )}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {activity.title}
            </h3>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {formatPrice(activity.price)}
              </div>
              <div className="text-xs text-gray-500">por sessão</div>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {activity.description}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{activity.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{activity.ageGroup}</span>
            </div>
          </div>

          {activity._count?.sessions && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{activity._count.sessions} sessões disponíveis</span>
            </div>
          )}

          <div className="text-sm text-gray-600">
            Por <span className="font-medium">{activity.provider.name}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/activities/${activity.id}`} className="w-full">
          <Button className="w-full">Ver Detalhes</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
