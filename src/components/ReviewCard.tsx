import { useState } from 'react';
import RatingStars from './RatingStars';
import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
  isOwner?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (id: number) => void;
  showPropertyDetails?: boolean;
}

function ReviewCard({ review, isOwner, onEdit, onDelete, showPropertyDetails }: ReviewCardProps) {
  const [expandedImg, setExpandedImg] = useState<string | null>(null);

  return (
    <div className="review-card-modern">
      <div className="review-card-header">
        <div className="reviewer-info-block">
          <div className="reviewer-avatar-small">
            {review.user?.profileImage ? (
              <img src={review.user.profileImage} alt={review.user.fullName} />
            ) : (
              <span>{review.user?.fullName?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div>
            <h4 className="reviewer-name">{review.user?.fullName}</h4>
            <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {isOwner && (
          <div className="review-actions">
            <button className="btn-icon" onClick={() => onEdit?.(review)}>✏️</button>
            <button className="btn-icon text-danger" onClick={() => {
              if (window.confirm('Are you sure you want to delete this review?')) {
                onDelete?.(review.id);
              }
            }}>🗑️</button>
          </div>
        )}
      </div>

      {showPropertyDetails && review.property && (
        <div className="review-property-context">
          Review for: <strong>{review.property.title}</strong>
        </div>
      )}

      <div className="review-rating-row">
        <RatingStars rating={review.rating} />
        <span className="rating-number">{review.rating.toFixed(1)}</span>
      </div>

      {review.comment && <p className="review-comment-text">{review.comment}</p>}

      {review.images && review.images.length > 0 && (
        <div className="review-images-strip">
          {review.images.map((img) => (
            <img 
              key={img.id} 
              src={img.imageUrl} 
              alt="Review attachment" 
              onClick={() => setExpandedImg(img.imageUrl)}
            />
          ))}
        </div>
      )}

      {/* Image Modal */}
      {expandedImg && (
        <div className="image-modal-overlay" onClick={() => setExpandedImg(null)}>
          <img src={expandedImg} alt="Expanded preview" className="image-modal-content" onClick={e => e.stopPropagation()}/>
          <button className="close-icon" onClick={() => setExpandedImg(null)}>✕</button>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;