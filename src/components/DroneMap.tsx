import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const droneSvg = `
<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.9));">
    <rect x="10" y="10" width="4" height="4" rx="1" fill="#ef4444" />
    <line x1="14" y1="14" x2="19" y2="19" />
    <line x1="10" y1="10" x2="5" y2="5" />
    <line x1="14" y1="10" x2="19" y2="5" />
    <line x1="10" y1="14" x2="5" y2="19" />
    <circle cx="5" cy="5" r="2.5" />
    <circle cx="19" cy="5" r="2.5" />
    <circle cx="5" cy="19" r="2.5" />
    <circle cx="19" cy="19" r="2.5" />
  </svg>
</div>
`;

const droneIcon = L.divIcon({
  html: droneSvg,
  className: '', // overrides default leaflet square bg
  iconSize: [48, 48],
  iconAnchor: [24, 24],
  popupAnchor: [0, -24]
});

// Component to handle map centering on drone position updates
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

type DroneMapProps = {
  lat: number;
  lng: number;
  altitude: number;
  path: [number, number][];
  initialLat: number;
  initialLng: number;
};

export default function DroneMap({ lat, lng, altitude, path, initialLat, initialLng }: DroneMapProps) {
  return (
    <div className="map-container relative">
      <div className="map-overlay z-[1000]">
        <div className="overlay-metric">
          <span className="overlay-label">LAT</span>
          <span className="overlay-value mono">{lat.toFixed(7)}°</span>
        </div>
        <div className="overlay-metric">
          <span className="overlay-label">LNG</span>
          <span className="overlay-value mono">{lng.toFixed(7)}°</span>
        </div>
        <div className="overlay-metric">
          <span className="overlay-label">ALT</span>
          <span className="overlay-value mono">{altitude.toFixed(2)}m</span>
        </div>
      </div>
      <MapContainer
        center={[lat || initialLat, lng || initialLng]}
        zoom={15}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        zoomControl={false}
      >
        <ChangeView center={[lat, lng]} />
        
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked={true} name="Dark Command">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap contributors &copy; CARTO'
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri'
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Hybrid (Google)">
            <TileLayer
              url="https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              attribution='Map data &copy; Google'
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street Map">
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <Marker position={[lat, lng]} icon={droneIcon}>
          <Popup>
            Drone Position. <br /> Altitude: {altitude}m
          </Popup>
        </Marker>
        <Polyline positions={path} color="var(--accent-blue)" weight={3} opacity={0.7} />
      </MapContainer>
    </div>
  );
}
