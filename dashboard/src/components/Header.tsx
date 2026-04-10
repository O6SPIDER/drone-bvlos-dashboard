type ConnectionStatus = 'initializing' | 'connecting' | 'connected' | 'error' | 'missing_config';

type HeaderProps = {
  connectionStatus?: ConnectionStatus;
  droneStatus?: string;
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

export default function Header({ connectionStatus = 'initializing', droneStatus }: HeaderProps) {
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

  return (
    <header className="dashboard-header">
      <div className="header-title">
        <DroneIcon />
        <div>
          <h1 style={{ fontSize: '1.25rem', lineHeight: 1 }}>BVLOS Command Center</h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Cloud-Based UAV Telemetry System • ThingsBoard Integration
          </p>
        </div>
      </div>

      <div className="status-badge">
        <div className={`status-indicator ${getIndicatorClass()}`} />
        <span>{getStatusText()}</span>
      </div>
    </header>
  );
}
