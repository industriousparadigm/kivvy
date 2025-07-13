import { POST } from '@/app/api/payments/create-intent/route';

// Test that the route handler exists
describe('/api/payments/create-intent', () => {
  describe('POST handler', () => {
    it('should exist', () => {
      expect(POST).toBeDefined();
      expect(typeof POST).toBe('function');
    });
  });
});