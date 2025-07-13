'use client';

import { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearDelay?: number;
}

export function LiveRegion({ 
  message, 
  priority = 'polite', 
  clearDelay = 5000 
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message || !regionRef.current) return;

    // Clear any existing timeout
    const timeoutId = setTimeout(() => {
      if (regionRef.current) {
        regionRef.current.textContent = '';
      }
    }, clearDelay);

    return () => clearTimeout(timeoutId);
  }, [message, clearDelay]);

  return (
    <div
      ref={regionRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Global announcer for the entire app
let globalAnnouncerContainer: HTMLDivElement | null = null;

export function announceToScreenReader(
  message: string, 
  priority: 'polite' | 'assertive' = 'polite'
) {
  if (typeof window === 'undefined') return;

  // Create global announcer if it doesn't exist
  if (!globalAnnouncerContainer) {
    globalAnnouncerContainer = document.createElement('div');
    globalAnnouncerContainer.setAttribute('aria-live', 'polite');
    globalAnnouncerContainer.setAttribute('aria-atomic', 'true');
    globalAnnouncerContainer.className = 'sr-only';
    globalAnnouncerContainer.id = 'global-announcer';
    document.body.appendChild(globalAnnouncerContainer);
  }

  // Update the priority if needed
  globalAnnouncerContainer.setAttribute('aria-live', priority);

  // Clear previous message and set new one
  globalAnnouncerContainer.textContent = '';
  
  // Small delay to ensure screen readers pick up the change
  setTimeout(() => {
    if (globalAnnouncerContainer) {
      globalAnnouncerContainer.textContent = message;
    }
  }, 100);

  // Clear the message after a delay
  setTimeout(() => {
    if (globalAnnouncerContainer) {
      globalAnnouncerContainer.textContent = '';
    }
  }, 5000);
}

// Hook for announcements
export function useAnnouncements() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  };

  const announceError = (message: string) => {
    announce(`Erro: ${message}`, 'assertive');
  };

  const announceSuccess = (message: string) => {
    announce(`Sucesso: ${message}`, 'polite');
  };

  const announceLoading = (message: string = 'A carregar...') => {
    announce(message, 'polite');
  };

  return {
    announce,
    announceError,
    announceSuccess,
    announceLoading,
  };
}