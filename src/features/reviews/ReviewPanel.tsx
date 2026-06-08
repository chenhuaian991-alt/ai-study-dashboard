import { useState } from 'react';
import { ReviewForm } from './ReviewForm';
import { ReviewCard } from './ReviewCard';
import { getDailyReviews, deleteDailyReview } from './reviewStorage';

export function ReviewPanel() {
  const [reviews, setReviews] = useState(getDailyReviews);

  function refresh() {
    setReviews(getDailyReviews());
  }

  function handleDeleteReview(id: string, date: string) {
    if (!window.confirm(`确认删除 ${date} 的复盘吗？`)) return;
    deleteDailyReview(id);
    refresh();
  }

  return (
    <div className="review-panel">
      <h2 className="review-panel-title">每日复盘</h2>
      <ReviewForm onCreated={refresh} />
      {reviews.length === 0 ? (
        <div className="review-empty">还没有复盘记录，使用上方表单添加第一条</div>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onDeleteReview={handleDeleteReview} />
          ))}
        </div>
      )}
    </div>
  );
}
