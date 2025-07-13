'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

export function LazyWrapper({
  children,
  fallback = <div className="animate-pulse bg-gray-200 rounded min-h-[200px]" />,
  className,
  rootMargin = '50px',
  threshold = 0.1,
  once = true,
}: LazyWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        
        if (visible && once) {
          setHasBeenVisible(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, once]);

  const shouldRender = once ? hasBeenVisible || isVisible : isVisible;

  return (
    <div ref={elementRef} className={cn('min-h-[1px]', className)}>
      {shouldRender ? children : fallback}
    </div>
  );
}

// Specialized lazy loading for images
export function LazyImage({
  src,
  alt,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <LazyWrapper
      fallback={
        <div className={cn('animate-pulse bg-gray-200 rounded', className)} />
      }
      rootMargin="100px"
    >
      <img
        src={src}
        alt={alt}
        className={cn('transition-opacity duration-300', className)}
        loading="lazy"
        {...props}
      />
    </LazyWrapper>
  );
}

// Lazy loading for components that might be expensive to render
export function LazyComponent({
  children,
  placeholder,
  delay = 0,
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  delay?: number;
}) {
  const [shouldRender, setShouldRender] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  return (
    <LazyWrapper fallback={placeholder}>
      {shouldRender ? children : placeholder}
    </LazyWrapper>
  );
}