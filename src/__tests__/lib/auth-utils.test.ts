import { hasRole, isProvider, isParent, isAdmin } from '@/lib/auth-utils';
import { Role } from '@prisma/client';

describe('auth-utils', () => {
  describe('hasRole', () => {
    it('should check single role correctly', () => {
      expect(hasRole('PARENT' as Role, 'PARENT' as Role)).toBe(true);
      expect(hasRole('PROVIDER' as Role, 'PARENT' as Role)).toBe(false);
      expect(hasRole('ADMIN' as Role, 'ADMIN' as Role)).toBe(true);
    });

    it('should check multiple roles correctly', () => {
      expect(hasRole('PARENT' as Role, ['PARENT', 'ADMIN'] as Role[])).toBe(true);
      expect(hasRole('PROVIDER' as Role, ['PARENT', 'ADMIN'] as Role[])).toBe(false);
      expect(hasRole('ADMIN' as Role, ['PROVIDER', 'ADMIN'] as Role[])).toBe(true);
    });
  });

  describe('isProvider', () => {
    it('should identify provider role', () => {
      expect(isProvider('PROVIDER' as Role)).toBe(true);
      expect(isProvider('ADMIN' as Role)).toBe(true); // Admin can act as provider
      expect(isProvider('PARENT' as Role)).toBe(false);
    });
  });

  describe('isParent', () => {
    it('should identify parent role', () => {
      expect(isParent('PARENT' as Role)).toBe(true);
      expect(isParent('PROVIDER' as Role)).toBe(false);
      expect(isParent('ADMIN' as Role)).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should identify admin role', () => {
      expect(isAdmin('ADMIN' as Role)).toBe(true);
      expect(isAdmin('PARENT' as Role)).toBe(false);
      expect(isAdmin('PROVIDER' as Role)).toBe(false);
    });
  });
});