const STYLE = `
  .cs-wrapper {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 500px;
  }
  
  .cs-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 64px;
    background-color: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(24px);
    border-radius: 24px;
    border: 1px solid rgba(148, 163, 184, 0.1);
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .cs-spinner {
    width: 54px;
    height: 54px;
    border: 3px solid rgba(56, 189, 248, 0.1);
    border-top: 3px solid #38bdf8;
    border-radius: 50%;
    animation: csSpin 1s linear infinite;
  }

  .cs-icon-error {
    color: #ef4444;
  }

  .cs-title {
    font-size: 20px;
    font-weight: 600;
    color: white;
    letter-spacing: -0.025em;
    margin: 0;
  }

  .cs-error-text {
    font-size: 14px;
    color: #fca5a5;
    max-width: 300px;
    line-height: 1.625;
    margin: 0;
  }

  .cs-missing-text {
    font-size: 12px;
    color: #94a3b8;
    margin: 0;
  }

  .cs-btn {
    background-color: #38bdf8;
    color: #0f172a;
    padding: 0 32px;
    height: 44px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    border: none;
    transition: all 0.2s;
    cursor: pointer;
  }

  .cs-btn:hover {
    transform: translateY(-2px);
    background-color: #7dd3fc;
  }

  @keyframes csSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

type Props = {
  connectionStatus: 'initializing' | 'connecting' | 'connected' | 'error' | 'missing_config';
  errorMessage: string;
  onReset: () => void;
};

export default function ConnectionScreen({ connectionStatus, errorMessage, onReset }: Props) {
  return (
    <>
      <style>{STYLE}</style>
      <div className="cs-wrapper">
        <div className="cs-card">
          {connectionStatus !== 'error' && (
            <div className="cs-spinner" />
          )}
          {connectionStatus === 'error' && (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="cs-icon-error" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <h3 className="cs-title">
            {connectionStatus === 'initializing' && 'Initializing System...'}
            {connectionStatus === 'connecting' && 'Connecting to ThingsBoard...'}
            {connectionStatus === 'connected' && 'Waiting for Drone Telemetry...'}
            {connectionStatus === 'error' && 'Connection Error'}
            {connectionStatus === 'missing_config' && 'Configuration Missing'}
          </h3>
          {errorMessage && <p className="cs-error-text">{errorMessage}</p>}
          {connectionStatus === 'error' && (
            <button className="cs-btn" onClick={onReset}>
              Sign In Again
            </button>
          )}
          {connectionStatus === 'missing_config' && (
            <p className="cs-missing-text">Please check your .env file for credentials.</p>
          )}
        </div>
      </div>
    </>
  );
}
