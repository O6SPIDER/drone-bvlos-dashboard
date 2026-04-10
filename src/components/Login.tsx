import { useState, type FormEvent } from 'react';
import './Login.css';

type Props = {
  onLogin: (token: string) => void;
  restUrl: string;
};

export default function Login({ onLogin, restUrl }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.message || 'Connection error. Check uplink status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-login-container">
      {/* Abstract background elements for depth */}
      <div className="bg-glow"></div>

      <div className="dashboard-login-card">
        <header className="dashboard-login-header">
          <div className="system-badge">System v4.0.2</div>
          <h1>COMMAND CENTER</h1>
        </header>

        <div className="dashboard-login-body">
          <div className="login-intro">
            <svg className="terminal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
            <h2>Operator Authentication</h2>
          </div>

          <form onSubmit={handleSubmit} className="dashboard-login-form">
            {error && (
              <div className="dashboard-error-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <p>{error}</p>
              </div>
            )}

            <div className="dashboard-input-group">
              <div className="input-field">
                <label htmlFor="email">Operator ID / Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@bvlos.com"
                  className="dashboard-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-field">
                <label htmlFor="password">Access Key</label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="dashboard-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="dashboard-submit-btn"
            >
              {loading ? <div className="spinner" /> : 'ESTABLISH UPLINK'}
            </button>
          </form>
        </div>

        <footer className="dashboard-footer">
          SECURE CHANNEL 08 // ENCRYPTED AES-256
        </footer>
      </div>
    </div>
  );
}