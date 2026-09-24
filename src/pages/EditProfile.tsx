import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, updateUserProfile, getCities, 
  uploadProfileImage, changePassword, deleteAccount, logoutUser 
} from '../api';

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // General Profile State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [cityId, setCityId] = useState<number | ''>('');
  const [profileMessage, setProfileMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Image State
  const [imageUploading, setImageUploading] = useState(false);
  const [imageMessage, setImageMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    Promise.all([
      getCurrentUser(),
      getCities().catch(() => [])
    ])
      .then(([userData, citiesData]) => {
        setCurrentUser(userData);
        setFullName(userData.fullName || '');
        setPhone(userData.phone || '');
        setBio(userData.bio || '');
        setCityId(userData.city?.id || '');
        setCities(citiesData);
        setLoading(false);
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  // --- Handlers ---

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      await updateUserProfile({
        fullName,
        phone: phone || undefined,
        bio: bio || undefined,
        cityId: cityId === '' ? undefined : Number(cityId)
      });
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      window.dispatchEvent(new Event('userProfileUpdated'));
    } catch (err) {
      setProfileMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setImageMessage(null);
    try {
      const updatedUser = await uploadProfileImage(file);
      setCurrentUser(updatedUser); // Update local state with new image URL
      setImageMessage({ type: 'success', text: 'Image uploaded successfully!' });
      window.dispatchEvent(new Event('userProfileUpdated'));
    } catch (err) {
      setImageMessage({ type: 'error', text: err instanceof Error ? err.message : 'Image upload failed' });
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  const handleImageRemove = async () => {
    setImageUploading(true);
    setImageMessage(null);
    try {
      // Assuming sending an empty profileImage clears it
      await updateUserProfile({ profileImage: '' });
      setCurrentUser({ ...currentUser, profileImage: null });
      setImageMessage({ type: 'success', text: 'Image removed successfully!' });
      window.dispatchEvent(new Event('userProfileUpdated'));
    } catch (err) {
      setImageMessage({ type: 'error', text: 'Failed to remove image' });
    } finally {
      setImageUploading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordMessage(null);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to change password' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await deleteAccount();
      logoutUser(); // Clears local storage and redirects
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete account');
    }
  };

  if (loading) return <div className="auth-container"><div className="loading-state">Loading your details...</div></div>;

  return (
    <div className="profile-container" style={{ maxWidth: '700px' }}>
      
      <div className="settings-header">
        <h1>Account Settings</h1>
        <button className="btn-outline" onClick={() => navigate('/profile')}>← Back to Profile</button>
      </div>

      {/* SECTION 1: Profile Image */}
      <div className="detail-card">
        <h3>Profile Image</h3>
        <div className="image-edit-section">
          <div className="profile-avatar-large">
            {currentUser?.profileImage ? (
              <img src={currentUser.profileImage} alt="Profile" />
            ) : (
              <span className="avatar-placeholder">{fullName.charAt(0) || 'U'}</span>
            )}
          </div>
          <div className="image-actions">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageUpload} 
            />
            <button 
              className="btn-outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={imageUploading}
            >
              {imageUploading ? 'Uploading...' : 'Change Image'}
            </button>
            {currentUser?.profileImage && (
              <button className="btn-text-danger" onClick={handleImageRemove} disabled={imageUploading}>
                Remove Image
              </button>
            )}
          </div>
        </div>
        {imageMessage && <div className={`message-banner ${imageMessage.type}`}>{imageMessage.text}</div>}
      </div>

      {/* SECTION 2: General Info */}
      <div className="detail-card">
        <h3>Personal Information</h3>
        <form className="auth-form" onSubmit={handleProfileUpdate}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Primary City</label>
              <select className="custom-select" value={cityId} onChange={(e) => setCityId(Number(e.target.value))}>
                <option value="">Select a city</option>
                {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>About Me (Bio)</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="custom-textarea" />
          </div>

          {profileMessage && <div className={`message-banner ${profileMessage.type}`}>{profileMessage.text}</div>}
          <button type="submit" className="btn-solid" disabled={savingProfile} style={{ width: 'fit-content' }}>
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* SECTION 3: Change Password */}
      <div className="detail-card">
        <h3>Change Password</h3>
        <form className="auth-form" onSubmit={handlePasswordChange}>
          <div className="input-group">
            <label>Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min 8 chars, uppercase, lowercase, number" />
          </div>

          {passwordMessage && <div className={`message-banner ${passwordMessage.type}`}>{passwordMessage.text}</div>}
          <button type="submit" className="btn-solid" disabled={changingPassword} style={{ width: 'fit-content' }}>
            {changingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* SECTION 4: Danger Zone */}
      <div className="detail-card danger-zone">
        <h3>Danger Zone</h3>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button className="btn-danger" onClick={handleDeleteAccount} style={{ marginTop: '1rem' }}>
          Delete Account
        </button>
      </div>

    </div>
  );
}

export default EditProfile;