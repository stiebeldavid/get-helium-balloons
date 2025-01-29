import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Store } from '@/types';

interface LocationMapProps {
  stores: Store[];
  center: [number, number];
}

const LocationMap = ({ stores, center }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // We'll need to handle this properly

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 11
    });

    stores.forEach((store) => {
      const marker = new mapboxgl.Marker({ color: '#FF4D6D' })
        .setLngLat([store.longitude, store.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <h3 class="font-bold">${store.name}</h3>
          <p>${store.address}</p>
        `))
        .addTo(map.current!);
    });

    return () => map.current?.remove();
  }, [stores, center]);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default LocationMap;