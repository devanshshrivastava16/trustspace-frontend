import { useEffect, useState } from 'react';
import { getMyReviews, deleteReview } from '../api';
import ReviewCard from '../components/ReviewCard';
import ReviewFormModal from '../components/ReviewFormModal';
import type { Review } from '../types';

function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit State
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const fetchReviews = () => {
    setLoading(true);
    getMyReviews()
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  if (loading) return <div className="app-content"><div className="loading-state">Loading your reviews...</div></div>;

  return (
    <div className="dashboard-layout" style={{ maxWidth: '1000px' }}>
      <div className="dashboard-header">
        <h1 className="section-title">My Reviews</h1>
        <p className="text-muted">Manage the feedback you've left for spaces you booked.</p>
      </div>

      {error && <div className="message-banner error">{error}</div>}

      {reviews.length === 0 && !error ? (
        <div className="empty-state-premium">
          <span className="empty-icon">⭐</span>
          <h3>No reviews yet</h3>
          <p>After you complete a booking, you can leave a review here.</p>
        </div>
      ) : (
        <div className="my-reviews-list">
          {reviews.map(review => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              isOwner={true}
              showPropertyDetails={true}
              onEdit={setEditingReview}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editingReview && (
        <ReviewFormModal 
          propertyId={editingReview.property.id}
          bookingId={0} // Not needed for updates
          existingReview={editingReview}
          onSuccess={() => {
            setEditingReview(null);
            fetchReviews();
          }}
          onCancel={() => setEditingReview(null)}
        />
      )}
    </div>
  );
}

export default MyReviews;