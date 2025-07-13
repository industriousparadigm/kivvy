import { GET, POST } from '@/app/api/activities/route';

// Test that the route handlers exist
describe('/api/activities', () => {
  describe('GET handler', () => {
    it('should exist', () => {
      expect(GET).toBeDefined();
      expect(typeof GET).toBe('function');
    });
  });

  describe('POST handler', () => {
    it('should exist', () => {
      expect(POST).toBeDefined();
      expect(typeof POST).toBe('function');
    });
  });
});