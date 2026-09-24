import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkWishlistStatus, addToWishlist, removeFromWishlist, getToken } from '../api';

interface WishlistButtonProps {
  propertyId: number;
  initialStatus?: boolean; // Optional: If the parent already knows the status
}

function WishlistButton({ propertyId, initialStatus }: WishlistButtonProps) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(initialStatus || false);
  const [loading, setLoading] = useState(false);

  // If initialStatus wasn't provided, check it dynamically
  useEffect(() => {
    if (initialStatus === undefined && getToken()) {
      checkWishlistStatus(propertyId)
        .then(data => setIsWishlisted(data.isWishlisted))
        .catch(err => console.error("Failed to check wishlist status", err));
    }
  }, [propertyId, initialStatus]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the property card

    if (!getToken()) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const previousStatus = isWishlisted;
    
    // Optimistic UI Update (feels faster to the user)
    setIsWishlisted(!previousStatus);

    try {
      if (previousStatus) {
        await removeFromWishlist(propertyId);
      } else {
        await addToWishlist(propertyId);
      }
      
      // Tell the Navbar to update its count
      window.dispatchEvent(new Event('wishlistUpdated'));
      
    } catch (err) {
      // Revert if API fails
      setIsWishlisted(previousStatus);
      console.error("Failed to toggle wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={`heart-btn ${isWishlisted ? 'active' : ''} ${loading ? 'loading' : ''}`}
      onClick={handleToggle}
      disabled={loading}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWishlisted ? '♥' : '♡'}
    </button>
  );
}

export default WishlistButton;