import { useState, type FormEvent } from 'react';
const STYLE = `
  :root {
    --bg-dark: #0a0c10;
    --card-bg: #161b22;
    --accent-blue: #58a6ff;
    --accent-hover: #1f6feb;
    --border-color: #30363d;
    --text-main: #c9d1d9;
    --text-muted: #8b949e;
    --error-red: #f85149;
  }

  .dashboard-login-container {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg-dark);
    background-image:
      radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
    background-size: 40px 40px;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: var(--text-main);
    overflow: hidden;
    padding: 16px;
    box-sizing: border-box;
  }

  .bg-glow {
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(88, 166, 255, 0.1) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .dashboard-login-card {
    width: 100%;
    max-width: 440px;
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    position: relative;
    z-index: 1;
    animation: fadeIn 0.4s ease-out;
  }

  .dashboard-login-header {
    padding: 20px 32px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .system-badge {
    font-size: 10px;
    font-weight: bold;
    color: var(--accent-blue);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .dashboard-login-header h1 {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin: 0;
  }

  .dashboard-login-body {
    padding: 32px;
  }

  .login-intro {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .terminal-icon {
    width: 20px;
    height: 20px;
    color: var(--accent-blue);
  }

  .dashboard-login-body h2 {
    font-size: 16px;
    font-weight: 400;
    color: var(--text-muted);
    margin: 0;
  }

  .dashboard-login-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .dashboard-input-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .input-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-field label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .dashboard-input {
    width: 100%;
    padding: 12px 16px;
    background-color: #0d1117;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: white;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .dashboard-input:focus {
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.15);
  }

  .password-wrapper {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--accent-blue);
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
  }

  .dashboard-submit-btn {
    width: 100%;
    padding: 14px;
    background-color: #238636;
    color: white;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .dashboard-submit-btn:hover:not(:disabled) {
    background-color: #2ea043;
  }

  .dashboard-error-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background-color: rgba(248, 81, 73, 0.1);
    border: 1px solid var(--error-red);
    border-radius: 6px;
    color: var(--error-red);
    font-size: 13px;
  }

  .dashboard-error-box svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .dashboard-footer {
    padding: 16px;
    text-align: center;
    font-size: 10px;
    color: #484f58;
    letter-spacing: 0.1em;
    border-top: 1px solid var(--border-color);
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: lSpin 0.8s linear infinite;
  }

  @keyframes lSpin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .dashboard-login-container {
      padding: 12px;
    }
    .dashboard-login-card {
      max-width: 100%;
    }
    .dashboard-login-header {
      padding: 16px 20px;
    }
    .dashboard-login-body {
      padding: 24px 20px;
    }
    .login-intro {
      margin-bottom: 20px;
    }
    .login-intro h2 {
      font-size: 14px;
    }
    .dashboard-input {
      padding: 10px 14px;
    }
    .dashboard-submit-btn {
      padding: 12px;
    }
  }
`;

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
      <style>{STYLE}</style>
      {/* Abstract background elements for depth */}
      <div className="bg-glow"></div>

      <div className="dashboard-login-card">
        

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