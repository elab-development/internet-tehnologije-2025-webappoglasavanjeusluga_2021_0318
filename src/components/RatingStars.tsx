type RatingStarsProps = {
  rating: number; // 1–5
};

export function RatingStars({ rating }: RatingStarsProps) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((n) => (
        <p
          key={n}
          className={n <= rating ? "text-yellow-400" : "text-gray-400"}
        >
          ★
        </p>
      ))}
    </div>
  );
}