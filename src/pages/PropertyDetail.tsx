import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, getPropertyReviews, getToken, toggleWishlist } from '../api';
import BookingForm from '../components/BookingForm';
import ReviewsSection from '../components/ReviewsSection';
import ChatModal from '../components/ChatModal';

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Interaction States
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  
  // Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    Promise.all([
      getPropertyById(id),
      getPropertyReviews(id).catch(() => [])
    ])
      .then(([propertyData, reviewsData]) => {
        setProperty(propertyData);
        setIsWishlisted(propertyData.isWishlisted || false);
        setReviews(reviewsData);
        setLoading(false);
        setActiveImageIndex(0); // Reset gallery on property change
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Property not found');
        setLoading(false);
      });
  }, [id]);

  const handleWishlistClick = async () => {
    if (!getToken()) {
      navigate('/login');
      return;
    }
    
    setWishlistLoading(true);
    try {
      await toggleWishlist(property.id, isWishlisted);
      setIsWishlisted(!isWishlisted);
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return <div className="app-content"><div className="loading-state">Loading property details...</div></div>;
  }

  if (error || !property) {
    return <div className="app-content"><div className="message-banner error">{error || 'Property not found'}</div></div>;
  }

  const isLoggedIn = Boolean(getToken());
  const images = property.images || [];
  const activeImageUrl = images[activeImageIndex]?.imageUrl;

  return (
    <div className="property-detail-layout">
      
      {/* Top Split Layout */}
      <div className="detail-hero-split">
        
        {/* LEFT COLUMN: Interactive Image Gallery */}
        <div className="detail-image-section">
          <div className="property-gallery">
            {/* Main Large Image */}
            <div className="main-image-container">
              {activeImageUrl ? (
                <img src={activeImageUrl} alt={`${property.title} - View ${activeImageIndex + 1}`} className="detail-main-img" />
              ) : (
                <div className="detail-img-placeholder">🏙️</div>
              )}
              <button 
                className={`wishlist-fab ${isWishlisted ? 'active' : ''}`}
                onClick={handleWishlistClick}
                disabled={wishlistLoading}
              >
                {isWishlisted ? '♥' : '♡'}
              </button>
            </div>

            {/* Thumbnail Strip (Only shows if > 1 image) */}
            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((img: any, idx: number) => (
                  <div 
                    key={img.id || idx} 
                    className={`thumbnail-box ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img.imageUrl} alt={`Thumbnail ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Info & Booking */}
        <div className="detail-info-section">
          <h1 className="detail-title">{property.title}</h1>
          
          <div className="detail-price">
            {property.dailyPrice ? `₹ ${property.dailyPrice} / Day` : `₹ ${property.hourlyPrice} / Hour`}
          </div>
          
          <p className="detail-description">{property.description}</p>
          <p className="detail-address">📍 {property.address}</p>

          {/* Inline Booking Preview (Triggers Modal) */}
          <div className="booking-preview-card">
            <button 
              className="btn-solid w-100 btn-large"
              onClick={() => isLoggedIn ? setShowBookingForm(true) : navigate('/login')}
            >
              {isLoggedIn ? 'Book Now' : 'Login to Book'}
            </button>
          </div>

          {/* Amenities */}
          <div className="detail-section">
            <h3 className="section-subtitle">Amenities</h3>
            {property.amenities && property.amenities.length > 0 ? (
              <div className="amenities-grid">
                {property.amenities.map((amenity: any) => (
                  <div key={amenity.id} className="amenity-item">
                    <span className="amenity-icon">✓</span> {amenity.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No specific amenities listed.</p>
            )}
          </div>

          {/* Property Stats */}
          <div className="detail-section">
            <h3 className="section-subtitle">Space Details</h3>
            <div className="stats-row">
              <div className="stat-box">
                <span className="stat-label">Capacity</span>
                <span className="stat-value">{property.guestCapacity} Guests</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Size</span>
                <span className="stat-value">{property.size} sq.ft</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Rooms</span>
                <span className="stat-value">{property.bedrooms} Bed, {property.bathrooms} Bath</span>
              </div>
            </div>
          </div>

          {/* Owner Card */}
          <div className="owner-card">
            <div className="owner-card-header">
              <div className="owner-avatar">
                {property.owner?.profileImage ? (
                  <img src={property.owner.profileImage} alt={property.owner.fullName} />
                ) : (
                  <span>{property.owner?.fullName?.charAt(0) || 'O'}</span>
                )}
              </div>
              <div>
                <h4 className="owner-name">Owner: {property.owner?.fullName}</h4>
                <p className="owner-city">{property.owner?.city?.name || 'TrustSpace Host'}</p>
              </div>
            </div>
            {property.owner?.bio && <p className="owner-bio">{property.owner.bio}</p>}
          </div>

        </div>
      </div>

      {/* LATEST REVIEWS SECTION */}
      <ReviewsSection propertyId={Number(id)} reviews={reviews} />

      {/* CONTACT OWNER SECTION */}
      <div className="contact-owner-section">
        <h2 className="section-title text-center">Contact Owner</h2>
        <button 
          className="btn-outline btn-large" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => {
            if(isLoggedIn) setShowChatModal(true);
            else navigate('/login');
          }}
        >
          <span>💬</span> Chat with {property.owner?.fullName}
        </button>
      </div>

      {showChatModal && (
        <ChatModal 
          propertyId={property.id} 
          ownerId={property.owner.id} 
          ownerName={property.owner.fullName} 
          onClose={() => setShowChatModal(false)} 
        />
      )}

      {/* BOOKING MODAL */}
      {showBookingForm && (
        <BookingForm
          propertyId={property.id}
          hourlyPrice={property.hourlyPrice}
          onSuccess={() => setShowBookingForm(false)}
          onCancel={() => setShowBookingForm(false)}
        />
      )}

    </div>
  );
}

export default PropertyDetail;