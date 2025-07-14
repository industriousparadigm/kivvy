import nodemailer from 'nodemailer';
import { logger } from '@/lib/logger';

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context?: Record<string, unknown>;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  
  constructor() {
    this.initializeTransporter();
  }
  
  private initializeTransporter() {
    if (!process.env.SMTP_HOST) {
      logger.warn('SMTP not configured, email service will use console logging');
      return;
    }
    
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const html = this.generateEmailHTML(options.template, options.context);
      
      if (!this.transporter) {
        // Fallback to console logging for development
        logger.info('Email would be sent (SMTP not configured)', {
          to: options.to,
          subject: options.subject,
          template: options.template,
          html,
        });
        return;
      }
      
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html,
      });
      
      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        template: options.template,
      });
    } catch (error) {
      logger.error('Failed to send email', {
        to: options.to,
        subject: options.subject,
        error: error.message,
      });
      throw error;
    }
  }
  
  private generateEmailHTML(template: string, context: Record<string, unknown> = {}): string {
    // Simple template engine - in production, use a proper template engine like Handlebars
    const templates: Record<string, string> = {
      'booking-confirmation': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Reserva Confirmada!</h2>
          <p>Olá ${context.userName},</p>
          <p>A sua reserva para <strong>${context.activityTitle}</strong> foi confirmada com sucesso.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detalhes da Reserva</h3>
            <p><strong>Atividade:</strong> ${context.activityTitle}</p>
            <p><strong>Data:</strong> ${context.sessionDate}</p>
            <p><strong>Local:</strong> ${context.location}</p>
            <p><strong>Participantes:</strong> ${context.participants}</p>
            <p><strong>Total:</strong> ${context.totalAmount}</p>
          </div>
          <p>Obrigado por escolher o Kivvy!</p>
        </div>
      `,
      'booking-reminder': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Lembrete: Atividade Amanhã</h2>
          <p>Olá ${context.userName},</p>
          <p>Este é um lembrete de que tem uma atividade marcada para amanhã:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${context.activityTitle}</h3>
            <p><strong>Data:</strong> ${context.sessionDate}</p>
            <p><strong>Local:</strong> ${context.location}</p>
          </div>
          <p>Esperamos vê-lo em breve!</p>
        </div>
      `,
      'booking-cancellation': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Reserva Cancelada</h2>
          <p>Olá ${context.userName},</p>
          <p>A sua reserva para <strong>${context.activityTitle}</strong> foi cancelada.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detalhes da Reserva Cancelada</h3>
            <p><strong>Atividade:</strong> ${context.activityTitle}</p>
            <p><strong>Data:</strong> ${context.sessionDate}</p>
            <p><strong>Motivo:</strong> ${context.reason || 'Não especificado'}</p>
          </div>
          <p>O reembolso será processado em 3-5 dias úteis.</p>
        </div>
      `,
      'payment-failed': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Falha no Pagamento</h2>
          <p>Olá ${context.userName},</p>
          <p>Não foi possível processar o pagamento para a sua reserva de <strong>${context.activityTitle}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Erro:</strong> ${context.error}</p>
            <p><strong>Valor:</strong> ${context.amount}</p>
          </div>
          <p>Por favor, tente novamente ou contacte-nos para assistência.</p>
        </div>
      `,
      'welcome': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F43F5E;">Bem-vindo ao Kivvy!</h2>
          <p>Olá ${context.userName},</p>
          <p>Bem-vindo à plataforma Kivvy! Estamos entusiasmados por ter você connosco.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">O que pode fazer agora:</h3>
            <ul>
              <li>Explorar atividades para crianças na sua área</li>
              <li>Fazer reservas de forma rápida e segura</li>
              <li>Gerir as suas reservas no painel de controlo</li>
              <li>Avaliar e comentar as atividades</li>
            </ul>
          </div>
          <p>Comece a explorar e encontre a atividade perfeita para os seus filhos!</p>
        </div>
      `,
    };
    
    return templates[template] || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Notificação Kivvy</h2>
        <p>Olá,</p>
        <p>Tem uma nova notificação da plataforma Kivvy.</p>
        <pre>${JSON.stringify(context, null, 2)}</pre>
      </div>
    `;
  }
}

export const emailService = new EmailService();