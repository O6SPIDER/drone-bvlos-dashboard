import type { TelemetryData } from '../types';

type Props = {
  telemetry: TelemetryData;
};

// -------- Battery Widget --------
function BatteryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
      <line x1="22" y1="11" x2="22" y2="13" />
    </svg>
  );
}

// -------- Speed Widget --------
function SpeedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 12l4 -4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </svg>
  );
}

// -------- Altitude Widget --------
function AltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="17 11 12 6 7 11" />
      <polyline points="17 18 12 13 7 18" />
    </svg>
  );
}

// -------- Signal Widget --------
function SignalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5.636 5.636a9 9 0 1 0 12.728 0" />
      <path d="M8.879 8.879a5 5 0 1 0 6.242 0" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

// Battery status helper
function getBatteryStatus(v: number): string {
  if (v >= 15.5) return 'good';
  if (v >= 14.0) return 'warn';
  return 'critical';
}

// Signal handling with universal detection (RSSI dBm or percentage)
function getSignalStatus(v: number | null): string {
  if (v === null || v === 0) return 'brand';
  if (v < 0) {
    // dBm mode: -50 to -110
    if (v >= -65) return 'good';
    if (v >= -80) return 'warn';
    return 'critical';
  }
  // Percentage mode: 0-100
  if (v >= 60) return 'good';
  if (v >= 30) return 'warn';
  return 'critical';
}

function getSignalPercent(v: number | null): number {
  if (v === null || v === 0) return 0;
  if (v < 0) {
    // dBm to percent: -50 = 100%, -110 = 0%
    return Math.max(0, Math.min(100, ((v + 110) / 60) * 100));
  }
  // Already a percentage (0-100)
  return Math.max(0, Math.min(100, v));
}

function getSignalLabel(v: number | null): string {
  if (v === null || v === 0) return 'SEARCHING...';
  if (v < 0) return `${v} dBm`;
  return `${v}%`;
}

export default function StatusWidgets({ telemetry }: Props) {
  const { altitude, speed, battery, signal } = telemetry;
  const batteryStatus = getBatteryStatus(battery);
  const signalStatus = signal !== null ? getSignalStatus(signal) : 'brand';

  return (
    <aside className="sidebar">
      {/* Battery */}
      <div className={`widget-card ${batteryStatus}`}>
        <div className="widget-header">
          <BatteryIcon />
          <span>Battery Voltage</span>
        </div>
        <div className="widget-value-container">
          <span className="widget-value mono">{battery.toFixed(2)}</span>
          <span className="widget-unit">V</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(100, ((battery - 13) / 4) * 100)}%` }}
          />
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {batteryStatus === 'critical' ? '⚠ CRITICAL — Land Now' : batteryStatus === 'warn' ? '⚠ LOW — Return to Base' : '✓ Nominal'}
        </p>
      </div>

      {/* Altitude */}
      <div className="widget-card brand">
        <div className="widget-header">
          <AltIcon />
          <span>Altitude (AGL)</span>
        </div>
        <div className="widget-value-container">
          <span className="widget-value mono">{altitude.toFixed(1)}</span>
          <span className="widget-unit">m</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(100, (altitude / 400) * 100)}%`,
              background: 'var(--accent-blue)',
            }}
          />
        </div>
      </div>

      {/* Speed */}
      <div className="widget-card brand">
        <div className="widget-header">
          <SpeedIcon />
          <span>Ground Speed</span>
        </div>
        <div className="widget-value-container">
          <span className="widget-value mono">{speed.toFixed(1)}</span>
          <span className="widget-unit">m/s</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(100, (speed / 30) * 100)}%`,
              background: 'var(--accent-purple)',
            }}
          />
        </div>
      </div>

      {/* Signal */}
      <div className={`widget-card ${signalStatus}`}>
        <div className="widget-header">
          <SignalIcon />
          <span>4G/LTE Signal (SIM7600)</span>
        </div>
        <div className="widget-value-container">
          <span className="widget-value mono" style={{ fontSize: signal === null ? '1.25rem' : undefined }}>
            {signal === null || signal === 0 ? '—' : Math.abs(signal).toFixed(0)}
          </span>
          {signal !== null && signal !== 0 && (
            <span className="widget-unit">{signal < 0 ? 'dBm' : '%'}</span>
          )}
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${getSignalPercent(signal)}%` }}
          />
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {getSignalLabel(signal)}
        </p>
      </div>
    </aside>
  );
}
