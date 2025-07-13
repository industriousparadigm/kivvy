import { logger } from '@/lib/logger';

export interface SMSOptions {
  to: string;
  message: string;
}

class SMSService {
  private apiKey: string | null = null;
  private apiUrl: string | null = null;
  
  constructor() {
    this.apiKey = process.env.SMS_API_KEY || null;
    this.apiUrl = process.env.SMS_API_URL || null;
    
    if (!this.apiKey || !this.apiUrl) {
      logger.warn('SMS service not configured, will use console logging');
    }
  }
  
  async sendSMS(options: SMSOptions): Promise<void> {
    try {
      // Validate phone number format
      const phoneNumber = this.formatPhoneNumber(options.to);
      
      if (!this.apiKey || !this.apiUrl) {
        // Fallback to console logging for development
        logger.info('SMS would be sent (SMS service not configured)', {
          to: phoneNumber,
          message: options.message,
        });
        return;
      }
      
      // Example implementation - replace with actual SMS provider
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: options.message,
          from: process.env.SMS_FROM || 'KidsHiz',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`SMS API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      logger.info('SMS sent successfully', {
        to: phoneNumber,
        messageId: result.messageId,
        cost: result.cost,
      });
    } catch (error) {
      logger.error('Failed to send SMS', {
        to: options.to,
        error: error.message,
      });
      throw error;
    }
  }
  
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (digits.length === 9 && digits.startsWith('9')) {
      return `+351${digits}`;
    }
    
    if (digits.length === 12 && digits.startsWith('351')) {
      return `+${digits}`;
    }
    
    if (digits.length === 13 && digits.startsWith('351')) {
      return `+${digits}`;
    }
    
    return phoneNumber; // Return as-is if format is unclear
  }
  
  async sendBookingConfirmation(to: string, bookingDetails: any): Promise<void> {
    const message = `KidsHiz: Reserva confirmada para ${bookingDetails.activityTitle} em ${bookingDetails.date}. Local: ${bookingDetails.location}`;
    await this.sendSMS({ to, message });
  }
  
  async sendBookingReminder(to: string, bookingDetails: any): Promise<void> {
    const message = `KidsHiz: Lembrete - ${bookingDetails.activityTitle} amanhã às ${bookingDetails.time}. Local: ${bookingDetails.location}`;
    await this.sendSMS({ to, message });
  }
  
  async sendBookingCancellation(to: string, bookingDetails: any): Promise<void> {
    const message = `KidsHiz: Reserva cancelada para ${bookingDetails.activityTitle}. Reembolso será processado em 3-5 dias úteis.`;
    await this.sendSMS({ to, message });
  }
  
  async sendVerificationCode(to: string, code: string): Promise<void> {
    const message = `KidsHiz: O seu código de verificação é ${code}. Válido por 10 minutos.`;
    await this.sendSMS({ to, message });
  }
}

export const smsService = new SMSService();