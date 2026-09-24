function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <span className="rating-stars-visual">
      {'★'.repeat(fullStars)}
      {hasHalfStar && '⯨'}
      {'☆'.repeat(emptyStars)}
    </span>
  );
}

export default RatingStars;