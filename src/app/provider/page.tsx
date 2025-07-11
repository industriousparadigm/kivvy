'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Calendar,
  Users,
  Euro,
  TrendingUp,
  Activity,
  MapPin,
  Edit,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

interface ProviderActivity {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  ageGroup: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    sessions: number;
    bookings: number;
  };
}

interface ProviderBooking {
  id: string;
  status: string;
  totalAmount: number;
  participants: number;
  createdAt: string;
  session: {
    id: string;
    dateTime: string;
    activity: {
      title: string;
    };
  };
  user: {
    name: string;
    email: string;
  };
}

interface DashboardStats {
  totalActivities: number;
  totalBookings: number;
  totalRevenue: number;
  activeActivities: number;
}

export default function ProviderDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState<ProviderActivity[]>([]);
  const [bookings, setBookings] = useState<ProviderBooking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalActivities: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeActivities: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'activities' | 'bookings'
  >('overview');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Check if user has PROVIDER role
    if (session.user?.role !== 'PROVIDER' && session.user?.role !== 'ADMIN') {
      router.push('/unauthorized');
      return;
    }

    fetchProviderData();
  }, [session, status, router]);

  const fetchProviderData = async () => {
    try {
      const [activitiesRes, bookingsRes] = await Promise.all([
        fetch('/api/provider/activities'),
        fetch('/api/provider/bookings'),
      ]);

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData);

        // Calculate stats
        const totalBookings = activitiesData.reduce(
          (sum: number, activity: ProviderActivity) =>
            sum + activity._count.bookings,
          0
        );
        const activeActivities = activitiesData.filter(
          (activity: ProviderActivity) => activity.isActive
        ).length;

        setStats(prev => ({
          ...prev,
          totalActivities: activitiesData.length,
          totalBookings,
          activeActivities,
        }));
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);

        // Calculate revenue
        const totalRevenue = bookingsData.reduce(
          (sum: number, booking: ProviderBooking) =>
            booking.status === 'CONFIRMED' ? sum + booking.totalAmount : sum,
          0
        );

        setStats(prev => ({
          ...prev,
          totalRevenue,
        }));
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="success">Confirmado</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pendente</Badge>;
      case 'CANCELLED':
        return <Badge variant="error">Cancelado</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Painel de Prestador
              </h1>
              <p className="text-gray-600 mt-1">
                Gere as suas atividades e reservas.
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nova Atividade</span>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {stats.totalActivities}
                  </div>
                  <div className="text-sm text-gray-600">Total Atividades</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {stats.totalBookings}
                  </div>
                  <div className="text-sm text-gray-600">Total Reservas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Euro className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {formatPrice(stats.totalRevenue)}
                  </div>
                  <div className="text-sm text-gray-600">Receita Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {stats.activeActivities}
                  </div>
                  <div className="text-sm text-gray-600">Atividades Ativas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Minhas Atividades
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reservas
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Reservas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.slice(0, 5).length > 0 ? (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map(booking => {
                      const sessionDate = new Date(booking.session.dateTime);
                      return (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {booking.session.activity.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {booking.user.name} • {formatDate(sessionDate)} às{' '}
                              {formatTime(sessionDate)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(booking.status)}
                            <div className="text-right">
                              <div className="font-semibold">
                                {formatPrice(booking.totalAmount)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {booking.participants} participante
                                {booking.participants > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2" />
                    <p>Nenhuma reserva ainda</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Atividades Mais Populares</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities
                      .sort((a, b) => b._count.bookings - a._count.bookings)
                      .slice(0, 5)
                      .map(activity => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {activity.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {activity.category} • {activity.ageGroup}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="font-semibold">
                                {activity._count.bookings} reservas
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatPrice(activity.price)} por sessão
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2" />
                    <p>Nenhuma atividade criada ainda</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Minhas Atividades
              </h2>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nova Atividade</span>
              </Button>
            </div>

            {activities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map(activity => (
                  <Card
                    key={activity.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{activity.ageGroup}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{activity._count.sessions} sessões</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={activity.isActive ? 'success' : 'error'}
                          >
                            {activity.isActive ? 'Ativa' : 'Inativa'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {activity._count.bookings} reservas
                          </span>
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(activity.price)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma atividade criada
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Começa por criar a tua primeira atividade.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Atividade
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Reservas</h2>

            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map(booking => {
                  const sessionDate = new Date(booking.session.dateTime);
                  const isUpcoming = sessionDate > new Date();

                  return (
                    <Card
                      key={booking.id}
                      className={`${!isUpcoming ? 'opacity-75' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {booking.session.activity.title}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>{booking.user.name}</span>
                                  <span>{booking.user.email}</span>
                                  <span>
                                    {formatDate(sessionDate)} às{' '}
                                    {formatTime(sessionDate)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(booking.status)}
                            <div className="text-right">
                              <div className="font-semibold">
                                {formatPrice(booking.totalAmount)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {booking.participants} participante
                                {booking.participants > 1 ? 's' : ''}
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma reserva ainda
                  </h3>
                  <p className="text-gray-600 mb-6">
                    As reservas aparecerão aqui quando os clientes reservarem as
                    suas atividades.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
