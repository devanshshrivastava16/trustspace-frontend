import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, getCities } from '../api';

function Register() {
  const navigate = useNavigate();
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cityId, setCityId] = useState<number | ''>('');
  
  // App State
  const [cities, setCities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch cities for the dropdown
  useEffect(() => {
    getCities()
      .then(setCities)
      .catch(() => console.error("Could not load cities"));
  }, []);

  const validateForm = () => {
    if (fullName.length < 2 || fullName.length > 100) {
      return "Full name must be between 2 and 100 characters.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    // Password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.";
    }
    if (phone && (phone.length < 10 || phone.length > 15)) {
      return "Phone number must be between 10 and 15 digits.";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await registerUser({ 
        fullName, 
        email, 
        password, 
        phone: phone || undefined, 
        cityId: cityId === '' ? undefined : Number(cityId) 
      });
      
      // If a city was selected, save its name to local storage so the Navbar can pick it up
      if (cityId !== '') {
        const selectedCityObj = cities.find(c => c.id === Number(cityId));
        if (selectedCityObj) {
          localStorage.setItem('trustspace_selected_city', selectedCityObj.name);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Email might already exist.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <h1>Create an Account</h1>
          <p>Join TrustSpace to book or list properties.</p>
        </div>

        {success ? (
          <div className="auth-success-message">
            <span className="success-icon">✓</span>
            <p>Registration successful! Redirecting to login...</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                placeholder="Must include uppercase, lowercase & number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label htmlFor="phone">Phone (Optional)</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="10-15 digits"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="city">City (Optional)</label>
                <select 
                  id="city" 
                  value={cityId} 
                  onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : '')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                    color: '#111827',
                    outline: 'none'
                  }}
                >
                  <option value="">Select a city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="text-blue">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;