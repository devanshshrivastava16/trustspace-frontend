import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';

const AUTH_TOKEN_KEY = 'trustspace_access_token';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Basic validation: both fields must have text
  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError(null);

    try {
      const result = await login(email, password);
      localStorage.setItem(AUTH_TOKEN_KEY, result.accessToken);
      
      // Redirect immediately upon successful login
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login to TrustSpace</h1>
          <p>Welcome back! Please enter your details.</p>
        </div>

        {success ? (
          <div className="auth-success-message">
            <span className="success-icon">✓</span>
            <p>Login successful! Redirecting...</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button 
              type="submit" 
              className={`btn-submit ${!isFormValid ? 'disabled' : ''}`}
              disabled={!isFormValid || loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="text-blue">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;