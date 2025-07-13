'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Heart,
  CreditCard,
  Settings,
  User,
  Plus,
  Filter,
  Search,
} from 'lucide-react';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface Booking {
  id: string;
  status: string;
  totalAmount: number;
  quantity: number;
  createdAt: string;
  session: {
    id: string;
    startTime: string;
    endTime?: string;
    activity: {
      id: string;
      title: string;
      imageUrl?: string;
      duration: number;
      category: string;
      provider: {
        id: string;
        businessName: string;
        address: string;
        city: string;
      };
    };
  };
  child: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  allergies?: string;
  medicalNotes?: string;
  emergencyContact?: string;
  _count?: {
    bookings: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'bookings' | 'children' | 'favorites'
  >('bookings');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, childrenRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/users/children'),
      ]);

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }

      if (childrenRes.ok) {
        const childrenData = await childrenRes.json();
        setChildren(childrenData || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus =
      statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch =
      booking.session.activity.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.session.activity.provider.businessName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const upcomingBookings = filteredBookings.filter(
    booking => new Date(booking.session.startTime) > new Date()
  );

  const pastBookings = filteredBookings.filter(
    booking => new Date(booking.session.startTime) <= new Date()
  );

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-rose-900">
                Olá, {session?.user?.name || 'querida'}!
              </h1>
              <p className="text-rose-700 mt-1">
                As memórias mais preciosas começam aqui.
              </p>
            </div>
            <Link href="/activities">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nova Reserva</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-rose-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {upcomingBookings.length}
                  </div>
                  <div className="text-sm text-rose-700">Próximas Reservas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="text-2xl font-bold">{children.length}</div>
                  <div className="text-sm text-rose-700">Filhos Registados</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-rose-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {formatPrice(
                      bookings.reduce((sum, b) => sum + b.totalAmount, 0)
                    )}
                  </div>
                  <div className="text-sm text-rose-700">Total Gasto</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-rose-700">Favoritos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-rose-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-rose-500 text-rose-700'
                  : 'border-transparent text-rose-500 hover:text-rose-700 hover:border-rose-300'
              }`}
            >
              Minhas Reservas
            </button>
            <button
              onClick={() => setActiveTab('children')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'children'
                  ? 'border-rose-500 text-rose-700'
                  : 'border-transparent text-rose-500 hover:text-rose-700 hover:border-rose-300'
              }`}
            >
              Meus Filhos
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'favorites'
                  ? 'border-rose-500 text-rose-700'
                  : 'border-transparent text-rose-500 hover:text-rose-700 hover:border-rose-300'
              }`}
            >
              Favoritos
            </button>
          </nav>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-rose-400" />
                <Input
                  placeholder="Procurar por atividade ou prestador..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-rose-500" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="border border-rose-300 rounded-2xl px-3 py-2 text-sm bg-white/80 backdrop-blur-sm"
                >
                  <option value="all">Todos os Estados</option>
                  <option value="CONFIRMED">Confirmado</option>
                  <option value="PENDING">Pendente</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-light text-rose-900 mb-4">
                  Próximas Reservas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingBookings.map(booking => {
                    const sessionDate = new Date(booking.session.startTime);
                    return (
                      <Card
                        key={booking.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-rose-900 mb-1">
                                {booking.session.activity.title}
                              </h3>
                              <p className="text-sm text-rose-700 line-clamp-2">
                                Para {booking.child.firstName}{' '}
                                {booking.child.lastName}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="space-y-2 text-sm text-rose-700">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(sessionDate)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(sessionDate)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {booking.session.activity.provider.address},{' '}
                                {booking.session.activity.provider.city}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {booking.quantity} participante
                                {booking.quantity > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-lg font-bold text-amber-700">
                              {formatPrice(booking.totalAmount)}
                            </div>
                            <Link
                              href={`/activities/${booking.session.activity.id}`}
                            >
                              <Button size="sm" variant="outline">
                                Ver Detalhes
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-light text-rose-900 mb-4">
                  Reservas Anteriores
                </h2>
                <div className="space-y-3">
                  {pastBookings.map(booking => {
                    const sessionDate = new Date(booking.session.startTime);
                    return (
                      <Card key={booking.id} className="opacity-75">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <h3 className="font-medium text-rose-900">
                                    {booking.session.activity.title}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-rose-700">
                                    <span>
                                      {formatDate(sessionDate)} às{' '}
                                      {formatTime(sessionDate)}
                                    </span>
                                    <span>
                                      {
                                        booking.session.activity.provider
                                          .address
                                      }
                                      , {booking.session.activity.provider.city}
                                    </span>
                                    <span>
                                      {booking.quantity} participante
                                      {booking.quantity > 1 ? 's' : ''}
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
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredBookings.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-rose-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-rose-900 mb-2">
                    Nenhuma reserva encontrada
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Tenta ajustar os filtros ou fazer uma nova pesquisa.'
                      : 'Ainda não fizeste nenhuma reserva. Explora as nossas atividades!'}
                  </p>
                  <Link href="/activities">
                    <Button>Explorar Atividades</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Children Tab */}
        {activeTab === 'children' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-light text-rose-900">Meus Filhos</h2>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Adicionar Filho</span>
              </Button>
            </div>

            {children.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {children.map(child => {
                  const age = Math.floor(
                    (new Date().getTime() -
                      new Date(child.dateOfBirth).getTime()) /
                      (1000 * 60 * 60 * 24 * 365.25)
                  );
                  return (
                    <Card
                      key={child.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-rose-900">
                              {child.firstName} {child.lastName}
                            </h3>
                            <p className="text-sm text-rose-700">{age} anos</p>
                          </div>
                        </div>

                        {child.medicalNotes && (
                          <p className="text-sm text-rose-700 mb-4">
                            {child.medicalNotes}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-rose-600">
                            Nascido em {formatDate(child.dateOfBirth)}
                          </span>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-rose-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-rose-900 mb-2">
                    Nenhum filho registado
                  </h3>
                  <p className="text-rose-700 mb-6">
                    Adiciona informações sobre os teus filhos para personalizar
                    as recomendações.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Filho
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <h2 className="text-xl font-light text-rose-900">
              Atividades Favoritas
            </h2>

            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-rose-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-rose-900 mb-2">
                  Nenhuma atividade favorita
                </h3>
                <p className="text-rose-700 mb-6">
                  Marca as tuas atividades favoritas para acesso rápido.
                </p>
                <Link href="/activities">
                  <Button>Explorar Atividades</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
