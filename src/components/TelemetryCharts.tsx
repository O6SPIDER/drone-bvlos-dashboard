import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { TelemetryData } from '../types';

type Props = {
  history: TelemetryData[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15,23,42,0.95)',
        border: '1px solid rgba(148,163,184,0.15)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        fontSize: '0.8125rem',
      }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: <strong>{p.value.toFixed(2)}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TelemetryCharts({ history }: Props) {
  return (
    <div className="charts-panel">
      <div className="widget-header" style={{ marginBottom: '1.25rem' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span>Live Telemetry Feed</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Last {history.length} readings
        </span>
      </div>

      {history.length < 2 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Waiting for telemetry data...
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="altGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
            <XAxis
              dataKey="timestamp"
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.75rem', paddingTop: '0.5rem' }}
              formatter={(val) => <span style={{ color: 'var(--text-secondary)' }}>{val}</span>}
            />
            <Area
              type="monotone"
              dataKey="altitude"
              name="Altitude (m)"
              stroke="#38bdf8"
              strokeWidth={2}
              fill="url(#altGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#38bdf8' }}
            />
            <Area
              type="monotone"
              dataKey="speed"
              name="Speed (m/s)"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#spdGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#818cf8' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      )}
    </div>
  );
}
