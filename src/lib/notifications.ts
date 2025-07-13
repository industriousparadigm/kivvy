import { logger } from '@/lib/logger';

export interface PushNotificationOptions {
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  url?: string;
  image?: string;
}

class PushNotificationService {
  private vapidKey: string | null = null;
  private vapidSubject: string | null = null;
  
  constructor() {
    this.vapidKey = process.env.VAPID_PRIVATE_KEY || null;
    this.vapidSubject = process.env.VAPID_SUBJECT || null;
    
    if (!this.vapidKey || !this.vapidSubject) {
      logger.warn('Push notifications not configured, will use console logging');
    }
  }
  
  async sendNotification(options: PushNotificationOptions): Promise<void> {
    try {
      if (!this.vapidKey || !this.vapidSubject) {
        // Fallback to console logging for development
        logger.info('Push notification would be sent (service not configured)', {
          userId: options.userId,
          title: options.title,
          message: options.message,
          data: options.data,
        });
        return;
      }
      
      // Get user's push subscriptions from database
      const subscriptions = await this.getUserPushSubscriptions(options.userId);
      
      if (subscriptions.length === 0) {
        logger.info('No push subscriptions found for user', { userId: options.userId });
        return;
      }
      
      const payload = JSON.stringify({
        title: options.title,
        body: options.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        image: options.image,
        data: {
          url: options.url || '/',
          ...options.data,
        },
        actions: [
          {
            action: 'open',
            title: 'Abrir',
          },
          {
            action: 'close',
            title: 'Fechar',
          },
        ],
        requireInteraction: true,
        timestamp: Date.now(),
      });
      
      // Send to all user's subscriptions
      const sendPromises = subscriptions.map(subscription => 
        this.sendToSubscription(subscription, payload)
      );
      
      await Promise.allSettled(sendPromises);
      
      logger.info('Push notifications sent', {
        userId: options.userId,
        subscriptions: subscriptions.length,
        title: options.title,
      });
    } catch (error) {
      logger.error('Failed to send push notification', {
        userId: options.userId,
        error: error.message,
      });
      throw error;
    }
  }
  
  private async getUserPushSubscriptions(userId: string): Promise<any[]> {
    // This would normally fetch from database
    // For now, return empty array as placeholder
    return [];
  }
  
  private async sendToSubscription(subscription: any, payload: string): Promise<void> {
    try {
      // This would use a library like web-push to send notifications
      // For now, just log the attempt
      logger.debug('Sending push notification to subscription', {
        endpoint: subscription.endpoint,
        payload,
      });
    } catch (error) {
      logger.error('Failed to send to subscription', {
        endpoint: subscription.endpoint,
        error: error.message,
      });
      // Don't throw error for individual subscription failures
    }
  }
  
  async sendBookingConfirmation(userId: string, bookingDetails: any): Promise<void> {
    await this.sendNotification({
      userId,
      title: 'Reserva Confirmada!',
      message: `A sua reserva para ${bookingDetails.activityTitle} foi confirmada.`,
      data: {
        type: 'booking-confirmation',
        bookingId: bookingDetails.id,
      },
      url: `/bookings/${bookingDetails.id}`,
    });
  }
  
  async sendBookingReminder(userId: string, bookingDetails: any): Promise<void> {
    await this.sendNotification({
      userId,
      title: 'Lembrete de Atividade',
      message: `${bookingDetails.activityTitle} é amanhã!`,
      data: {
        type: 'booking-reminder',
        bookingId: bookingDetails.id,
      },
      url: `/bookings/${bookingDetails.id}`,
    });
  }
  
  async sendBookingCancellation(userId: string, bookingDetails: any): Promise<void> {
    await this.sendNotification({
      userId,
      title: 'Reserva Cancelada',
      message: `A sua reserva para ${bookingDetails.activityTitle} foi cancelada.`,
      data: {
        type: 'booking-cancellation',
        bookingId: bookingDetails.id,
      },
      url: `/bookings`,
    });
  }
  
  async sendNewActivity(userId: string, activity: any): Promise<void> {
    await this.sendNotification({
      userId,
      title: 'Nova Atividade Disponível!',
      message: `${activity.title} está agora disponível na sua área.`,
      data: {
        type: 'new-activity',
        activityId: activity.id,
      },
      url: `/activities/${activity.id}`,
      image: activity.imageUrl,
    });
  }
  
  async sendPaymentFailed(userId: string, paymentDetails: any): Promise<void> {
    await this.sendNotification({
      userId,
      title: 'Falha no Pagamento',
      message: `Não foi possível processar o pagamento para ${paymentDetails.activityTitle}.`,
      data: {
        type: 'payment-failed',
        bookingId: paymentDetails.bookingId,
      },
      url: `/bookings/${paymentDetails.bookingId}`,
    });
  }
}

export const pushNotificationService = new PushNotificationService();