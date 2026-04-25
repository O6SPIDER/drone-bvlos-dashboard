import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

import type { TelemetryData, LogEntry, LogType } from './types';
import Header from './components/Header';
import DroneMap from './components/DroneMap';
import TelemetryCharts from './components/TelemetryCharts';
import StatusWidgets from './components/StatusWidgets';
import Login from './components/Login';
import ConnectionScreen from './components/ConnectionScreen';
import SecureLogoutControl from './components/SecureLogoutControl';
import Logs from './components/Logs';


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
  const [activeView, setActiveView] = useState<'dashboard' | 'logs'>('dashboard');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((event: string, type: LogType = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleTimeString(),
      event,
      type
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const restUrl = import.meta.env.VITE_THINGSBOARD_REST_URL || 'https://thingsboard.cloud';
  const deviceId = import.meta.env.VITE_DRONE_DEVICE_ID;
  const wsUrlBase = import.meta.env.VITE_THINGSBOARD_WS_URL;

  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [path, setPath] = useState<[number, number][]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const lastStatusRef = useRef<string | undefined>(undefined);

  // Initial startup log
  useEffect(() => {
    addLog('BVLOS Control System initialized', 'info');
  }, [addLog]);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('tb_token', newToken);
    setToken(newToken);
    setConnectionStatus('initializing');
    setErrorMessage('');
    addLog('User authenticated. Establishing secure link...', 'success');
  };

  const handleLogout = () => {
    addLog('System disconnect initiated by user', 'warning');
    setToken(null);
    localStorage.removeItem('tb_token');
    if (wsRef.current) wsRef.current.close();
  };

  // Live ThingsBoard Integration
  useEffect(() => {
    if (!token) return;

    if (!wsUrlBase || !deviceId) {
      console.warn('Missing environment variables (WS URL or Device ID).');
      setConnectionStatus('missing_config');
      addLog('Missing configuration: WS URL or Device ID', 'error');
      return;
    }

    // Check for expiration
    if (isTokenExpired(token)) {
      console.error('ThingsBoard JWT Token has expired.');
      setConnectionStatus('error');
      setErrorMessage('Your ThingsBoard session has expired. Please log in again.');
      addLog('Session expired. Authentication required.', 'error');
      setToken(null);
      localStorage.removeItem('tb_token');
      return;
    }

    setConnectionStatus('connecting');
    addLog('Connecting to ThingsBoard Gateway...', 'info');
    const ws = new WebSocket(`${wsUrlBase}?token=${token.replace('Bearer ', '')}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Connected to ThingsBoard WebSocket!');
      setConnectionStatus('connected');
      addLog('Relay link established. Receiving telemetry...', 'success');
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

            // Extract latest values supporting both short and long keys
            const latVal = newData.lat || newData.latitude;
            const lngVal = newData.lon || newData.longitude;
            const altVal = newData.alt || newData.altitude;
            const spdVal = newData.groundspeed || newData.speed;
            const batVal = newData.battery;
            const sigVal = newData.rssi || newData.signal;

            if (latVal) nextData.lat = parseFloat(latVal[0][1]);
            if (lngVal) nextData.lng = parseFloat(lngVal[0][1]);
            if (altVal) nextData.altitude = parseFloat(altVal[0][1]);
            if (spdVal) nextData.speed = parseFloat(spdVal[0][1]);
            if (batVal) nextData.battery = parseFloat(batVal[0][1]);
            if (sigVal !== undefined) nextData.signal = parseFloat(sigVal[0][1]);
            if (newData.status) nextData.status = newData.status[0][1];

            // Log status changes
            if (nextData.status && nextData.status !== lastStatusRef.current) {
              addLog(`UAV Status changed to: ${nextData.status.toUpperCase()}`,
                nextData.status.toLowerCase() === 'error' ? 'error' : 'info');
              lastStatusRef.current = nextData.status;
            }

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
      addLog('Link failure: WebSocket error detected', 'error');
    };

    ws.onclose = (event) => {
      console.log('TB WebSocket Closed.', event.code, event.reason);
      if (event.code !== 1000) {
        setConnectionStatus('error');
        setErrorMessage('Connection lost. Please check your internet or ThingsBoard server status.');
        addLog(`Link lost: ${event.reason || 'Unknown cause'}`, 'error');
      } else {
        addLog('Link closed gracefully', 'info');
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [token, wsUrlBase, deviceId, addLog]);

  if (!token) {
    return <Login onLogin={handleLogin} restUrl={restUrl} />;
  }

  return (
    <div
      className="grid grid-cols-1 xl:grid-cols-[1fr_340px] grid-rows-[auto_1fr] gap-6 max-w-[1600px] mx-auto w-full"
      style={{ height: 'calc(100vh - 3rem)', overflow: 'hidden', display: 'grid' }}
    >
      <Header
        connectionStatus={connectionStatus}
        droneStatus={telemetry?.status}
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={handleLogout}
      />

      {activeView === 'logs' ? (
        <div className="xl:col-span-2" style={{ overflow: 'hidden', height: '100%' }}>
          <Logs logs={logs} />
        </div>
      ) : !telemetry || connectionStatus !== 'connected' ? (
        <ConnectionScreen
          connectionStatus={connectionStatus}
          errorMessage={errorMessage}
          onReset={() => {
            setToken(null);
            localStorage.removeItem('tb_token');
          }}
        />
      ) : (
        <div
          className="custom-scrollbar"
          style={{
            gridColumn: '1 / -1',
            overflowY: 'auto',
            paddingRight: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 w-full">
            <main className="flex flex-col gap-6 animate-slide-up">
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
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <StatusWidgets telemetry={telemetry} />
            </div>
          </div>

          <SecureLogoutControl
            onLogout={handleLogout}
          />
        </div>
      )}
    </div>
  );
}

export default App;
