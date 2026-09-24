import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookingById, cancelBooking } from '../api';

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    getBookingById(Number(id))
      .then(setBooking)
      .catch(() => navigate('/bookings'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    const reason = window.prompt("Optional: Please provide a reason for cancellation");
    if (reason === null) return;

    setCancelling(true);
    try {
      const updatedBooking = await cancelBooking(booking.id, reason);
      setBooking(updatedBooking);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="app-content"><div className="loading-state">Loading booking details...</div></div>;
  if (!booking) return null;

  const propertyImage = booking.property?.images?.find((img: any) => img.isPrimary)?.imageUrl 
    || booking.property?.images?.[0]?.imageUrl;

  const status = booking.status || 'PENDING';
  const paymentStatus = booking.paymentStatus || 'PENDING';
  const isCancellable = status === 'PENDING' || status === 'APPROVED';

  const parseTimeToHours = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours + minutes / 60;
  };

  const calculateTotalPrice = () => {
    if (booking.totalAmount != null) return booking.totalAmount;
    const hourlyRate = booking.property?.hourlyPrice;
    const start = booking.startTime ? parseTimeToHours(booking.startTime) : null;
    const end = booking.endTime ? parseTimeToHours(booking.endTime) : null;
    if (hourlyRate == null || start == null || end == null) return null;

    let duration = end - start;
    if (duration <= 0) duration += 24;
    return Math.round(duration * hourlyRate);
  };

  const totalPrice = calculateTotalPrice();

  // Determine timeline progress
  const timelineSteps = [
    { label: 'Requested', done: true, error: false },
    { 
      label: status === 'REJECTED' ? 'Rejected' : 'Approved', 
      done: status === 'APPROVED' || status === 'COMPLETED' || paymentStatus === 'COMPLETED', 
      error: status === 'REJECTED' 
    },
    { 
      label: paymentStatus === 'FAILED' ? 'Payment Failed' : paymentStatus === 'REFUNDED' ? 'Refunded' : 'Payment Completed', 
      done: paymentStatus === 'COMPLETED' || paymentStatus === 'REFUNDED', 
      error: paymentStatus === 'FAILED' || paymentStatus === 'REFUNDED'
    },
    { 
      label: status === 'CANCELLED' ? 'Cancelled' : 'Completed', 
      done: status === 'COMPLETED' || status === 'CANCELLED', 
      error: status === 'CANCELLED' 
    }
  ];

  return (
    <div className="booking-detail-layout">
      <div className="settings-header">
        <h1>Booking #{booking.id}</h1>
        <button className="btn-outline" onClick={() => navigate('/bookings')}>← Back to Bookings</button>
      </div>

      <div className="detail-hero-split">
        {/* Left: Property & Timeline */}
        <div className="detail-info-section">
          
          <div className="booking-property-card">
            <div className="main-image-container" style={{ aspectRatio: '16/9' }}>
              {propertyImage ? (
                <img src={propertyImage} alt={booking.property?.title} className="detail-main-img" />
              ) : (
                <div className="detail-img-placeholder">🏙️</div>
              )}
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{booking.property?.title}</h3>
                  <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>📍 {booking.property?.address}</p>
                </div>
                <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
              </div>
              <Link to={`/properties/${booking.property?.id}`} className="btn-text" style={{ marginTop: '1rem', display: 'inline-block' }}>
                View Full Property Details →
              </Link>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="detail-card">
            <h3>Booking Timeline</h3>
            <div className="timeline-container">
              {timelineSteps.map((step, index) => (
                <div key={index} className={`timeline-step ${step.done ? 'done' : ''} ${step.error ? 'error' : ''}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>{step.label}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking Information */}
        <div className="detail-info-section">
          
          <div className="detail-card">
            <h3>Reservation Details</h3>
            <div className="detail-grid" style={{ marginTop: '1.5rem' }}>
              <div className="info-block">
                <span className="info-label">Date</span>
                <span className="info-value">{new Date(booking.bookingDate).toLocaleDateString()}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Time</span>
                <span className="info-value">{booking.startTime} - {booking.endTime}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Guests</span>
                <span className="info-value">{booking.numberOfGuests}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Total Amount</span>
                <span className="info-value" style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.2rem' }}>
                  ₹{totalPrice != null ? totalPrice : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Payment & Requests</h3>
              <span className={`status-badge payment-${paymentStatus.toLowerCase()}`}>{paymentStatus}</span>
            </div>
            
            {booking.specialRequests ? (
              <div className="info-block" style={{ marginTop: '1.5rem' }}>
                <span className="info-label">Special Requests</span>
                <p className="info-box neutral">{booking.specialRequests}</p>
              </div>
            ) : (
              <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>No special requests provided.</p>
            )}

            {booking.cancellationReason && (
              <div className="info-block" style={{ marginTop: '1.5rem' }}>
                <span className="info-label" style={{ color: '#ef4444' }}>Cancellation Reason</span>
                <p className="info-box danger">{booking.cancellationReason}</p>
              </div>
            )}
          </div>

          {isCancellable && (
            <div className="detail-card danger-zone">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '0.2rem' }}>Cancel Booking</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>This action cannot be undone.</p>
                </div>
                <button className="btn-danger" onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default BookingDetail;