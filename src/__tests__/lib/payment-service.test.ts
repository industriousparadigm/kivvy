import { PaymentService } from '@/lib/payment-service';

// Mock the dependencies
jest.mock('@/lib/stripe', () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn(),
    },
    refunds: {
      create: jest.fn(),
    },
  },
  calculatePlatformFee: jest.fn().mockReturnValue(100),
  calculateNetAmount: jest.fn().mockReturnValue(4900),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    booking: {
      findUnique: jest.fn(),
    },
    payment: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    activitySession: {
      update: jest.fn(),
    },
  },
}));

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPaymentIntent', () => {
    it('should be a static method', () => {
      expect(typeof PaymentService.createPaymentIntent).toBe('function');
    });

    it('should exist on the PaymentService class', () => {
      expect(PaymentService).toBeDefined();
      expect(PaymentService.createPaymentIntent).toBeDefined();
    });
  });

  describe('handleMBWayPayment', () => {
    it('should be a static method', () => {
      expect(typeof PaymentService.handleMBWayPayment).toBe('function');
    });

    it('should exist on the PaymentService class', () => {
      expect(PaymentService.handleMBWayPayment).toBeDefined();
    });
  });

  describe('confirmPayment', () => {
    it('should be a static method', () => {
      expect(typeof PaymentService.confirmPayment).toBe('function');
    });

    it('should exist on the PaymentService class', () => {
      expect(PaymentService.confirmPayment).toBeDefined();
    });
  });

  describe('refundPayment', () => {
    it('should be a static method', () => {
      expect(typeof PaymentService.refundPayment).toBe('function');
    });

    it('should exist on the PaymentService class', () => {
      expect(PaymentService.refundPayment).toBeDefined();
    });
  });
});