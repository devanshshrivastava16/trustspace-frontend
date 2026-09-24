import { useEffect, useState } from 'react';
import { getAverageRating } from '../api';
import ReviewCard from './ReviewCard';
import type { Review } from '../types';

interface ReviewsSectionProps {
  propertyId: number;
  reviews?: Review[];
}

function ReviewsSection({ propertyId, reviews = [] }: ReviewsSectionProps) {
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    getAverageRating(propertyId).then(setStats).catch(() => {});
  }, [propertyId]);

  return (
    <div className="property-reviews-section py-6">
      <div className="reviews-header-block mb-6">
        <h2 className="section-title">Reviews & Ratings</h2>
        {stats.totalReviews > 0 ? (
          <div className="reviews-stats-summary">
            <span className="big-rating-number">⭐ {stats.averageRating.toFixed(1)}</span>
            <span className="total-reviews-count">({stats.totalReviews} Reviews)</span>
          </div>
        ) : (
          <p className="text-muted">No reviews yet.</p>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="reviews-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsSection;