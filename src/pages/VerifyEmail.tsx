import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../api';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  const hasAttempted = useRef(false); // Prevent double-firing in strict mode

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification link.');
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully! Your account is now fully active.');
        // If the user is logged in the same browser, update the navbar badge instantly
        window.dispatchEvent(new Event('userProfileUpdated'));
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Failed to verify email. The link may have expired.');
      });
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'loading' && (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Verifying...</h2>
            <p className="text-gray-500">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="auth-success-message">
            <span className="success-icon">✓</span>
            <h2 style={{ color: '#111827', marginTop: '1rem' }}>Verified!</h2>
            <p style={{ color: '#4b5563', margin: '0.5rem 0 1.5rem' }}>{message}</p>
            <Link to="/profile" className="btn-solid" style={{ textDecoration: 'none' }}>
              Go to Profile
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' }}>✕</div>
            <h2 style={{ color: '#111827', marginBottom: '0.5rem' }}>Verification Failed</h2>
            <p style={{ color: '#ef4444', marginBottom: '1.5rem' }}>{message}</p>
            <Link to="/login" className="btn-outline" style={{ textDecoration: 'none' }}>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;