import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const droneIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
    <div className="map-container">
      <div className="map-overlay">
        <div className="overlay-metric">
          <span className="overlay-label">LAT</span>
          <span className="overlay-value mono">{lat.toFixed(5)}°</span>
        </div>
        <div className="overlay-metric">
          <span className="overlay-label">LNG</span>
          <span className="overlay-value mono">{lng.toFixed(5)}°</span>
        </div>
        <div className="overlay-metric">
          <span className="overlay-label">ALT</span>
          <span className="overlay-value mono">{altitude.toFixed(1)}m</span>
        </div>
      </div>
      <MapContainer
        center={[lat || initialLat, lng || initialLng]}
        zoom={15}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        zoomControl={false}
      >
        <ChangeView center={[lat, lng]} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />
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
