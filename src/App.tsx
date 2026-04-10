import { useState, useEffect, useRef } from 'react';
import './index.css';

import type { TelemetryData } from './types';
import Header from './components/Header';
import DroneMap from './components/DroneMap';
import TelemetryCharts from './components/TelemetryCharts';
import StatusWidgets from './components/StatusWidgets';
import Login from './components/Login';

// Utility to check if JWT is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true; // Assume expired/invalid if parsing fails
  }
}

const INITIAL_LAT = 5.6037; // Accra, Ghana
const INITIAL_LNG = -0.1870;

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('tb_token') || import.meta.env.VITE_DASHBOARD_JWT_TOKEN?.replace('Bearer ', '') || null
  );
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'initializing' | 'connecting' | 'connected' | 'error' | 'missing_config'
  >('initializing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const restUrl = import.meta.env.VITE_THINGSBOARD_REST_URL || 'https://thingsboard.cloud';
  const deviceId = import.meta.env.VITE_DRONE_DEVICE_ID;
  const wsUrlBase = import.meta.env.VITE_THINGSBOARD_WS_URL;

  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [path, setPath] = useState<[number, number][]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('tb_token', newToken);
    setToken(newToken);
    setConnectionStatus('initializing');
    setErrorMessage('');
  };

  // Live ThingsBoard Integration
  useEffect(() => {
    if (!token) return;

    if (!wsUrlBase || !deviceId) {
      console.warn('Missing environment variables (WS URL or Device ID).');
      setConnectionStatus('missing_config');
      return;
    }

    // Check for expiration
    if (isTokenExpired(token)) {
      console.error('ThingsBoard JWT Token has expired.');
      setConnectionStatus('error');
      setErrorMessage('Your ThingsBoard session has expired. Please log in again.');
      setToken(null);
      localStorage.removeItem('tb_token');
      return;
    }

    setConnectionStatus('connecting');
    const ws = new WebSocket(`${wsUrlBase}?token=${token.replace('Bearer ', '')}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Connected to ThingsBoard WebSocket!');
      setConnectionStatus('connected');
      const cmds = {
        tsSubCmds: [
          {
            entityType: 'DEVICE',
            entityId: deviceId,
            scope: 'LATEST_TELEMETRY',
            cmdId: 10,
          },
        ],
        historyCmds: [],
        attrSubCmds: [],
      };
      ws.send(JSON.stringify(cmds));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.subscriptionId === 10 && message.data) {
          const newData = message.data;

          setTelemetry((prev) => {
            const base = prev || {
              timestamp: '',
              altitude: 0,
              speed: 0,
              battery: 0,
              signal: null,
              lat: INITIAL_LAT,
              lng: INITIAL_LNG,
            };

            const nextData: TelemetryData = { ...base, timestamp: new Date().toLocaleTimeString() };

            // Extract latest values (TB sends arrays of [timestamp, value])
            if (newData.latitude) nextData.lat = parseFloat(newData.latitude[0][1]);
            if (newData.longitude) nextData.lng = parseFloat(newData.longitude[0][1]);
            if (newData.altitude) nextData.altitude = parseFloat(newData.altitude[0][1]);
            if (newData.speed) nextData.speed = parseFloat(newData.speed[0][1]);
            if (newData.battery) nextData.battery = parseFloat(newData.battery[0][1]);
            if (newData.signal !== undefined) nextData.signal = parseFloat(newData.signal[0][1]);
            if (newData.status) nextData.status = newData.status[0][1];

            setHistory((curr) => {
              const newHistory = [...curr, nextData];
              if (newHistory.length > 50) newHistory.shift();
              return newHistory;
            });

            if (newData.latitude || newData.longitude) {
              setPath((curr) => {
                const newPath = [...curr, [nextData.lat, nextData.lng] as [number, number]];
                if (newPath.length > 300) newPath.shift();
                return newPath;
              });
            }

            return nextData;
          });
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = () => {
      setConnectionStatus('error');
      setErrorMessage('WebSocket connection failed. This usually happens due to network issues or an invalid token.');
    };

    ws.onclose = (event) => {
      console.log('TB WebSocket Closed.', event.code, event.reason);
      if (event.code !== 1000) {
        setConnectionStatus('error');
        setErrorMessage('Connection lost. Please check your internet or ThingsBoard server status.');
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [token, wsUrlBase, deviceId]);

  if (!token) {
    return <Login onLogin={handleLogin} restUrl={restUrl} />;
  }

  return (
    <div className="dashboard-container">
      <Header connectionStatus={connectionStatus} droneStatus={telemetry?.status} />

      {!telemetry || connectionStatus !== 'connected' ? (
        <div className="connection-overlay">
          <div className="status-box">
            {connectionStatus !== 'error' && <div className="spinner" />}
            {connectionStatus === 'error' && (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--status-critical)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <h3>
              {connectionStatus === 'initializing' && 'Initializing System...'}
              {connectionStatus === 'connecting' && 'Connecting to ThingsBoard...'}
              {connectionStatus === 'connected' && !telemetry && 'Waiting for Drone Telemetry...'}
              {connectionStatus === 'error' && 'Connection Error'}
              {connectionStatus === 'missing_config' && 'Configuration Missing'}
            </h3>
            {errorMessage && <p className="error-text">{errorMessage}</p>}
            {connectionStatus === 'error' && (
              <button
                className="login-btn"
                style={{ marginTop: 0, padding: '0 2rem', height: '44px', fontSize: '0.875rem' }}
                onClick={() => {
                  setToken(null);
                  localStorage.removeItem('tb_token');
                }}
              >
                Sign In Again
              </button>
            )}
            {connectionStatus === 'missing_config' && (
              <p className="hint-text">Please check your .env file for TB credentials.</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <main className="main-view">
            <DroneMap
              lat={telemetry.lat}
              lng={telemetry.lng}
              altitude={telemetry.altitude}
              path={path}
              initialLat={INITIAL_LAT}
              initialLng={INITIAL_LNG}
            />
            <TelemetryCharts history={history} />
          </main>
          <StatusWidgets telemetry={telemetry} />
        </>
      )}
    </div>
  );
}

export default App;
