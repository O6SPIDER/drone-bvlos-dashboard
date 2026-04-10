
type Props = {
  connectionStatus: 'initializing' | 'connecting' | 'connected' | 'error' | 'missing_config';
  errorMessage: string;
  onReset: () => void;
};

export default function ConnectionScreen({ connectionStatus, errorMessage, onReset }: Props) {
  return (
    <div className="col-span-full flex justify-center items-center min-h-[500px]">
      <div className="flex flex-col items-center gap-6 p-16 bg-bg-surface backdrop-blur-xl rounded-[24px] border border-border-subtle text-center shadow-2xl">
        {connectionStatus !== 'error' && (
          <div className="w-[54px] h-[54px] border-3 border-accent-blue/10 border-t-accent-blue rounded-full animate-spin" />
        )}
        {connectionStatus === 'error' && (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
        <h3 className="text-xl font-semibold text-white tracking-tight">
          {connectionStatus === 'initializing' && 'Initializing System...'}
          {connectionStatus === 'connecting' && 'Connecting to ThingsBoard...'}
          {connectionStatus === 'connected' && 'Waiting for Drone Telemetry...'}
          {connectionStatus === 'error' && 'Connection Error'}
          {connectionStatus === 'missing_config' && 'Configuration Missing'}
        </h3>
        {errorMessage && <p className="text-sm text-[#fca5a5] max-w-[300px] leading-relaxed">{errorMessage}</p>}
        {connectionStatus === 'error' && (
          <button
            className="bg-accent-blue text-bg-base px-8 h-11 rounded-xe text-sm font-bold transition-all hover:-translate-y-0.5 cursor-pointer"
            onClick={onReset}
          >
            Sign In Again
          </button>
        )}
        {connectionStatus === 'missing_config' && (
          <p className="text-xs text-text-secondary">Please check your .env file for credentials.</p>
        )}
      </div>
    </div>
  );
}
