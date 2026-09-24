import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPropertyById, getOwnerBookings } from '../api';

function OwnerPropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<any>(null);
  const [propertyBookings, setPropertyBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    Promise.all([
      getPropertyById(id),
      getOwnerBookings().catch(() => []) // Fallback if no bookings
    ])
      .then(([propertyData, allOwnerBookings]) => {
        setProperty(propertyData);
        // Filter bookings to only show ones for THIS property
        const filteredBookings = allOwnerBookings.filter((b: any) => b.property?.id === Number(id));
        setPropertyBookings(filteredBookings);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Property not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="app-content"><div className="loading-state">Loading property details...</div></div>;
  if (error || !property) return <div className="app-content"><div className="message-banner error">{error || 'Property not found'}</div></div>;

  // Calculate quick stats
  const totalRevenue = propertyBookings
    .filter(b => b.paymentStatus === 'COMPLETED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const pendingRequests = propertyBookings.filter(b => b.status === 'PENDING').length;

  return (
    <div className="dashboard-layout" style={{ maxWidth: '1100px' }}>
      
      {/* Header */}
      <div className="dashboard-header" style={{ alignItems: 'center' }}>
        <div className="dashboard-title-group">
          <button className="btn-text-clear" onClick={() => navigate('/owner/dashboard')} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
            ← Back to Dashboard
          </button>
          <h1 className="section-title" style={{ marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {property.title}
            <span className="status-badge approved">ACTIVE</span>
          </h1>
          <p className="text-muted">📍 {property.address}, {property.city?.name}</p>
        </div>
        <div className="dashboard-header-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-outline">Edit Property</button>
          <Link to={`/properties/${property.id}`} className="btn-solid" target="_blank">View Public Listing</Link>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="dashboard-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-content">
            <h3>{propertyBookings.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">₹</div>
          <div className="stat-content">
            <h3>₹{totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div className="stat-content">
            <h3>{pendingRequests}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
      </div>

      <div className="detail-hero-split" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
        
        {/* Left: Images */}
        <div className="detail-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Property Media</h3>
          <div className="owner-gallery-grid">
            {property.images && property.images.length > 0 ? (
              property.images.map((img: any, idx: number) => (
                <div key={img.id} className={`owner-gallery-item ${idx === 0 ? 'primary' : ''}`}>
                  <img src={img.imageUrl} alt={`Property ${idx}`} />
                  {idx === 0 && <span className="primary-badge">Primary</span>}
                </div>
              ))
            ) : (
              <div className="detail-img-placeholder" style={{ height: '200px', borderRadius: '12px' }}>🏙️</div>
            )}
          </div>
        </div>

        {/* Right: Property Details */}
        <div className="detail-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Listing Details</h3>
          
          <div className="detail-row">
            <span className="label text-muted">Property Type</span>
            <span className="value" style={{ fontWeight: 600 }}>{property.propertyType?.replace('_', ' ')}</span>
          </div>
          <div className="detail-row">
            <span className="label text-muted">Hourly Price</span>
            <span className="value" style={{ fontWeight: 600 }}>₹{property.hourlyPrice} / hr</span>
          </div>
          <div className="detail-row">
            <span className="label text-muted">Daily Price</span>
            <span className="value" style={{ fontWeight: 600 }}>₹{property.dailyPrice} / day</span>
          </div>
          <div className="detail-row">
            <span className="label text-muted">Guest Capacity</span>
            <span className="value" style={{ fontWeight: 600 }}>Up to {property.guestCapacity} guests</span>
          </div>
          
          <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>Amenities</h4>
            <div className="amenity-chips-container">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((amenity: any) => (
                  <span key={amenity.id} className="amenity-chip" style={{ background: '#f1f5f9', color: '#334155', border: 'none' }}>
                    {amenity.icon || '✨'} {amenity.name}
                  </span>
                ))
              ) : (
                <span className="text-muted">No amenities listed.</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Bookings List for this Property */}
      <div className="dashboard-section" style={{ marginTop: '1rem' }}>
        <div className="dashboard-section-header">
          <h3>Reservations for {property.title}</h3>
        </div>

        {propertyBookings.length === 0 ? (
          <div className="empty-state-premium" style={{ padding: '3rem' }}>
            <span className="empty-icon">📭</span>
            <h3>No bookings yet</h3>
            <p>You don't have any reservations for this specific property yet.</p>
          </div>
        ) : (
          <div className="dashboard-list-container">
            {propertyBookings.map((booking) => (
              <div key={booking.id} className="dashboard-list-item">
                <div className="list-item-left">
                  <div className="list-item-avatar" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '1rem', fontWeight: 'bold' }}>
                    #{booking.id}
                  </div>
                  <div className="list-item-info">
                    <h4 className="list-item-title">{new Date(booking.bookingDate).toLocaleDateString()}</h4>
                    <p className="list-item-subtitle">
                      {booking.startTime} - {booking.endTime} • {booking.numberOfGuests} Guests
                    </p>
                  </div>
                </div>

                <div className="list-item-center">
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  <span className={`status-badge payment-${booking.paymentStatus?.toLowerCase() || 'pending'}`}>{booking.paymentStatus || 'PENDING'}</span>
                </div>

                <div className="list-item-right" style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>₹{booking.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default OwnerPropertyDetail;