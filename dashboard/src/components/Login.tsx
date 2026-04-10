import { useState, type FormEvent } from 'react';

type Props = {
  onLogin: (token: string) => void;
  restUrl: string;
};

export default function Login({ onLogin, restUrl }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${restUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Login failed (${res.status})`);
      }

      const data = await res.json();
      if (data.token) {
        onLogin(data.token);
      } else {
        throw new Error('No token in response');
      }
    } catch (err: any) {
      setError(err.message || 'Connection error. Check your ThingsBoard URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-box">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
          </div>
          <h1>BVLOS Command Center</h1>
          <p>Sign in with your ThingsBoard credentials to access the live UAV telemetry dashboard.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="operator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button id="login-btn" className="login-btn" type="submit" disabled={loading}>
            {loading ? <div className="spinner-small" /> : 'ACCESS COMMAND CENTER'}
          </button>
        </form>

        <footer className="login-footer">
          MP-08 • IoT &amp; Cloud-Enabled UAV Telemetry System
        </footer>
      </div>
    </div>
  );
}
