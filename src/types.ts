export type LogType = 'info' | 'warning' | 'error' | 'success';

export interface LogEntry {
  id: string;
  timestamp: string;
  event: string;
  type: LogType;
}

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
