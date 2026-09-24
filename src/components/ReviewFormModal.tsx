import { useState } from 'react';
import { createReview, updateReview } from '../api';

interface ReviewFormProps {
  propertyId: number;
  bookingId: number; // Required by API for creation
  existingReview?: any; // If provided, we are in Edit Mode
  onSuccess: () => void;
  onCancel: () => void;
}

function ReviewFormModal({ propertyId, bookingId, existingReview, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (existingReview) {
        await updateReview(existingReview.id, { rating, comment });
      } else {
        await createReview({ propertyId, bookingId, rating, comment });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="city-modal-overlay" onClick={onCancel}>
      <div className="city-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header-simple">
          <h3>{existingReview ? 'Edit Review' : 'Write a Review'}</h3>
          <button className="close-icon" onClick={onCancel}>✕</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          
          <div className="input-group" style={{ alignItems: 'center' }}>
            <label>Rating *</label>
            <div className="interactive-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`star-select ${rating >= star ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Comment (Optional)</label>
            <textarea 
              className="custom-textarea" 
              rows={4} 
              maxLength={2000}
              placeholder="Tell others about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {error && <div className="message-banner error">{error}</div>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={onCancel} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-solid" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Saving...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewFormModal;
