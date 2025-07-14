'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Smartphone,
  Lock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Users,
} from 'lucide-react';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

interface CheckoutPageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

interface Booking {
  id: string;
  status: string;
  totalAmount: number;
  participants: number;
  session: {
    id: string;
    dateTime: string;
    activity: {
      title: string;
      description: string;
      location: string;
      price: number;
      provider: {
        name: string;
      };
    };
  };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mbway'>(
    'stripe'
  );
  const [mbwayPhone, setMbwayPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, resolvedParams.bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${resolvedParams.bookingId}`);
      if (!response.ok) {
        if (response.status === 404) {
          notFound();
        }
        throw new Error('Failed to fetch booking');
      }
      const bookingData = await response.json();
      setBooking(bookingData);
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Erro ao carregar reserva');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;

    setProcessing(true);
    setError('');

    try {
      if (paymentMethod === 'stripe') {
        // Create Stripe payment intent
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: booking.id,
            amount: booking.totalAmount,
          }),
        });

        if (!response.ok) throw new Error('Failed to create payment intent');

        await response.json();

        // In a real app, you'd use Stripe Elements here
        // For now, we'll simulate successful payment
        setTimeout(() => {
          router.push(`/booking-confirmation/${booking.id}`);
        }, 2000);
      } else if (paymentMethod === 'mbway') {
        if (!mbwayPhone || mbwayPhone.length < 9) {
          setError('Número de telefone inválido');
          return;
        }

        const response = await fetch('/api/payments/mbway', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: booking.id,
            phoneNumber: mbwayPhone,
            amount: booking.totalAmount,
          }),
        });

        if (!response.ok) throw new Error('Failed to process MBWay payment');

        const result = await response.json();

        if (result.success) {
          router.push(`/booking-confirmation/${booking.id}`);
        } else {
          setError('Pagamento MBWay falhado. Verifica os dados.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Erro no pagamento. Tenta novamente.');
    } finally {
      setProcessing(false);
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
            <div className="h-48 bg-gray-200 rounded"></div>
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
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Reserva não encontrada
              </h2>
              <p className="text-gray-600">
                Não conseguimos encontrar esta reserva.
              </p>
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalizar Reserva
          </h1>
          <p className="text-gray-600">
            Quase lá! Escolhe o método de pagamento para confirmar a tua
            reserva.
          </p>
        </div>

        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {booking.session.activity.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {booking.session.activity.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {formatDate(sessionDate)} às {formatTime(sessionDate)}
                  </span>
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
                <div className="text-right md:col-start-2">
                  <Badge variant="success">Confirmado</Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(booking.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stripe Option */}
              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={e => setPaymentMethod(e.target.value as 'stripe')}
                  className="text-blue-600"
                />
                <CreditCard className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Cartão de Crédito/Débito</div>
                  <div className="text-sm text-gray-600">
                    Visa, Mastercard, American Express
                  </div>
                </div>
              </label>

              {/* MBWay Option */}
              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mbway"
                  checked={paymentMethod === 'mbway'}
                  onChange={e => setPaymentMethod(e.target.value as 'mbway')}
                  className="text-blue-600"
                />
                <Smartphone className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">MBWay</div>
                  <div className="text-sm text-gray-600">
                    Pagamento instantâneo com o teu telemóvel
                  </div>
                </div>
              </label>

              {/* MBWay Phone Input */}
              {paymentMethod === 'mbway' && (
                <div className="ml-8 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Número de Telefone
                  </label>
                  <Input
                    type="tel"
                    placeholder="9XXXXXXXX"
                    value={mbwayPhone}
                    onChange={e => setMbwayPhone(e.target.value)}
                    className="max-w-xs"
                  />
                  <p className="text-xs text-gray-500">
                    Introduce o número associado ao MBWay
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex items-center space-x-2 py-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </CardContent>
            </Card>
          )}

          {/* Payment Button */}
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={
                processing || (paymentMethod === 'mbway' && !mbwayPhone)
              }
            >
              {processing
                ? 'A processar pagamento...'
                : `Pagar ${formatPrice(booking.totalAmount)}`}
            </Button>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Lock className="h-4 w-4" />
              <span>Pagamento seguro e encriptado</span>
            </div>
          </div>

          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Pagamento Seguro</p>
                  <p>
                    Os teus dados de pagamento são protegidos com encriptação
                    SSL de 256 bits. Não armazenamos informações do cartão.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
