import { useEffect, useState } from 'react';
import { getCurrentUser, logoutUser } from '../api';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">Loading your profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-container">
        <div className="auth-error">{error || 'Unable to load profile'}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.fullName} />
          ) : (
            <span className="avatar-placeholder">{user.fullName.charAt(0)}</span>
          )}
        </div>

        <div className="profile-title-info">
          <div className="title-with-badge">
            <h1>{user.fullName}</h1>
            {user.isVerified ? (
              <span className="verify-badge verified">✓ Verified</span>
            ) : (
              <span className="verify-badge unverified">✕ Unverified</span>
            )}
          </div>
          <p className="role-badge">{user.role}</p>
        </div>
      </div>

      <div className="profile-details-grid">
        <div className="detail-card">
          <h3>Contact Information</h3>
          <div className="detail-row">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="label">Phone:</span>
            <span className="value">{user.phone || 'Not provided'}</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>About Me</h3>
          <p className="bio-text">{user.bio || 'No bio provided yet.'}</p>
          <div className="detail-row" style={{ marginTop: '1rem' }}>
            <span className="label">Primary City:</span>
            <span className="value">{user.city?.name || 'Not set'}</span>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn-outline" onClick={() => navigate('/edit-profile')}>
          Edit Profile
        </button>
        <button className="btn-danger" onClick={logoutUser}>Log Out</button>
      </div>
    </div>
  );
}

export default Profile;