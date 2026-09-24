import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProperties, getOwnerBookings } from '../api';
import type { Booking, Property } from '../types';
import OwnerPropertyCard from '../components/OwnerPropertyCard';
import StatCard from '../components/StatCard';

function OwnerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getMyProperties(), getOwnerBookings()])
      .then(([propertyData, bookingData]) => {
        setProperties(Array.isArray(propertyData) ? propertyData : []);
        setBookings(Array.isArray(bookingData) ? bookingData : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load owner dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const propertyBookings = useMemo(() => {
    return bookings.reduce<Record<number, Booking[]>>((acc, booking) => {
      const propertyId = booking.property?.id;
      if (!propertyId) return acc;
      if (!acc[propertyId]) acc[propertyId] = [];
      acc[propertyId].push(booking);
      return acc;
    }, {});
  }, [bookings]);

  const totalProperties = properties.length;
  const totalBookings = bookings.length;
  const pendingApprovals = bookings.filter((booking) => booking.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="app-content">
        <div className="loading-state">Loading owner dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <h1 className="section-title" style={{ marginBottom: '0.2rem' }}>Owner Dashboard</h1>
          <p className="text-muted">Manage your spaces, booking requests, and property analytics in one place.</p>
        </div>
        <div className="dashboard-header-actions">
          <Link to="/owner/create-property" className="btn-solid">Post New Space</Link>
        </div>
      </div>

      {error && <div className="message-banner error">{error}</div>}

      {/* Stats Grid */}
      <div className="dashboard-stats-grid">
        {/* Assuming StatCard renders a div. If not, you can wrap these or apply the .stat-card class inside that component */}
        <div className="stat-card">
          <div className="stat-icon blue">🏢</div>
          <div className="stat-content">
            <h3>{totalProperties}</h3>
            <p>Total Properties</p>
            <span className="stat-desc">Your active spaces on TrustSpace.</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon green">📅</div>
          <div className="stat-content">
            <h3>{totalBookings}</h3>
            <p>Total Bookings</p>
            <span className="stat-desc">All requests across your properties.</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div className="stat-content">
            <h3>{pendingApprovals}</h3>
            <p>Pending Approvals</p>
            <span className="stat-desc">Bookings waiting for your review.</span>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h3>Your Properties</h3>
          <Link to="/owner/create-property" className="btn-text">Add New Property →</Link>
        </div>

        {properties.length === 0 ? (
          <div className="empty-state-premium">
            <span className="empty-icon">🏠</span>
            <h3>No properties yet</h3>
            <p>List your first space and start receiving booking requests.</p>
            <Link to="/owner/create-property" className="btn-solid">Post Spaces</Link>
          </div>
        ) : (
          <div className="dashboard-properties-grid">
            {properties.map((property) => {
              const propertyBookingList = propertyBookings[property.id] || [];
              const pendingCount = propertyBookingList.filter((booking) => booking.status === 'PENDING').length;

              return (
                <OwnerPropertyCard
                  key={property.id}
                  property={property}
                  bookingCount={propertyBookingList.length}
                  pendingRequests={pendingCount}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Bookings Section */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h3>Recent Booking Requests</h3>
          <Link to="/owner/bookings" className="btn-text">View All Bookings →</Link>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state-premium">
            <span className="empty-icon">📭</span>
            <h3>No booking requests</h3>
            <p>Your properties will show booking requests as guests submit them.</p>
          </div>
        ) : (
          <div className="dashboard-list-container">
            {bookings.slice(0, 6).map((booking) => (
              <div key={booking.id} className="dashboard-list-item">
                
                <div className="list-item-left">
                  <div className="list-item-avatar">
                    {booking.property?.images?.[0]?.imageUrl ? (
                      <img src={booking.property.images[0].imageUrl} alt="Property" />
                    ) : (
                      <span>🏙️</span>
                    )}
                  </div>
                  <div className="list-item-info">
                    <h4 className="list-item-title">{booking.property?.title || 'Unknown property'}</h4>
                    <p className="list-item-subtitle">
                      ID: #{booking.id} • {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                </div>

                <div className="list-item-center">
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  <span className={`status-badge payment-${booking.paymentStatus.toLowerCase()}`}>{booking.paymentStatus}</span>
                </div>

                <div className="list-item-right">
                  <Link to={`/owner/properties/${booking.property?.id}`} className="btn-outline btn-small">
                    Manage
                  </Link>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;