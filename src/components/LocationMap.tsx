import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Store } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface LocationMapProps {
  stores: Store[];
  center: [number, number];
  selectedStoreId?: string;
}

const LocationMap = ({ stores, center, selectedStoreId }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
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
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};
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
      
      markers.current[store.id] = marker;
    });

    return () => {
      removeMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [stores, center, mapboxToken]);

  // Effect to handle selected store
  useEffect(() => {
    if (!map.current || !selectedStoreId) return;

    const selectedStore = stores.find(store => store.id === selectedStoreId);
    if (!selectedStore) return;

    // Center map on selected store
    map.current.flyTo({
      center: [selectedStore.longitude, selectedStore.latitude],
      zoom: 15,
      duration: 1000
    });

    // Open popup for selected marker
    const marker = markers.current[selectedStoreId];
    if (marker) {
      marker.togglePopup();
    }
  }, [selectedStoreId, stores]);

  return (
    <div className="h-[500px] md:h-[500px] h-[350px] w-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default LocationMap;