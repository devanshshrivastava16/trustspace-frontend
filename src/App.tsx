import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import EditProfile from './pages/EditProfile';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cities from './pages/Cities';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Wishlist from './pages/Wishlist';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import BookingDetail from './pages/BookingDetail';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerPropertyDetail from './pages/OwnerPropertyDetail';
import CreateProperty from './pages/CreateProperty';
import OwnerBookings from './pages/OwnerBookings';
import MyReviews from './pages/MyReviews';
import ChatPage from './pages/ChatPage';
import About from './pages/About';
import Footer from './components/Footer';

import {
  getCities,
  getCurrentUser,
  getToken,
  getWishlist,
  getUnreadChatCount,
} from './api';

function App() {
  // =========================
  // STATES
  // =========================

  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [cities, setCities] = useState<any[]>([]);

  const [loadingCities, setLoadingCities] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // NEW STATE: Wishlist Count
  const [wishlistCount, setWishlistCount] = useState(0);

  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const [selectedCity, setSelectedCity] = useState(() => {
    return (
      localStorage.getItem('trustspace_selected_city') ||
      'GWALIOR'
    );
  });

  // =========================
  // FETCH CURRENT USER
  // =========================

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (getToken()) {
          const user = await getCurrentUser();

          console.log('Current User:', user);

          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Failed to fetch current user:', err);

        localStorage.removeItem(
          'trustspace_access_token'
        );
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  // =========================
  // LISTEN FOR PROFILE UPDATES
  // =========================
  // This listener allows the navbar to update instantly when EditProfile changes the image/data
  useEffect(() => {
    const handleProfileUpdate = async () => {
      if (getToken()) {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (err) {
          console.error('Failed to refresh user data:', err);
        }
      }
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    
    // Cleanup the listener when the component unmounts
    return () => window.removeEventListener('userProfileUpdated', handleProfileUpdate);
  }, []);

  // =========================
  // FETCH & LISTEN FOR WISHLIST
  // =========================
  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (getToken() && currentUser) {
        try {
          const wishlist = await getWishlist();
          setWishlistCount(wishlist.length);
        } catch (err) {
          console.error('Failed to fetch wishlist count:', err);
        }
      }
    };

    fetchWishlistCount();

    // Listen for events when a user adds/removes an item from the wishlist
    window.addEventListener('wishlistUpdated', fetchWishlistCount);
    return () => window.removeEventListener('wishlistUpdated', fetchWishlistCount);
  }, [currentUser]); // Re-run if the user logs in/out

  useEffect(() => {
    const fetchChatCount = async () => {
      if (getToken() && currentUser) {
        try {
          const res = await getUnreadChatCount();
          setUnreadChatCount(res.count);
        } catch (err) { console.error(err); }
      }
    };
    fetchChatCount();
    window.addEventListener('chatUpdated', fetchChatCount);
    return () => window.removeEventListener('chatUpdated', fetchChatCount);
  }, [currentUser]);

  // =========================
  // FETCH CITIES
  // =========================

  useEffect(() => {
    if (isCityModalOpen && cities.length === 0) {
      setLoadingCities(true);

      getCities()
        .then((data) => {
          console.log('Cities:', data);

          setCities(data || []);
        })
        .catch((err) => {
          console.error(
            'Failed to load cities:',
            err
          );
        })
        .finally(() => {
          setLoadingCities(false);
        });
    }
  }, [isCityModalOpen, cities.length]);

  // =========================
  // FILTER CITIES
  // =========================

  const filteredCities = cities.filter((city) =>
    city?.name
      ?.toLowerCase()
      ?.includes(searchQuery.toLowerCase())
  );

  const renderRoleProtected = (requiredRole: 'USER' | 'OWNER', element: JSX.Element) => {
    return (
      <ProtectedRoute>
        {loadingUser ? (
          <div className="app-content"><div className="loading-state">Verifying access...</div></div>
        ) : currentUser?.role === requiredRole ? (
          element
        ) : (
          <Navigate to="/" replace />
        )}
      </ProtectedRoute>
    );
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="app-shell">
      {/* ================= HEADER ================= */}

      <header className="app-header">
        {/* Logo */}
        <div className="brand">
          <Link to="/">
            Trust
            <span className="text-blue">
              Space
            </span>
          </Link>
        </div>

        <div className="header-right">
          {/* 1. CITY SELECTOR */}
          <button className="location-pin-btn" onClick={() => { setIsCityModalOpen(true); setIsMobileMenuOpen(false); }}>
            <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>📍</span>
            <span className="city-text">{selectedCity.toUpperCase()}</span>
            <span className="chevron">▼</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Header Actions */}
          <div className={`header-actions ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* 1. ROLE-BASED NAVIGATION */}
            <div className="nav-item-role">
              {currentUser?.role === 'USER' ? (
                <Link to="/bookings" className="btn-outline" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                  My Bookings
                </Link>
              ) : currentUser?.role === 'OWNER' ? (
                <Link to="/owner/dashboard" className="btn-outline" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <Link to="/owner/create-property" className="btn-outline" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                  Post Spaces
                </Link>
              )}
            </div>

            {/* 2. WISHLIST ICON (Visible for all logged-in users) */}
            {currentUser && (
              <div className="nav-item-wishlist">
                <Link to="/wishlist" className="nav-wishlist-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="wishlist-icon">♡</span>
                  {wishlistCount > 0 && (
                    <span className="wishlist-badge">{wishlistCount}</span>
                  )}
                </Link>
              </div>
            )}

            {/* 3. CHAT ICON */}
            {currentUser && (
              <div className="nav-item-chat">
                <Link to="/chat" className="nav-wishlist-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="wishlist-icon">💬</span>
                  {unreadChatCount > 0 && (
                    <span className="wishlist-badge" style={{ background: '#3b82f6' }}>{unreadChatCount}</span>
                  )}
                </Link>
              </div>
            )}

            {/* 4. AUTH SECTION / USER ICON */}
            <div className="nav-item-auth">
              {currentUser ? (
                <Link
                  to="/profile"
                  className="nav-profile-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {currentUser?.profileImage ? (
                    <img
                      src={
                        currentUser.profileImage
                      }
                      alt="Profile"
                      className="nav-avatar"
                    />
                  ) : (
                    <div className="nav-avatar-placeholder">
                      {currentUser?.fullName
                        ?.charAt(0)
                        ?.toUpperCase() || 'U'}
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn-solid"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= CITY MODAL ================= */}

      {isCityModalOpen && (
        <div
          className="city-modal-overlay"
          onClick={() =>
            setIsCityModalOpen(false)
          }
        >
          <div
            className="city-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* MODAL HEADER */}
            <div className="modal-header-simple">
              <h3>Select your city</h3>

              <button
                className="close-icon"
                onClick={() =>
                  setIsCityModalOpen(false)
                }
              >
                ✕
              </button>
            </div>

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search cities in India..."
              className="city-search-input"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              autoFocus
            />

            {/* CITY LIST */}
            <div className="city-list">
              {loadingCities ? (
                <div className="loading-state">
                  Fetching cities from
                  server...
                </div>
              ) : filteredCities.length >
                0 ? (
                filteredCities.map(
                  (city) => (
                    <div
                      key={city.id}
                      className="city-list-item"
                      onClick={() => {
                        setSelectedCity(
                          city.name
                        );

                        localStorage.setItem(
                          'trustspace_selected_city',
                          city.name
                        );

                        setIsCityModalOpen(
                          false
                        );

                        setSearchQuery('');
                      }}
                    >
                      <div className="city-item-left">
                        <span className="city-pin">
                          📍
                        </span>

                        <span className="city-name">
                          {city.name}
                        </span>
                      </div>

                      <span className="city-state">
                        {city.state}
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="no-results">
                  No cities found matching "
                  {searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN ================= */}

      <main className="app-content">
        <Routes>
          {/* PUBLIC ROUTES */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route path="/about" element={<About />} />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
          <Route 
            path="/forgot-password" 
            element={<ForgotPassword />} 
          /> {/* NEW */}
          <Route 
            path="/reset-password" 
            element={<ResetPassword />} 
          />   {/* NEW */}
          <Route 
            path="/verify-email" 
            element={<VerifyEmail />} 
          />
          <Route
            path="/cities"
            element={<Cities />}
          />

          <Route
            path="/properties"
            element={<Properties />}
          />

          <Route
            path="/properties/:id"
            element={<PropertyDetail />}
          />

          {/* PROTECTED ROUTES */}

          <Route

            path="/profile"

      element={

    <ProtectedRoute>

      <Profile />

    </ProtectedRoute>

  }

/>



<Route

  path="/wishlist"

  element={

    <ProtectedRoute>

      <Wishlist />

    </ProtectedRoute>

  }

/>

<Route

  path="/edit-profile"

  element={

    <ProtectedRoute>

      <EditProfile />

    </ProtectedRoute>

  }

/>

   



          <Route
            path="/bookings"
            element={renderRoleProtected('USER', <Bookings />)}
          />

          {/* NEW: Booking Detail Route */}
          <Route
            path="/bookings/:id"
            element={renderRoleProtected('USER', <BookingDetail />)}
          />

          <Route
            path="/owner/dashboard"
            element={renderRoleProtected('OWNER', <OwnerDashboard />)}
          />

          <Route
            path="/owner/bookings"
            element={renderRoleProtected('OWNER', <OwnerBookings />)}
          />

          <Route
            path="/owner/properties/:id"
            element={renderRoleProtected('OWNER', <OwnerPropertyDetail />)}
          />

          <Route
            path="/owner/create-property"
            element={renderRoleProtected('OWNER', <CreateProperty />)}
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}

          <Route
            path="*"
            element={
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                }}
              >
                <h1>
                  404 - Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </main>

      {/* ================= FOOTER ================= */}

      <Footer />
    </div>
  );
}

export default App;