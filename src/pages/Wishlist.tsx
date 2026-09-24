import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWishlist } from '../api';
import PropertiesCard from '../cards/PropertiesCard';

function Wishlist() {
  const navigate = useNavigate();
  const [wishlistProps, setWishlistProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = () => {
    getWishlist()
      .then((data) => {
        // Depending on your API, data might be the properties directly, 
        // or wrapped in a wishlist object (e.g., data.map(item => item.property))
        setWishlistProps(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load wishlist'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishlist();

    // Listen for changes so the page updates if a user removes an item while on this page
    window.addEventListener('wishlistUpdated', fetchWishlist);
    return () => window.removeEventListener('wishlistUpdated', fetchWishlist);
  }, []);

  if (loading) return <div className="app-content"><div className="loading-state">Loading your wishlist...</div></div>;

  return (
    <div className="properties-layout" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="settings-header" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">My Wishlist</h1>
      </div>

      {error && <div className="message-banner error">{error}</div>}

      {wishlistProps.length === 0 && !error ? (
        <div className="empty-state-premium">
          <span className="empty-icon">❤️</span>
          <h3>No saved spaces yet</h3>
          <p>As you explore, click the heart icon to save your favorite spaces here.</p>
          <button className="btn-solid" onClick={() => navigate('/properties')}>Explore Spaces</button>
        </div>
      ) : (
        <div className="properties-grid">
          {wishlistProps.map((property) => (
            // If the API returns { id: 1, property: {...} }, use property.property
            // Assuming the API directly returns the property object for now:
            <PropertiesCard 
              key={property.id} 
              property={property} 
              isWishlistView={true} // Optional flag if you want to alter the card slightly
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;