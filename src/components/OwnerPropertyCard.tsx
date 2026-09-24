import { Link } from 'react-router-dom';
import type { Property } from '../types';

interface OwnerPropertyCardProps {
  property: Property;
  bookingCount: number;
  pendingRequests: number;
}

function OwnerPropertyCard({ property, bookingCount, pendingRequests }: OwnerPropertyCardProps) {
  const imageUrl = property.images?.find((img) => img.isPrimary)?.imageUrl || property.images?.[0]?.imageUrl;

  return (
    <Link to={`/owner/properties/${property.id}`} className="owner-card" style={{ textDecoration: 'none' }}>
      <div className="owner-card-media" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', minHeight: '180px' }}>
        {imageUrl ? (
          <img src={imageUrl} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="detail-img-placeholder" style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem' }}>🏙️</span>
          </div>
        )}
        <span className={`status-badge ${property.status?.toLowerCase() || 'pending'}`} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          {property.status || 'ACTIVE'}
        </span>
      </div>

      <div className="owner-card-content" style={{ padding: '1rem 1.15rem' }}>
        <h3 className="owner-name" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{property.title}</h3>
        <p className="owner-city" style={{ marginBottom: '0.75rem' }}>{property.city?.name || 'Unknown city'}</p>
        <p className="owner-bio" style={{ marginBottom: '1rem' }}>{property.propertyType?.replace('_', ' ') || ''} • ₹{property.hourlyPrice || 0}/hr</p>
        <div className="property-features" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', color: '#475569' }}>
          <span>{bookingCount} bookings</span>
          <span>{pendingRequests} pending</span>
          <span>{property.guestCapacity || 0} guests</span>
        </div>
      </div>
    </Link>
  );
}

export default OwnerPropertyCard;
