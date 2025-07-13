'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  address: string;
  className?: string;
  height?: string;
  zoom?: number;
  title?: string;
}

export function GoogleMap({ 
  address, 
  className = '', 
  height = '400px', 
  zoom = 15,
  title = 'Location' 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is not configured');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    loader.load().then(async () => {
      if (!mapRef.current) return;

      // Initialize the map
      const map = new google.maps.Map(mapRef.current, {
        zoom,
        center: { lat: 41.1579, lng: -8.6291 }, // Default to Porto
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#757575' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9e9e9e' }],
          },
        ],
      });

      mapInstance.current = map;

      // Geocode the address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          map.setCenter(location);

          // Add marker
          const marker = new google.maps.Marker({
            position: location,
            map,
            title,
            icon: {
              url: '/images/marker-icon.png',
              scaledSize: new google.maps.Size(40, 40),
            },
          });

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; font-family: sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #1f2937;">${title}</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">${address}</p>
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          // Open info window by default
          infoWindow.open(map, marker);
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
    });

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        // Google Maps doesn't provide a direct cleanup method
        // The map will be cleaned up when the DOM element is removed
        mapInstance.current = null;
      }
    };
  }, [address, zoom, title]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full rounded-lg border border-gray-200 ${className}`}
      style={{ height }}
    />
  );
}

// Alternative component for static maps (faster loading, no API limits)
export function StaticMap({ 
  address, 
  className = '', 
  height = '400px',
  zoom = 15,
  title = 'Location'
}: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div 
        className={`w-full rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <p>Mapa não disponível</p>
          <p className="text-sm">{address}</p>
        </div>
      </div>
    );
  }

  const encodedAddress = encodeURIComponent(address);
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=${zoom}&size=600x400&maptype=roadmap&markers=color:red%7Clabel:A%7C${encodedAddress}&key=${apiKey}`;

  return (
    <div 
      className={`w-full rounded-lg border border-gray-200 overflow-hidden ${className}`}
      style={{ height }}
    >
      <img 
        src={staticMapUrl} 
        alt={`Mapa de ${title}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                <div class="text-center text-gray-500">
                  <p>Mapa não disponível</p>
                  <p class="text-sm">${address}</p>
                </div>
              </div>
            `;
          }
        }}
      />
    </div>
  );
}