import { useState, useMemo } from 'react';
import { createBooking, getToken } from '../api';

interface BookingFormProps {
  propertyId: number;
  hourlyPrice?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function BookingForm({ propertyId, hourlyPrice, onSuccess, onCancel }: BookingFormProps) {
  // Setup default date for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [bookingDate, setBookingDate] = useState(minDateStr);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [numberOfGuests, setNumberOfGuests] = useState('10');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Price Calculation Logic
  const estimatedTotal = useMemo(() => {
    if (!hourlyPrice || !startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (hours < 0) hours += 24; // Handle cross-midnight logic safely
    return Math.max(0, hours * hourlyPrice);
  }, [startTime, endTime, hourlyPrice]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!getToken()) {
      setError('Your session has expired. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      await createBooking({
        propertyId,
        bookingDate,
        startTime,
        endTime,
        numberOfGuests: parseInt(numberOfGuests),
        specialRequests: specialRequests || undefined
      });
      // Delay closing modal slightly so user sees success state if we added one, 
      // but API success resolves quickly here.
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking.');
      setLoading(false);
    }
  };

  return (
    <div className="city-modal-overlay" onClick={onCancel}>
      <div className="city-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        
        <div className="modal-header-simple" style={{ marginBottom: '1rem' }}>
          <h3>Request Booking</h3>
          <button className="close-icon" onClick={onCancel}>✕</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Date *</label>
            <input 
              type="date" 
              value={bookingDate} 
              onChange={(e) => setBookingDate(e.target.value)} 
              min={minDateStr}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Start Time *</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>End Time *</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div className="input-group">
            <label>Number of Guests *</label>
            <input 
              type="number" 
              min="1" 
              value={numberOfGuests} 
              onChange={(e) => setNumberOfGuests(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Special Requests (Optional)</label>
            <textarea 
              className="custom-textarea"
              rows={3}
              placeholder="Any requirements for the owner?"
              value={specialRequests} 
              onChange={(e) => setSpecialRequests(e.target.value)} 
            />
          </div>

          {/* Live Price Preview */}
          {hourlyPrice && estimatedTotal > 0 && (
            <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bae6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#0369a1', fontWeight: 500 }}>Estimated Total:</span>
              <span style={{ color: '#0284c7', fontSize: '1.2rem', fontWeight: 700 }}>₹{estimatedTotal.toLocaleString()}</span>
            </div>
          )}

          {error && <div className="message-banner error">{error}</div>}

          <button type="submit" className="btn-solid" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Processing...' : 'Confirm Reservation'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default BookingForm;