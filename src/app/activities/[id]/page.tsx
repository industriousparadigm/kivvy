import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingFlow } from '@/components/activities/booking-flow';
import { StaticMap } from '@/components/maps/google-map';
import {
  MapPin,
  Clock,
  Users,
  Star,
  Heart,
  Share2,
  Shield,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface ActivityPageProps {
  params: Promise<{
    id: string;
  }>;
}

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
  duration: number;
  maxParticipants: number;
  requirements?: string;
  whatToExpect?: string;
  provider: {
    id: string;
    businessName: string;
    description?: string;
    isVerified: boolean;
    businessType?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    email?: string;
    website?: string;
  };
  upcomingSessions: {
    id: string;
    startTime: string;
    endTime?: string;
    capacity: number;
    availableSpots: number;
    price?: number;
    status: string;
    notes?: string;
  }[];
  recentReviews?: {
    id: string;
    rating: number;
    comment: string;
    user: {
      id: string;
      name: string;
      image?: string;
    };
    createdAt: string;
  }[];
  reviewCount?: number;
  averageRating?: number;
}

async function getActivity(id: string): Promise<Activity | null> {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/activities/${id}`,
      {
        cache: 'no-store',
      }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch activity:', error);
    return null;
  }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const resolvedParams = await params;
  const activity = await getActivity(resolvedParams.id);

  if (!activity) {
    notFound();
  }

  const averageRating = activity.averageRating || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <Header />

      {/* Hero Section with Image */}
      <div className="relative h-96 bg-rose-900">
        {activity.imageUrl ? (
          <Image
            src={activity.imageUrl}
            alt={activity.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="h-20 w-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="h-10 w-10" />
              </div>
              <div className="text-xl font-light">{activity.category}</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-rose-900/10" />

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {activity.category}
                  </Badge>
                  <h1 className="text-3xl font-bold text-rose-900 mb-2">
                    {activity.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-rose-700">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{activity.ageGroup}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{activity.duration} minutos</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-700">
                    {formatPrice(activity.price)}
                  </div>
                  <div className="text-sm text-rose-600">por sessão</div>
                </div>
              </div>

              {/* Rating */}
              {averageRating > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  {activity.reviewCount && (
                    <span className="text-gray-600">
                      ({activity.reviewCount} avaliações)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre Esta Atividade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-rose-800 leading-relaxed">
                  {activity.description}
                </p>
              </CardContent>
            </Card>

            {/* What to Expect */}
            {activity.whatToExpect && (
              <Card>
                <CardHeader>
                  <CardTitle>O Que Esperar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-rose-800 leading-relaxed">
                    {activity.whatToExpect}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {activity.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requisitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-rose-800 leading-relaxed">
                    {activity.requirements}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Prestador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-rose-700">
                      {activity.provider.businessName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-rose-900">
                        {activity.provider.businessName}
                      </h3>
                      {activity.provider.isVerified && (
                        <Badge variant="success" size="sm">
                          <Shield className="h-3 w-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-rose-700 mb-2">
                      <span>
                        {activity.provider.address}, {activity.provider.city}
                      </span>
                    </div>
                    {activity.provider.description && (
                      <p className="text-rose-800 text-sm">
                        {activity.provider.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <span>Localização</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-rose-700">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {activity.provider.address}, {activity.provider.city}
                    </span>
                  </div>
                  <StaticMap
                    address={`${activity.provider.address}, ${activity.provider.city}`}
                    title={activity.title}
                    height="300px"
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {activity.recentReviews && activity.recentReviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Avaliações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activity.recentReviews.slice(0, 3).map(review => (
                    <div
                      key={review.id}
                      className="border-b border-rose-100 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-sm">
                          {review.user.name}
                        </span>
                        <span className="text-rose-600 text-sm">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="text-rose-800 text-sm">{review.comment}</p>
                    </div>
                  ))}
                  {activity.recentReviews.length > 3 && (
                    <Button variant="outline" className="w-full">
                      Ver Todas as Avaliações ({activity.recentReviews.length})
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingFlow
                activity={activity}
                sessions={activity.upcomingSessions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
