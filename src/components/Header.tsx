import { useState } from 'react';

type ConnectionStatus = 'initializing' | 'connecting' | 'connected' | 'error' | 'missing_config';

type HeaderProps = {
  connectionStatus?: ConnectionStatus;
  droneStatus?: string;
  activeView: 'dashboard' | 'logs';
  onNavigate: (view: 'dashboard' | 'logs') => void;
  onLogout: () => void;
};

function DroneIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M12 2l0 4" />
      <path d="M12 18l0 4" />
      <path d="M4.929 4.929l2.828 2.828" />
      <path d="M16.243 16.243l2.828 2.828" />
      <path d="M2 12l4 0" />
      <path d="M18 12l4 0" />
      <path d="M4.929 19.071l2.828 -2.828" />
      <path d="M16.243 7.757l2.828 -2.828" />
      <circle cx="5" cy="5" r="1.5" fill="currentColor" />
      <circle cx="19" cy="5" r="1.5" fill="currentColor" />
      <circle cx="5" cy="19" r="1.5" fill="currentColor" />
      <circle cx="19" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

export default function Header({ 
  connectionStatus = 'initializing', 
  droneStatus,
  activeView,
  onNavigate,
  onLogout
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getIndicatorClass = () => {
    if (connectionStatus === 'connected') return 'online';
    if (connectionStatus === 'connecting') return 'connecting';
    if (connectionStatus === 'error') return 'error';
    return 'offline';
  };

  const getStatusText = () => {
    if (connectionStatus === 'connected') {
      return droneStatus ? `UAV ONLINE: ${droneStatus.toUpperCase()}` : 'UAV ONLINE';
    }
    if (connectionStatus === 'connecting') return 'CONNECTING...';
    if (connectionStatus === 'error') return 'LINK ERROR';
    if (connectionStatus === 'missing_config') return 'NO CONFIG';
    return 'INITIALIZING';
  };

  const handleNav = (view: 'dashboard' | 'logs') => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="dashboard-header relative">
      <div className="header-title">
        <DroneIcon />
        <div>
          <h1 style={{ fontSize: '1.25rem', lineHeight: 1 }}>BVLOS Command Center</h1>
          <p className="hidden sm:block" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Cloud-Based UAV Telemetry System • ThingsBoard Integration
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex status-badge">
          <div className={`status-indicator ${getIndicatorClass()}`} />
          <span>{getStatusText()}</span>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[var(--text-primary)] relative z-[10001]"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMenuOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 99999,
              transition: 'all 0.3s ease'
            }}
            onClick={() => setIsMenuOpen(false)}
          />
          <nav 
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.75rem',
              width: '260px',
              backgroundColor: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.25rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              zIndex: 100000,
              animation: 'slideUp 0.3s ease-out',
              transformOrigin: 'top right'
            }}
          >
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button 
                onClick={() => handleNav('dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  transition: 'all 0.2s',
                  border: activeView === 'dashboard' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid transparent',
                  backgroundColor: activeView === 'dashboard' ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  color: activeView === 'dashboard' ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  if (activeView !== 'dashboard') {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== 'dashboard') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: activeView === 'dashboard' ? '#38bdf8' : 'transparent',
                  boxShadow: activeView === 'dashboard' ? '0 0 8px #38bdf8' : 'none'
                }} />
                <span style={{ fontWeight: 600 }}>Dashboard</span>
              </button>
              
              <button 
                onClick={() => handleNav('logs')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  transition: 'all 0.2s',
                  border: activeView === 'logs' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid transparent',
                  backgroundColor: activeView === 'logs' ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  color: activeView === 'logs' ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  if (activeView !== 'logs') {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== 'logs') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: activeView === 'logs' ? '#38bdf8' : 'transparent',
                  boxShadow: activeView === 'logs' ? '0 0 8px #38bdf8' : 'none'
                }} />
                <span style={{ fontWeight: 600 }}>Flight Logs</span>
              </button>

              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }} />

              <button 
                onClick={onLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  transition: 'all 0.2s',
                  border: '1px solid transparent',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'transparent' }} />
                <span style={{ fontWeight: 600 }}>Disconnect System</span>
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
