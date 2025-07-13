import { cn, formatPrice, formatDate, formatTime, calculateAge } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('base-class', 'additional-class')).toBe('base-class additional-class');
      expect(cn('base-class', undefined, 'additional-class')).toBe('base-class additional-class');
      expect(cn('base-class', null, 'additional-class')).toBe('base-class additional-class');
      expect(cn('base-class', false && 'conditional-class')).toBe('base-class');
      expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class');
    });

    it('should handle duplicate classes', () => {
      expect(cn('p-4 p-6')).toBe('p-6');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });
  });

  describe('formatPrice', () => {
    it('should format price correctly in cents', () => {
      expect(formatPrice(5000)).toBe('50,00 €');
      expect(formatPrice(5099)).toBe('50,99 €');
      expect(formatPrice(100000)).toBe('1.000,00 €');
      expect(formatPrice(100050)).toBe('1.000,50 €');
    });

    it('should handle zero and negative amounts', () => {
      expect(formatPrice(0)).toBe('0,00 €');
      expect(formatPrice(-5000)).toBe('-50,00 €');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      expect(formatDate(date)).toBe('25 de dezembro de 2023');
    });

    it('should handle string dates', () => {
      expect(formatDate('2023-12-25')).toBe('25 de dezembro de 2023');
    });

    it('should handle different months', () => {
      const january = new Date('2023-01-01');
      expect(formatDate(january)).toBe('1 de janeiro de 2023');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      expect(formatTime(date)).toBe('10:30');
    });

    it('should handle string dates', () => {
      expect(formatTime('2023-12-25T14:45:00Z')).toBe('14:45');
    });

    it('should handle different times', () => {
      const morning = new Date('2023-01-01T09:15:00Z');
      expect(formatTime(morning)).toBe('09:15');
    });
  });

  describe('calculateAge', () => {
    it('should calculate age correctly', () => {
      const birthDate = new Date('2010-01-01');
      const today = new Date('2023-01-01');
      
      // Mock today's date
      const mockToday = jest.spyOn(global, 'Date').mockImplementation(() => today as unknown as Date);
      
      expect(calculateAge(birthDate)).toBe(13);
      
      mockToday.mockRestore();
    });

    it('should handle string birth dates', () => {
      const today = new Date('2023-06-15');
      const mockToday = jest.spyOn(global, 'Date').mockImplementation(() => today as unknown as Date);
      
      expect(calculateAge('2010-01-01')).toBe(13);
      
      mockToday.mockRestore();
    });

    it('should handle birthday not yet reached this year', () => {
      const today = new Date('2023-06-15');
      const mockToday = jest.spyOn(global, 'Date').mockImplementation(() => today as unknown as Date);
      
      expect(calculateAge('2010-12-25')).toBe(12); // Birthday hasn't occurred yet
      
      mockToday.mockRestore();
    });

    it('should handle birthday exactly today', () => {
      const today = new Date('2023-06-15');
      const mockToday = jest.spyOn(global, 'Date').mockImplementation(() => today as unknown as Date);
      
      expect(calculateAge('2010-06-15')).toBe(13); // Birthday is today
      
      mockToday.mockRestore();
    });
  });
});