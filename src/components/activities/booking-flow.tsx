'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

interface Session {
  id: string;
  dateTime: string;
  availableSpots: number;
  maxParticipants: number;
}

interface Activity {
  id: string;
  title: string;
  price: number;
  maxParticipants: number;
}

interface BookingFlowProps {
  activity: Activity;
  sessions: Session[];
}

export function BookingFlow({ activity, sessions }: BookingFlowProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [participants, setParticipants] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!selectedSession) return;

    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          participants,
        }),
      });

      if (response.ok) {
        const booking = await response.json();
        router.push(`/checkout/${booking.id}`);
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Erro ao criar reserva. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = activity.price * participants;
  const canBook =
    selectedSession && selectedSession.availableSpots >= participants;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Reservar Sessão</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Summary */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(activity.price)}
          </div>
          <div className="text-sm text-gray-600">por participante</div>
        </div>

        {/* Session Selection */}
        <div>
          <h3 className="font-medium mb-3">Escolher Sessão</h3>
          <div className="space-y-2">
            {sessions.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Nenhuma sessão disponível</p>
              </div>
            ) : (
              sessions.map(sessionItem => {
                const sessionDate = new Date(sessionItem.dateTime);
                const isSelected = selectedSession?.id === sessionItem.id;
                const isAvailable = sessionItem.availableSpots > 0;

                return (
                  <button
                    key={sessionItem.id}
                    onClick={() =>
                      isAvailable && setSelectedSession(sessionItem)
                    }
                    disabled={!isAvailable}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : isAvailable
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDate(sessionDate)}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(sessionDate)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {isAvailable ? (
                          <Badge variant="success" size="sm">
                            <Users className="h-3 w-3 mr-1" />
                            {sessionItem.availableSpots} vagas
                          </Badge>
                        ) : (
                          <Badge variant="error" size="sm">
                            Esgotado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Participants */}
        {selectedSession && (
          <div>
            <h3 className="font-medium mb-3">Número de Participantes</h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParticipants(Math.max(1, participants - 1))}
                disabled={participants <= 1}
              >
                -
              </Button>
              <span className="text-lg font-medium px-4">{participants}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setParticipants(
                    Math.min(selectedSession.availableSpots, participants + 1)
                  )
                }
                disabled={participants >= selectedSession.availableSpots}
              >
                +
              </Button>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Máximo: {selectedSession.availableSpots} participantes disponíveis
            </div>
          </div>
        )}

        {/* Total Price */}
        {selectedSession && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span>Subtotal ({participants}x)</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        )}

        {/* Booking Button */}
        <div className="space-y-3">
          {!session ? (
            <Button
              className="w-full"
              onClick={() => router.push('/auth/signin')}
            >
              Entrar para Reservar
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={handleBooking}
              disabled={!canBook || loading}
            >
              {loading
                ? 'A processar...'
                : !selectedSession
                  ? 'Escolher Sessão'
                  : !canBook
                    ? 'Sem vagas suficientes'
                    : `Reservar por ${formatPrice(totalPrice)}`}
            </Button>
          )}

          {canBook && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Confirmação instantânea</span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Cancelamento gratuito até 24h antes</p>
          <p>• Pagamento seguro com Stripe ou MBWay</p>
          <p>• Confirmação instantânea por email</p>
        </div>
      </CardContent>
    </Card>
  );
}
