import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings } from '../api';

function parseTimeToHours(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours + minutes / 60;
}

function getBookingTotalAmount(booking: any) {
  if (booking.totalAmount != null) return booking.totalAmount;
  const rate = booking.property?.hourlyPrice;
  const start = booking.startTime ? parseTimeToHours(booking.startTime) : null;
  const end = booking.endTime ? parseTimeToHours(booking.endTime) : null;
  if (rate == null || start == null || end == null) return null;

  let duration = end - start;
  if (duration <= 0) duration += 24;
  return Math.round(duration * rate);
}

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="app-content"><div className="loading-state">Loading your bookings...</div></div>;

  return (
    <div className="properties-layout" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="settings-header" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">My Bookings</h1>
      </div>

      {error && <div className="message-banner error">{error}</div>}

      {bookings.length === 0 && !error ? (
        <div className="empty-state-premium">
          <span className="empty-icon">📅</span>
          <h3>No bookings yet</h3>
          <p>You haven't made any reservations. Explore spaces to get started!</p>
          <button className="btn-solid" onClick={() => navigate('/properties')}>Explore Spaces</button>
        </div>
      ) : (
        <div className="properties-grid">
          {bookings.map((booking) => {
            const propertyImage = booking.property?.images?.find((img: any) => img.isPrimary)?.imageUrl 
              || booking.property?.images?.[0]?.imageUrl;

            return (
              <div key={booking.id} className="property-card-modern" onClick={() => navigate(`/bookings/${booking.id}`)}>
                <div className="property-image-wrapper" style={{ aspectRatio: '16/9' }}>
                  {propertyImage ? (
                    <img src={propertyImage} alt="Property" />
                  ) : (
                    <div className="property-image-placeholder-modern"><span>🏙️</span></div>
                  )}
                  <div className="property-badges" style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className={`status-badge ${booking.status?.toLowerCase()}`}>{booking.status}</span>
                  </div>
                </div>
                
                <div className="property-card-content" style={{ padding: '1rem' }}>
                  <h3 className="property-title">{booking.property?.title || 'Unknown Property'}</h3>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    📍 {booking.property?.address}
                  </p>
                  
                  <div className="property-features" style={{ marginBottom: '0.5rem' }}>
                    <span>📅 {new Date(booking.bookingDate).toLocaleDateString()}</span>
                    <span>⏰ {booking.startTime} - {booking.endTime}</span>
                  </div>
                  
                  <div className="property-price-row" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Payment</span>
                      <span className={`status-text payment-${(booking.paymentStatus || 'PENDING').toLowerCase()}`}>
                        {booking.paymentStatus || 'PENDING'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                      <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Total</span>
                      <span className="price-amount" style={{ color: '#0f172a' }}>
                        ₹{getBookingTotalAmount(booking) ?? '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Bookings;