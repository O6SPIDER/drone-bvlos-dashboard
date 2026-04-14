import type { LogEntry } from '../types';
import { useRef, useEffect } from 'react';

interface LogsProps {
  logs: LogEntry[];
}

export default function Logs({ logs }: LogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return '#22c55e';
      case 'warning': return '#eab308';
      case 'error': return '#ef4444';
      default: return '#38bdf8';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      overflow: 'hidden',
      animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>Flight Logs</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>System events and telemetry milestones</p>
        </div>
        <div style={{ 
          padding: '0.25rem 0.75rem', 
          borderRadius: '999px', 
          backgroundColor: 'rgba(255, 255, 255, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          fontSize: '0.75rem', 
          fontFamily: '"JetBrains Mono", monospace', 
          color: '#94a3b8' 
        }}>
          {logs.length} EVENTS RECORDED
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="custom-scrollbar"
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          paddingRight: '1rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem',
          marginBottom: '1rem'
        }}
      >
        {logs.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '5rem 2rem', 
            backgroundColor: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '1.25rem', 
            borderStyle: 'dashed' 
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', textAlign: 'center' }}>No logs recorded yet...</p>
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem', 
                padding: '1rem', 
                borderRadius: '1rem', 
                backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.05)', 
                transition: 'all 0.3s ease' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: getTypeColor(log.type), 
                    boxShadow: `0 0 8px ${getTypeColor(log.type)}` 
                  }} />
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em', 
                    color: getTypeColor(log.type) 
                  }}>
                    {log.type}
                  </span>
                </div>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontFamily: '"JetBrains Mono", monospace', 
                  color: '#94a3b8', 
                  backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                  padding: '0.125rem 0.5rem', 
                  borderRadius: '4px',
                  opacity: 0.7
                }}>
                  {log.timestamp}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#f8fafc', lineHeight: 1.5, margin: 0 }}>
                {log.event}
              </p>
            </div>
          )).reverse()
        )}
      </div>
    </div>
  );
}
