export interface TelemetryData {
  timestamp: string;
  altitude: number;
  speed: number;
  battery: number;
  signal: number | null;
  lat: number;
  lng: number;
  status?: string;
}
