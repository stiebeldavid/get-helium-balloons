import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Store } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface LocationMapProps {
  stores: Store[];
  center: [number, number];
}

const LocationMap = ({ stores, center }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  useEffect(() => {
    const getMapboxToken = async () => {
      const { data: { MAPBOX_TOKEN }, error } = await supabase.functions.invoke('get-secret', {
        body: { secretName: 'MAPBOX_TOKEN' }
      });

      if (!error && MAPBOX_TOKEN) {
        setMapboxToken(MAPBOX_TOKEN);
      }
    };

    getMapboxToken();
  }, []);

  // Cleanup function to remove markers
  const removeMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: 11
      });
    } else {
      map.current.setCenter(center);
    }

    // Remove existing markers before adding new ones
    removeMarkers();

    // Add new markers
    stores.forEach((store) => {
      const marker = new mapboxgl.Marker({ color: '#FF4D6D' })
        .setLngLat([store.longitude, store.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <h3 class="font-bold">${store.name}</h3>
          <p>${store.address}</p>
        `))
        .addTo(map.current!);
      
      markers.current.push(marker);
    });

    return () => {
      removeMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [stores, center, mapboxToken]);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default LocationMap;