'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Download,
  Mail,
  Smartphone,
  Clock,
} from 'lucide-react';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

interface BookingConfirmationProps {
  params: {
    bookingId: string;
  };
}

interface Booking {
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
      description: string;
      location: string;
      price: number;
      duration: number;
      requirements?: string;
      provider: {
        name: string;
        email?: string;
        phone?: string;
      };
    };
  };
  payment?: {
    method: string;
    status: string;
    transactionId: string;
  };
}

export default function BookingConfirmationPage({
  params,
}: BookingConfirmationProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, params.bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${params.bookingId}`);
      if (!response.ok) throw new Error('Failed to fetch booking');

      const bookingData = await response.json();
      setBooking(bookingData);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">
                Reserva não encontrada
              </h2>
              <p className="text-gray-600 mb-4">
                Não conseguimos encontrar esta reserva.
              </p>
              <Link href="/">
                <Button>Voltar ao Início</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const sessionDate = new Date(booking.session.dateTime);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reserva Confirmada!
          </h1>
          <p className="text-gray-600">
            A tua reserva foi confirmada com sucesso. Vais receber um email de
            confirmação em breve.
          </p>
        </div>

        <div className="space-y-6">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Detalhes da Reserva</span>
                <Badge variant="success">Confirmado</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {booking.session.activity.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {booking.session.activity.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(sessionDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{formatTime(sessionDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{booking.session.activity.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>
                    {booking.participants} participante
                    {booking.participants > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal</span>
                  <span>{formatPrice(booking.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total Pago</span>
                  <span className="text-green-600">
                    {formatPrice(booking.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <div className="font-medium mb-1">ID da Reserva</div>
                <div className="font-mono text-gray-700">{booking.id}</div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Prestador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-medium">
                    {booking.session.activity.provider.name}
                  </div>
                </div>
                {booking.session.activity.provider.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{booking.session.activity.provider.email}</span>
                  </div>
                )}
                {booking.session.activity.provider.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Smartphone className="h-4 w-4" />
                    <span>{booking.session.activity.provider.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {booking.session.activity.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Requisitos Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {booking.session.activity.requirements}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          {booking.payment && (
            <Card>
              <CardHeader>
                <CardTitle>Informações de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Método</span>
                  <span className="capitalize">{booking.payment.method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estado</span>
                  <Badge variant="success" size="sm">
                    {booking.payment.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ID da Transação</span>
                  <span className="font-mono">
                    {booking.payment.transactionId}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Descarregar Recibo
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Reenviar Email
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full">
                  Ver Minhas Reservas
                </Button>
              </Link>
              <Link href="/activities" className="w-full">
                <Button className="w-full">Explorar Mais Atividades</Button>
              </Link>
            </div>
          </div>

          {/* Next Steps */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700 space-y-2">
              <p>
                • Vais receber um email de confirmação com todos os detalhes
              </p>
              <p>• O prestador pode contactar-te com informações adicionais</p>
              <p>• Podes cancelar gratuitamente até 24h antes da sessão</p>
              <p>• Em caso de dúvidas, contacta o nosso suporte</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
