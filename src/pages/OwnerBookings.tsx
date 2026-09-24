import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getOwnerBookings, approveBooking, rejectBooking } from '../api';
import type { Booking } from '../types';
import StatCard from '../components/StatCard';
import BookingDetailsModal from '../components/BookingDetailsModal';

function OwnerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Actions
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    getOwnerBookings()
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      })
      .finally(() => setLoading(false));
  };

  const handleAction = async (bookingId: number, approve: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActionLoading(bookingId);
    try {
      const updated = approve ? await approveBooking(bookingId) : await rejectBooking(bookingId);
      setBookings((current) => current.map((b) => b.id === bookingId ? updated : b));
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(updated);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update booking');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        booking.user?.fullName?.toLowerCase().includes(query) ||
        booking.property?.title?.toLowerCase().includes(query) ||
        booking.id.toString().includes(query);
        
      return matchesStatus && matchesSearch;
    });
  }, [bookings, searchQuery, statusFilter]);

  const totalBookings = bookings.length;
  const pendingApprovals = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedBookings = bookings.filter(b => b.status === 'APPROVED' || b.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="app-content">
        <div className="loading-state">Loading booking dashboard...</div>
      </div>
    );
  }

  return (
    <div className="properties-layout" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="settings-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 className="section-title">Booking Dashboard</h1>
          <p className="text-muted">Manage all guest requests and active bookings across your properties.</p>
        </div>
      </div>

      {error && <div className="message-banner error">{error}</div>}

      <div className="properties-grid" style={{ gap: '1rem', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', marginBottom: '2rem' }}>
        <StatCard title="Total Requests" value={totalBookings} description="Lifetime booking requests received." />
        <StatCard title="Pending Approvals" value={pendingApprovals} description="Requests requiring your action." />
        <StatCard title="Confirmed Bookings" value={confirmedBookings} description="Approved or completed stays." />
      </div>

      <div className="detail-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                className={statusFilter === status ? 'btn-solid' : 'btn-outline'}
                onClick={() => setStatusFilter(status)}
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                {status}
              </button>
            ))}
          </div>
          <div style={{ flex: '1', minWidth: '250px', maxWidth: '350px' }}>
            <input
              type="text"
              placeholder="Search by ID, guest name, or property..."
              className="city-search-input"
              style={{ width: '100%', marginBottom: 0, padding: '0.6rem 1rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="empty-state-premium">
            <span className="empty-icon">🔍</span>
            <h3>No bookings found</h3>
            <p>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="booking-requests-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
            {filteredBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="booking-request-card" 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', transition: 'box-shadow 0.2s', padding: '1.25rem' }}
                onClick={() => setSelectedBooking(booking)}
              >
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>#{booking.id}</span>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                </div>
                
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{booking.property?.title || 'Unknown Property'}</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Guest: <strong>{booking.user?.fullName || 'N/A'}</strong></p>
                
                <div style={{ display: 'flex', gap: '1rem', width: '100%', fontSize: '0.875rem', marginBottom: '1rem', background: 'var(--color-gray-100)', padding: '0.75rem', borderRadius: '4px' }}>
                  <div>
                    <div className="text-muted">Date</div>
                    <div>{new Date(booking.bookingDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-muted">Time</div>
                    <div>{booking.startTime} - {booking.endTime}</div>
                  </div>
                  <div>
                    <div className="text-muted">Total</div>
                    <div>₹{booking.totalAmount || '—'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span className={`status-badge payment-${booking.paymentStatus.toLowerCase()}`}>{booking.paymentStatus}</span>
                  
                  {booking.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                       <button
                        className="btn-danger"
                        disabled={actionLoading === booking.id}
                        onClick={(e) => handleAction(booking.id, false, e)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                      >
                        Reject
                      </button>
                      <button
                        className="btn-solid"
                        disabled={actionLoading === booking.id}
                        onClick={(e) => handleAction(booking.id, true, e)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <BookingDetailsModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
          onUpdate={(updated) => {
            setBookings(current => current.map(b => b.id === updated.id ? updated : b));
            setSelectedBooking(updated);
          }} 
        />
      )}
    </div>
  );
}

export default OwnerBookings;
