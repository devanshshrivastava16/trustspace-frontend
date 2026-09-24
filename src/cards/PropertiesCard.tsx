import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: any;
  isWishlistView?: boolean;
}

function PropertiesCard({ property, isWishlistView }: PropertyCardProps) {
  const navigate = useNavigate();

  // Safely get the primary image or fallback
  const primaryImage = property.images?.find((img: any) => img.isPrimary)?.imageUrl 
    || property.images?.[0]?.imageUrl;

  return (
    <div className="property-card-modern" onClick={() => navigate(`/properties/${property.id}`)}>
      <div className="property-image-wrapper">
        {primaryImage ? (
          <img src={primaryImage} alt={property.title} loading="lazy" />
        ) : (
          <div className="property-image-placeholder-modern">
            <span>🏙️</span>
          </div>
        )}
        
        {/* Wishlist Heart & Badges */}
        <button 
          className={`heart-btn ${property.isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Hook up to wishlist API
          }}
        >
          {property.isWishlisted ? '♥' : '♡'}
        </button>
        <div className="property-badges">
          <span className="badge-type">{property.propertyType.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="property-card-content">
        <div className="property-card-header">
          <h3 className="property-title">{property.title}</h3>
          <div className="property-rating">
            ★ {property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'} 
            <span className="review-count">({property.totalReviews})</span>
          </div>
        </div>

        <p className="property-address">{property.address}</p>
        
        <div className="property-features">
          <span>👥 Up to {property.guestCapacity}</span>
          <span>•</span>
          {property.furnished && <span>🛋️ Furnished</span>}
          {property.parkingAvailable && <span>🅿️ Parking</span>}
        </div>

        <div className="property-price-row">
          <div className="price-block">
            <span className="price-amount">₹{property.hourlyPrice}</span>
            <span className="price-unit">/ Hour</span>
          </div>
          {property.dailyPrice && (
            <div className="price-block daily-price">
              <span className="price-amount">₹{property.dailyPrice}</span>
              <span className="price-unit">/ Day</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertiesCard;