import React from 'react';
import type { Booking } from '../types';
import { approveBooking, rejectBooking } from '../api';

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdate: (updatedBooking: Booking) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose, onUpdate }) => {
  const [actionLoading, setActionLoading] = React.useState(false);

  const handleAction = async (approve: boolean) => {
    setActionLoading(true);
    try {
      const updated = approve ? await approveBooking(booking.id) : await rejectBooking(booking.id);
      onUpdate(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update booking');
    } finally {
      setActionLoading(false);
    }
  };

  const property = booking.property;
  const user = booking.user;

  return (
    <div className="city-modal-overlay" onClick={onClose} style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="city-modal" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-simple" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Booking Details #{booking.id}</h3>
          <button className="close-icon" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Section */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
            <span className={`status-badge payment-${booking.paymentStatus.toLowerCase()}`}>{booking.paymentStatus}</span>
          </div>

          {/* Customer Details */}
          <div className="detail-card" style={{ padding: '1rem', background: 'var(--color-gray-100)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Customer Details</h4>
            <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {user?.fullName || 'N/A'}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {user?.email || 'N/A'}</p>
          </div>

          {/* Property Details */}
          <div className="detail-card" style={{ padding: '1rem', background: 'var(--color-gray-100)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Property Details</h4>
            <p style={{ margin: '0.25rem 0' }}><strong>Title:</strong> {property?.title || 'N/A'}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>Location:</strong> {property?.address}, {property?.city?.name}</p>
          </div>

          {/* Booking Details */}
          <div className="detail-card" style={{ padding: '1rem', background: 'var(--color-gray-100)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Booking Info</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <p style={{ margin: '0.25rem 0' }}><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Guests:</strong> {booking.numberOfGuests}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Total Amount:</strong> ₹{booking.totalAmount || '—'}</p>
            </div>
            {booking.specialRequests && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--color-gray-50)', borderRadius: '4px', border: '1px solid var(--color-gray-200)' }}>
                <strong>Special Requests:</strong>
                <p style={{ margin: '0.25rem 0 0 0' }}>{booking.specialRequests}</p>
              </div>
            )}
            {booking.cancellationReason && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--color-danger-light)', borderRadius: '4px', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}>
                <strong>Cancellation Reason:</strong>
                <p style={{ margin: '0.25rem 0 0 0' }}>{booking.cancellationReason}</p>
              </div>
            )}
          </div>

          {/* Booking Timeline */}
          <div className="detail-card" style={{ padding: '1rem', background: 'var(--color-gray-100)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Booking Timeline</h4>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, borderLeft: '2px solid var(--color-gray-300)', marginLeft: '10px' }}>
              <li style={{ position: 'relative', paddingLeft: '20px', marginBottom: '10px' }}>
                <span style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-success)' }}></span>
                Request Submitted
              </li>
              <li style={{ position: 'relative', paddingLeft: '20px', marginBottom: '10px', opacity: booking.status === 'PENDING' ? 0.5 : 1 }}>
                <span style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: booking.status === 'PENDING' ? 'var(--color-gray-300)' : (booking.status === 'REJECTED' || booking.status === 'CANCELLED' ? 'var(--color-danger)' : '#2196f3') }}></span>
                {booking.status === 'PENDING' ? 'Waiting for Approval' : `Request ${booking.status}`}
              </li>
              {booking.paymentStatus === 'COMPLETED' && (
                <li style={{ position: 'relative', paddingLeft: '20px', marginBottom: '0' }}>
                  <span style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: '#9c27b0' }}></span>
                  Payment Completed
                </li>
              )}
            </ul>
          </div>

          {/* Actions */}
          {booking.status === 'PENDING' && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                className="btn-danger"
                disabled={actionLoading}
                onClick={() => handleAction(false)}
                style={{ flex: 1 }}
              >
                Reject Request
              </button>
              <button
                className="btn-solid"
                disabled={actionLoading}
                onClick={() => handleAction(true)}
                style={{ flex: 1 }}
              >
                Approve Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;